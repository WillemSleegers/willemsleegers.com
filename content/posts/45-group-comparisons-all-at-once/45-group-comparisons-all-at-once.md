---
title: Group comparisons all at once
description: >-
  An example of how to run multiple group comparisons all at once using a single
  regression model.
date: 2025-05-02T00:00:00.000Z
categories:
  - R
  - statistics
---


On multiple occasions I’ve had to analyze data and check whether one or
more groups differ on any of multiple outcomes. My initial approach to
doing this consisted of simply running separate regressions, one for
each outcome. I then realized it’s probably possible to test for group
differences on multiple outcome all in the same model. In this post I
show how to do that and also check whether it’s the same as running
regressions separately.

Run the following setup code if you want to follow along. Note that it
includes a custom `rbinary()` function that generates some binary data
for us, which I use in the examples below.

<details class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
library(lme4)
library(marginaleffects)

# Custom function to generate a vector of 1s and 0s with a specified proportion of 1s
rbinary <- function(p, n, shuffle = TRUE) {
  # Validate inputs
  if (!is.numeric(n) || length(n) != 1 || n <= 0 || n != round(n)) {
    stop("n must be a positive integer")
  }

  if (!is.numeric(p) || length(p) != 1 || p < 0 || p > 1) {
    stop("p must be a numeric value between 0 and 1")
  }

  # Check if p*n is an integer to avoid rounding
  if (abs(p * n - round(p * n)) > .Machine$double.eps^0.5) {
    stop(
      "The product of proportion (p) and sample size (n) must be an integer to avoid rounding"
    )
  }

  # Generate the binary vector
  ones_count <- p * n
  result <- c(rep(1, ones_count), rep(0, n - ones_count))

  # Shuffle the vector only if shuffle is TRUE
  if (shuffle) {
    result <- sample(result)
  }

  return(result)
}
```

</details>

## Data

Say that we’re interested in assessing the proportions of multiple
outcomes for different groups. In the code below I set some parameters
such as the sample size per condition (`n`) and the proportion per group
per outcome. I then generate some data using the custom `rbinary()`
function which generates a vector of 1s and 0s with the proportion of 1s
matching the proportion given in the function. After that, I format the
data frame to be a long format (one outcome value per row) and do some
housekeeping such as setting the factor levels of the outcome variable
and converting the condition letter to upper case.

<details open class="code-fold">
<summary>Code</summary>

``` r
n <- 100
prop_one_a <- 0.5
prop_one_b <- 0.6
prop_two_a <- 0.25
prop_two_b <- 0.5
prop_three_a <- 0.25
prop_three_b <- 0.75

data <- tibble(
  one_a = rbinary(prop_one_a, n = n),
  one_b = rbinary(prop_one_b, n = n),
  two_a = rbinary(prop_two_a, n = n),
  two_b = rbinary(prop_two_b, n = n),
  three_a = rbinary(prop_three_a, n = n),
  three_b = rbinary(prop_three_b, n = n)
) |>
  pivot_longer(
    cols = everything(),
    names_to = c("outcome", "condition"),
    names_pattern = "(one|two|three)_(a|b)"
  ) |>
  mutate(
    outcome = fct(outcome, levels = c("one", "two", "three")),
    condition = str_to_upper(condition)
    )
```

</details>

Let’s take a look at what this data frame looks like:

<details open class="code-fold">
<summary>Code</summary>

``` r
head(data)
```

</details>

    # A tibble: 6 x 3
      outcome condition value
      <fct>   <chr>     <dbl>
    1 one     A             1
    2 one     B             0
    3 two     A             0
    4 two     B             1
    5 three   A             1
    6 three   B             1

And let’s also make sure the proportions are what they are supposed to
be (e.g., the proportion of condition A in outcome ‘one’ should be 0.5).

<details open class="code-fold">
<summary>Code</summary>

``` r
data |>
  group_by(outcome, condition) |>
  count(value) |>
  mutate(prop = n / sum(n)) |>
  filter(value == 1)
```

</details>

    # A tibble: 6 x 5
    # Groups:   outcome, condition [6]
      outcome condition value     n  prop
      <fct>   <chr>     <dbl> <int> <dbl>
    1 one     A             1    50  0.5 
    2 one     B             1    60  0.6 
    3 two     A             1    25  0.25
    4 two     B             1    50  0.5 
    5 three   A             1    25  0.25
    6 three   B             1    75  0.75

That looks correct. One thing we now would like to be able to do is
obtain the differences in proportions between the two groups, by
outcome.

## Analyzing a single outcome

Before analyzing the group differences for each outcome all at once,
let’s first simply look at a difference between conditions for one of
the outcomes. This is fairly straightforwardly done using a logistic
regression.

<details open class="code-fold">
<summary>Code</summary>

``` r
fit_one <- data |>
  filter(outcome == "one") |>
  glm(value ~ condition, data = _, family = binomial())

