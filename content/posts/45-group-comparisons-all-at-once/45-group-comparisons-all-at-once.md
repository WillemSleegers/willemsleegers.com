---
title: Group comparisons all at once
description: >-
  An example of how to run multiple group comparisons all at once using a
  multi-level model.
date: 2025-05-02T00:00:00.000Z
categories:
  - R
  - statistics
knitr:
  opts_chunk:
    fig.path: ../../../public/figures/45-group-comparisons-all-at-once/
draft: true
---


On multiple occasions I’ve had to analyze data and check whether one or
more groups differ on any of multiple outcomes. When I first had to do
this, I analyzed this mainly by running separate regressions, one for
each outcome, to see whether there was a difference. I then realized
it’s probably possible to test for group differences on multiple outcome
all in the same (multi-level) model. In this post I show how to do that
and also check whether it’s the same as running regressions separately.

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

In order to test out whether we can look at group differences for
multiple outcomes, we need data. Let’s imagine that we’re interested in
assessing the proportions of multiple outcomes for different groups. In
the code below I set some parameters such as the sample size per
condition (`n`) and the proportion per group per outcome, and then I
generate some data using the custom `rbinary()` function. I format the
data frame to be a long format (one outcome value per row) and do some
housekeeping such as setting the factor levels of the outcome variable.

<details open class="code-fold">
<summary>Code</summary>

``` r
n <- 100
prop_one_a <- 0.5
prop_one_b <- 0.5
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

| outcome | condition | value |
|:--------|:----------|------:|
| one     | A         |     0 |
| one     | B         |     1 |
| two     | A         |     0 |
| two     | B         |     1 |
| three   | A         |     0 |
| three   | B         |     1 |

And let’s also make sure the proportions are what they are supposed to
be (e.g., the proportion of condition A should be 0.5).

<details open class="code-fold">
<summary>Code</summary>

``` r
data |>
  group_by(condition, outcome) |>
  count(value) |>
  mutate(prop = n / sum(n)) |>
  filter(value == 1)
```

</details>

| condition | outcome | value |   n | prop |
|:----------|:--------|------:|----:|-----:|
| A         | one     |     1 |  50 | 0.50 |
| A         | two     |     1 |  25 | 0.25 |
| A         | three   |     1 |  25 | 0.25 |
| B         | one     |     1 |  50 | 0.50 |
| B         | two     |     1 |  50 | 0.50 |
| B         | three   |     1 |  75 | 0.75 |

That looks correct. One thing we now would like to be able to do is
reproduce these proportions using a regression technique (i.e., a
logistic regression) and also obtain the difference in proportion
between the two groups, by outcome.

## Analyzing a single outcome

Before analyzing the group differences for each outcome all at once,
let’s first simply look at a difference between conditions for one of
the outcomes. This is fairly straightforwardly done using a logistic
regression.

<details open class="code-fold">
<summary>Code</summary>

``` r
fit_glm <- data |>
  filter(outcome == "two") |>
  glm(value ~ condition, data = _, family = binomial())

summary(fit_glm)
```

</details>


    Call:
    glm(formula = value ~ condition, family = binomial(), data = filter(data, 
        outcome == "two"))

    Coefficients:
                Estimate Std. Error z value Pr(>|z|)    
    (Intercept)  -1.0986     0.2309  -4.757 1.96e-06 ***
    conditionB    1.0986     0.3055   3.596 0.000323 ***
    ---
    Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

    (Dispersion parameter for binomial family taken to be 1)

        Null deviance: 264.63  on 199  degrees of freedom
    Residual deviance: 251.10  on 198  degrees of freedom
    AIC: 255.1

    Number of Fisher Scoring iterations: 4

Let’s use the marginaleffects package to look at the difference between
condition A and B for this outcome.

<details open class="code-fold">
<summary>Code</summary>

``` r
avg_comparisons(
  fit_glm,
  variables = "condition"
)
```

</details>


     Estimate Std. Error    z Pr(>|z|)    S 2.5 % 97.5 %
         0.25     0.0661 3.78   <0.001 12.6  0.12   0.38

    Term: condition
    Type:  response 
    Comparison: B - A

We see a difference of 0.25, which matches our parameter values (0.5 -
0.25 = 0.25).

## All at once

Now, let’s run them all at once using a multilevel logistic regression
model. The key is how to specify the formula.

<details open class="code-fold">
<summary>Code</summary>

``` r
fit_glmer <- glmer(
  value ~ 0 + outcome + outcome:condition + (1 | outcome:condition),
  data = data,
  family = binomial()
)
```

</details>

    boundary (singular) fit: see help('isSingular')

<details open class="code-fold">
<summary>Code</summary>

``` r
summary(fit_glmer)
```

</details>

    Generalized linear mixed model fit by maximum likelihood (Laplace
      Approximation) [glmerMod]
     Family: binomial  ( logit )
    Formula: value ~ 0 + outcome + outcome:condition + (1 | outcome:condition)
       Data: data

          AIC       BIC    logLik -2*log(L)  df.resid 
        767.3     798.1    -376.6     753.3       593 

    Scaled residuals: 
        Min      1Q  Median      3Q     Max 
    -1.7321 -1.0000 -0.5774  1.0000  1.7321 

    Random effects:
     Groups            Name        Variance Std.Dev.
     outcome:condition (Intercept) 0        0       
    Number of obs: 600, groups:  outcome:condition, 6

    Fixed effects:
                            Estimate Std. Error z value Pr(>|z|)    
    outcomeone                0.0000     0.2000   0.000 1.000000    
    outcometwo               -1.0986     0.2309  -4.757 1.96e-06 ***
    outcomethree             -1.0986     0.2309  -4.757 1.96e-06 ***
    outcomeone:conditionB     0.0000     0.2828   0.000 1.000000    
    outcometwo:conditionB     1.0986     0.3055   3.596 0.000323 ***
    outcomethree:conditionB   2.1972     0.3266   6.728 1.73e-11 ***
    ---
    Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

    Correlation of Fixed Effects:
                outcmn otcmtw otcmth otcmn:B otcmtw:B
    outcometwo   0.000                               
    outcomethre  0.000  0.000                        
    otcmn:cndtB -0.707  0.000  0.000                 
    otcmtw:cndB  0.000 -0.756  0.000  0.000          
    otcmthr:cnB  0.000  0.000 -0.707  0.000   0.000  
    optimizer (Nelder_Mead) convergence code: 0 (OK)
    boundary (singular) fit: see help('isSingular')

We can again use the marginaleffects package to obtain the differences
between the two conditions, this time for each outcome separately:

<details open class="code-fold">
<summary>Code</summary>

``` r
avg_comparisons(
  fit_glmer,
  variables = "condition",
  by = "outcome",
)
```

</details>


     outcome Estimate Std. Error    z Pr(>|z|)    S  2.5 % 97.5 %
       one       0.00     0.0707 0.00        1 -0.0 -0.139  0.139
       two       0.25     0.0661 3.78   <0.001 12.6  0.120  0.380
       three     0.50     0.0612 8.16   <0.001 51.5  0.380  0.620

    Term: condition
    Type:  response 
    Comparison: B - A

There we go. Now we performed three logistic regression analyses using a
single multilevel model. Note that the results for outcome two are the
same as for the simple logistic regression we performed earlier.

Of course, with only three outcomes this might not seem particularly
worth it, but you can use this for a larger number of outcomes as well,
at which point this becomes quite convenient.
