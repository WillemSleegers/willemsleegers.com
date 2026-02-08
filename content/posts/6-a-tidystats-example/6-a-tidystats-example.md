---
title: A tidystats example
description: >-
  An illustration of how to use tidystats to save statistics, using a
  replication study from the Many Labs 1 project.
date: 2021-04-25T00:00:00.000Z
updated: 2024-10-19T00:00:00.000Z
categories:
  - tidystats
  - statistics
  - tutorial
code-fold: show
draft: true
---


## Introduction

[Lorge and Curtiss
(1936)](https://psycnet.apa.org/record/1937-04240-001 "Lorge and Curtiss (1936)")
examined how a quotation is perceived when it is attributed to a liked
or disliked individual. They used a quotation that was attributed to
either Thomas Jefferson or to Vladimir Lenin and found that people agree
more with the quotation when the quotation was attributed to Jefferson.
In the [Many Labs replication
study](https://psycnet.apa.org/fulltext/2014-20922-002.html "Klein et al. (2014)"),
the quotation was attributed to either George Washington, the liked
individual, or Osama Bin Laden, the disliked individual. They also used
a different quotation, which was:

> I have sworn to only live free, even if I find bitter the taste of
> death.

Say we are interested in testing whether the result of Lorge and Curtiss
was succesfully replicated. That means we need to test whether the
source of the quotation affects how it is evaluated. We are also
interested in saving the statistics so we can later easily report them
in a manuscript, using tidystats.

Before getting into how tidystats should be used, let’s first simply
analyze the data. I have designed tidystats to be minimally invasive,
which means you do not need to substantially change your data analysis
workflow.

We’ll start with a basic setup where we load some packages, the data,
and set some theme-related settings.

<details open class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
library(tidystats)
library(knitr)

data <- data(quote_source)

theme_set(theme_minimal(base_size = 16))
primary <- "#16a34a"
secondary <- "#A3166F"

options(
  knitr.kable.NA = "-",
  digits = 2
)
```

</details>

## Analyzing the data

Our main effect of interest is the difference in responses to the quote
between the two conditions. Here I visualize this difference with a
violin plot. Note that the evaluation was assessed on a 9-point Likert
scale ranging from 1 (strongly agree) to 9 (strongly disagree). I
reverse coded this so that higher scores indicate more agreement.

<details open class="code-fold">
<summary>Code</summary>

``` r
ggplot(quote_source, aes(x = source, y = response)) +
  geom_violin(width = .5, fill = primary) +
  stat_summary(fun = "mean", geom = "point") +
  labs(x = "Quote source", y = "Quote agreement") +
  scale_y_continuous(breaks = 1:9)
```

</details>

<div id="fig-quote-source">

<img
src="6-a-tidystats-example_files/figure-commonmark/fig-quote-source-1.svg"
id="fig-quote-source" />

Figure 1

</div>

This looks like the effect is in the expected direction. Participants
agreed more with the quotation when they believed the quote to be from
George Washington compared to Osama Bin Laden.

Regarding descriptives, tidystats comes with its own functions to
calculate descriptives. One of them is the `describe_data()` function,
inspired by the `describe()` function from the psych package. You can
use it together with `group_by()` from the dplyr package to calculate a
set of descriptives for multiple groups.

<details open class="code-fold">
<summary>Code</summary>

``` r
quote_source |>
  group_by(source) |>
  describe_data(response) |>
  select(-var) |>
  kable(
    col.names = c(
      "Source", "Missing", "N", "M", "SD", "SE", "Min", "Max", "Range",
      "Median", "Mode", "Skew", "Kurtosis"
    )
  )
```

</details>

<div id="tbl-response-descriptives">

Table 1

<div class="cell-output-display">

| Source     | Missing |    N |   M |  SD |   SE | Min | Max | Range | Median | Mode |  Skew | Kurtosis |
|:-----------|--------:|-----:|----:|----:|-----:|----:|----:|------:|-------:|-----:|------:|---------:|
| Bin Laden  |      18 | 3083 | 5.2 | 2.1 | 0.04 |   1 |   9 |     8 |      5 |    5 | -0.08 |      2.6 |
| Washington |       0 | 3242 | 5.9 | 2.2 | 0.04 |   1 |   9 |     8 |      6 |    5 | -0.23 |      2.2 |

</div>

</div>

To test whether the difference in agreement between the two sources is
statistically significant, we perform a *t*-test. Normally, we would
just run the t-test like so:

<details open class="code-fold">
<summary>Code</summary>

``` r
t.test(response ~ source, data = quote_source)
```

</details>

However, since we want to use tidystats to later save the statistics
from this test, we will store the output of the *t*-test in a variable.
This, and the final section of R code, will be the only thing you need
to change in order to incorporate tidystats in your workflow.

Once you’ve stored the result of the *t*-test in a variable, you can
look at the output by sending it the console, which will print the
output.

<details open class="code-fold">
<summary>Code</summary>

``` r
main_test <- t.test(response ~ source, data = quote_source)
main_test
```

</details>


        Welch Two Sample t-test

    data:  response by source
    t = -13, df = 6323, p-value <2e-16
    alternative hypothesis: true difference in means between group Bin Laden and group Washington is not equal to 0
    95 percent confidence interval:
     -0.80 -0.59
    sample estimates:
     mean in group Bin Laden mean in group Washington 
                         5.2                      5.9 

This shows us that there is a statistically significant effect of the
quote source, consistent with the hypothesis.

Next, let’s run some additional analyses. One thing we can test is
whether the effect is stronger in the US compared to non-US countries.
To test this, we perform a regression analysis. Here we also store the
result in a variable, but this is actually quite common in regression
analyses because you want to apply the `summary()` function to this
variable in order to obtain the inferential statistics.

<details open class="code-fold">
<summary>Code</summary>

``` r
us_moderation_test <- lm(
  response ~ source * us_or_international,
  data = quote_source
)
summary(us_moderation_test)
```

</details>


    Call:
    lm(formula = response ~ source * us_or_international, data = quote_source)

    Residuals:
       Min     1Q Median     3Q    Max 
    -5.005 -1.228 -0.228  1.772  3.772 

    Coefficients:
                                                      Estimate Std. Error t value
    (Intercept)                                         5.2278     0.0437  119.50
    sourceWashington                                    0.7769     0.0613   12.67
    us_or_internationalinternational                    0.0210     0.0955    0.22
    sourceWashington:us_or_internationalinternational  -0.3717     0.1323   -2.81
                                                      Pr(>|t|)    
    (Intercept)                                         <2e-16 ***
    sourceWashington                                    <2e-16 ***
    us_or_internationalinternational                     0.826    
    sourceWashington:us_or_internationalinternational    0.005 ** 
    ---
    Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

    Residual standard error: 2.2 on 6321 degrees of freedom
      (18 observations deleted due to missingness)
    Multiple R-squared:  0.0275,    Adjusted R-squared:  0.027 
    F-statistic: 59.5 on 3 and 6321 DF,  p-value: <2e-16

There appears to be a significant interaction. Let’s inspect the
interaction with a graph:

<details open class="code-fold">
<summary>Code</summary>

``` r
ggplot(
  quote_source,
  aes(x = source, y = response, fill = us_or_international)
) +
  geom_violin() +
  stat_summary(fun = "mean", position = position_dodge(.9)) +
  labs(x = "Source", y = "Quote agreement", fill = "Region") +
  scale_y_continuous(breaks = 1:9) +
  scale_fill_manual(values = c(primary, secondary)) +
  theme(legend.position = "bottom")
```

</details>

<div id="fig-interaction">

<img
src="6-a-tidystats-example_files/figure-commonmark/fig-interaction-1.svg"
id="fig-interaction" />

Figure 2

</div>

We see that the effect of the source appears to be larger in the US.
Given that the positive source was George Washington, this makes sense.

Let’s do one more analysis to see whether the effect is stronger in a
lab setting compared to an online setting.

<details open class="code-fold">
<summary>Code</summary>

``` r
lab_moderation_test <- lm(response ~ source * lab_or_online, data = quote_source)
summary(lab_moderation_test)
```

</details>


    Call:
    lm(formula = response ~ source * lab_or_online, data = quote_source)

    Residuals:
       Min     1Q Median     3Q    Max 
    -4.967 -1.197 -0.197  1.737  3.803 

    Coefficients:
                                         Estimate Std. Error t value Pr(>|t|)    
    (Intercept)                            5.1971     0.0567   91.59   <2e-16 ***
    sourceWashington                       0.6864     0.0791    8.68   <2e-16 ***
    lab_or_onlineonline                    0.0664     0.0780    0.85     0.39    
    sourceWashington:lab_or_onlineonline   0.0172     0.1089    0.16     0.87    
    ---
    Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

    Residual standard error: 2.2 on 6321 degrees of freedom
      (18 observations deleted due to missingness)
    Multiple R-squared:  0.0255,    Adjusted R-squared:  0.025 
    F-statistic: 55.1 on 3 and 6321 DF,  p-value: <2e-16

We see no significant interaction in this case. This means we do not
find evidence that running the study in an online setting significantly
weakens the effect; good to know!

## Applying tidystats

Now let’s get to tidystats. We have three analyses we want to save: a
*t*-test and two regression analyses. We stored each of these analyses
in separate variables, called `main_test`, `us_moderation_test`, and
`lab_moderation_test`.

The main idea is that we will add these three three variables to a list
and then save the list as a file on our computer. You create an empty
list using the `list()` function. Once you have an empty list, you can
add statistics to this list using the `add_stats()` function.
`add_stats()` accepts a list as its first argument, followed by a
variable containing a statistics model. In our case, this means we need
to use the `add_stats()` function three times, as we have three
different analyses we want to save. Since this can get pretty
repetitive, we will use the piping operator to pipe the three steps
together and save some typing.

Before we do so, however, note that we can take this opportunity to add
some meta-information to each test. For the sake of this example, let’s
say that the *t*-test was our primary test. We also had a suspicion that
the location (US vs. international) would matter, but it wasn’t our main
interest. Nevertheless, we preregistered these two analyses. During data
analysis, we figured that it might also matter whether the study was
conducted in the lab or online, so we tested it. This means that this is
an exploratory analysis. With `add_stats()`, we can add this information
when we add the test to our empty list.

In the end, the code looks like this:

<details open class="code-fold">
<summary>Code</summary>

``` r
statistics <- list()

statistics <- statistics |>
  add_stats(main_test, type = "primary", preregistered = TRUE) |>
  add_stats(us_moderation_test, type = "secondary", preregistered = TRUE) |>
  add_stats(lab_moderation_test, type = "secondary", preregistered = FALSE)
```

</details>

I recommend to do add the tidystats code at the end of the data analysis
script in a section called ‘tidystats’. This confines most of the
tidystats code to a single section, keeping it organized, and it will
keep most of your script readable to those unfamiliar with tidystats.

After all the analyses are added to the list, the list can be saved as a
.json file to your computer. This is done with the `write_stats()`
function. The function requires the list as its first argument, followed
by a file path. I’m a big fan of using projects so that you can define
relative file paths. In this case, I create the .json file in the ‘Data’
folder of my project folder.

<details open class="code-fold">
<summary>Code</summary>

``` r
write_stats(statistics, "tidystats-example.json")
```

</details>

If you want to see what this file looks like, you can inspect it
[here](willemsleegers.com/tidystats-example.json "tidystats JSON file example").
Open the file in a text editor to see how the statistics are structured.
If you do, you’ll see it is not easy for our human eyes to quickly make
sense of all the information, but it’s easy for computers.

Once you’ve saved the file, you can share the file with others or use it
to report report the statistics in your manuscript using the [Word
add-in](https://www.tidystats.io/word-add-in.html "tidystats Word add-in").

That marks the end of this tidystats example. If you have any questions,
please check out the [tidystats website](https://tidystats.io) or
contact me via [Twitter](https://twitter.com/tidystats).