summary(fit_one)
```

</details>


    Call:
    glm(formula = value ~ condition, family = binomial(), data = filter(data, 
        outcome == "one"))

    Coefficients:
                  Estimate Std. Error z value Pr(>|z|)
    (Intercept) -1.301e-15  2.000e-01   0.000    1.000
    conditionB   4.055e-01  2.858e-01   1.419    0.156

    (Dispersion parameter for binomial family taken to be 1)

        Null deviance: 275.26  on 199  degrees of freedom
    Residual deviance: 273.23  on 198  degrees of freedom
    AIC: 277.23

    Number of Fisher Scoring iterations: 4

We can (and should) use the
[marginaleffects](https://marginaleffects.com) package to look at the
difference between condition A and B for this outcome, using its
`avg_comparisons()` function.

<details open class="code-fold">
<summary>Code</summary>

``` r
avg_comparisons(
  fit_one,
  variables = "condition"
)
```

</details>


     Estimate Std. Error    z Pr(>|z|)   S   2.5 % 97.5 %
          0.1       0.07 1.43    0.153 2.7 -0.0372  0.237

    Term: condition
    Type: response
    Comparison: B - A

We see a difference of 0.1, which matches our parameter values (0.6 -
0.5 = 0.1).

## Multiple outcomes all at once

Now, let’s run them all at once. The key is how to specify the formula.
Using our two variables (`outcome` and `condition`), we should use the
following formula:

    value ~ 0 + outcome + outcome:condition

With this formula, we:

1.  Supress the global intercept so each `outcome` gets their own
    intercept, rather than one of the outcomes becoming the reference
    category
2.  Include `outcome` so they get their own intercepts
3.  Include the interaction term `outcome:condition` so we can estimate
    separate condition effects for each outcome

The code to run the model looks as follows:

<details open class="code-fold">
<summary>Code</summary>

``` r
fit_all <- glm(
  value ~ 0 + outcome + outcome:condition,
  data = data,
  family = binomial()
)

summary(fit_all)
```

</details>


    Call:
    glm(formula = value ~ 0 + outcome + outcome:condition, family = binomial(), 
        data = data)

    Coefficients:
                              Estimate Std. Error z value Pr(>|z|)    
    outcomeone              -6.979e-16  2.000e-01   0.000 1.000000    
    outcometwo              -1.099e+00  2.309e-01  -4.757 1.96e-06 ***
    outcomethree            -1.099e+00  2.309e-01  -4.757 1.96e-06 ***
    outcomeone:conditionB    4.055e-01  2.858e-01   1.419 0.155948    
    outcometwo:conditionB    1.099e+00  3.055e-01   3.596 0.000323 ***
    outcomethree:conditionB  2.197e+00  3.266e-01   6.728 1.72e-11 ***
    ---
    Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

    (Dispersion parameter for binomial family taken to be 1)

        Null deviance: 831.78  on 600  degrees of freedom
    Residual deviance: 749.26  on 594  degrees of freedom
    AIC: 761.26

    Number of Fisher Scoring iterations: 4

We can again use the marginaleffects package to obtain the differences
between the two conditions, this time for each outcome separately by
using the `by` argument in `avg_comparisons()`.

<details open class="code-fold">
<summary>Code</summary>

``` r
avg_comparisons(
  fit_all,
  variables = "condition",
  by = "outcome",
)
```

</details>


     outcome Estimate Std. Error    z Pr(>|z|)    S   2.5 % 97.5 %
       one       0.10     0.0700 1.43    0.153  2.7 -0.0372  0.237
       two       0.25     0.0661 3.78   <0.001 12.6  0.1204  0.380
       three     0.50     0.0612 8.16   <0.001 51.5  0.3800  0.620

    Term: condition
    Type: response
    Comparison: B - A

There we go. Now we performed three logistic regression analyses using a
single model. Note that the results for outcome two are the same as for
the simple logistic regression we performed earlier.

Of course, with only three outcomes this might not seem particularly
worth it, but you can use this for a larger number of outcomes as well,
at which point this becomes quite convenient. Do note that you should
only do this if the outcomes are similar (e.g., all binary) and that you
should not do this with widely different types of outcomes.

## Dependent outcomes

In cases where the outcomes are not independent (e.g., using a
within-subjects design), you can extend this approach using a multilevel
model. In that case, the formula would look like:

    value ~ 0 + outcome + outcome:condition + (1 | outcome:condition)

## Summary

It’s possible to test group differences for multiple outcomes using a
single regression model. This means all results will be stored in a
single model object, making it easy to extract predictions and group
comparisons all at once.
