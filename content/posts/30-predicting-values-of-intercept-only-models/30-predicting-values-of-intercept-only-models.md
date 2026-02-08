---
title: Predicting values of intercept only models
description: A post on how to predict values of intercept-only models.
date: 2024-03-18T00:00:00.000Z
updated: 2025-01-02T00:00:00.000Z
categories:
  - statistics
  - prediction
code-fold: show
code-tools: true
---


I frequently need to calculate a single proportion or single mean with
confidence intervals. My preferred way for getting these is to run
intercept-only models, such as a logistic regression for proportions and
standard regression for means. In this post I show to run these models
and obtain the estimates with confidence intervals, using the same
workflow from my tutorial blog posts.

Run the following setup code if you want to follow along.

<details open class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
library(marginaleffects)
library(brms)
library(tidybayes)
library(modelr)

options(
  mc.cores = 4,
  brms.threads = 4,
  brms.backend = "cmdstanr",
  brms.file_refit = "on_change"
)
```

</details>

## Data

I found some survey [data](https://doi.org/10.17026/dans-x2z-n2bh)
including a question about whether the respondent follows a vegan diet.
The relevant column is called `vegan` and contains a 1 for ‘Yes’ and a 0
for “No”. With this data we can determine the proportion of vegans and
the associated confidence interval.

<details open class="code-fold">
<summary>Code</summary>

``` r
data <- read_csv("data.csv")
head(data)
```

</details>

    # A tibble: 6 x 3
          id date       vegan
       <dbl> <chr>      <dbl>
    1 800009 02-07-2018     0
    2 800015 02-07-2018     0
    3 800054 02-07-2018     0
    4 800057 04-07-2018     0
    5 800073 03-07-2018     0
    6 800085 03-07-2018     0

## Frequentist

My frequentist approach consists of running a logistic regression using
the `glm()` function. The outcome variable is the `vegan` column and
there are no predictors; only an intercept.

<details open class="code-fold">
<summary>Code</summary>

``` r
model <- glm(vegan ~ 1, family = binomial(), data = data)
```

</details>

We can use the `avg_predictions()` function from the
[marginaleffects](https://marginaleffects.com) package to obtain the
proportion.

<details open class="code-fold">
<summary>Code</summary>

``` r
avg_predictions(model)
```

</details>


     Estimate Std. Error    z Pr(>|z|)    S  2.5 % 97.5 %
        0.012    0.00144 8.36   <0.001 53.8 0.0092 0.0148

    Type: response

Alternatively, you can also use the `predictions()` function. By
default, this function calculates the regression-adjusted predicted
values for every observation in the original dataset. That’s not what we
want; we want only one prediction. We can specify what we want to
calculate predictors for using the `newdata` argument. My preferred way
for specifying predictor values is using helper functions like
`data_grid()` from the [modelr](https://modelr.tidyverse.org) package.
With this function you can specify which predictors you want to include
and for which values of each predictor you want to calculate
predictions. The problem is that we don’t have any predictors, so what
to specify? In this case, we simply specify the model.

<details open class="code-fold">
<summary>Code</summary>

``` r
predictions(model, newdata = data_grid(.model = model))
```

</details>


     Estimate Pr(>|z|)     S  2.5 % 97.5 %
        0.012   <0.001 961.6 0.0095 0.0152

    Type: invlink(link)

Note that this gives slightly different results (which, I believe, is
explained
[here](https://marginaleffects.com/chapters/predictions.html#sec-predictions_aggregation)).
Also note that this does not work using the `datagrid()` function from
marginaleffects; it’ll give you an error saying
`replacement has 1 row, data has 0`.

## Bayesian

Now let’s do the same thing but using a Bayesian approach, without using
the marginaleffects package. Below we run a model using the `brm()`
function from [brms](https://paul-buerkner.github.io/brms/).

<details open class="code-fold">
<summary>Code</summary>

``` r
model <- brm(
  vegan ~ 1,
  family = bernoulli(link = "logit"),
  data = data,
  prior = prior(student_t(5, 0, 1.5), class = "Intercept"),
  file = "models/model.rds",
  silent = 2
)
```

</details>

To get predicted values, I’ll use the `data_grid()` fuction from the
modelr package and the `add_epred_draws()` and `median_qi()` functions
from the [tidybayes](http://mjskay.github.io/tidybayes/) package. The
logic is to specify a data frame using `data_grid()` with predictor
values and then add predicted values using `add_epred_draws()` to this
data frame, which are then summarized using `median_qi()`. Just like
before, we need to specify the model using the `.model` argument of the
function.

<details open class="code-fold">
<summary>Code</summary>

``` r
data_grid(.model = model) |>
  add_epred_draws(model) |>
  median_qi()
```

</details>

    # A tibble: 1 x 7
       .row .epred  .lower .upper .width .point .interval
      <int>  <dbl>   <dbl>  <dbl>  <dbl> <chr>  <chr>    
    1     1 0.0121 0.00955 0.0151   0.95 median qi       

We could also create the data frame ourselves without using
`data_grid()`.

<details open class="code-fold">
<summary>Code</summary>

``` r
tibble(.rows = 1) |>
  add_epred_draws(model) |>
  median_qi()
```

</details>

    # A tibble: 1 x 7
       .row .epred  .lower .upper .width .point .interval
      <int>  <dbl>   <dbl>  <dbl>  <dbl> <chr>  <chr>    
    1     1 0.0121 0.00955 0.0151   0.95 median qi       

But it looks weird to me to create a data frame with 1 row and no values
in it (although technically that’s what the data grid functions also
do).

## Summary

You can run intercept-only regression models to obtain estimates of
single proportions or means. These estimates, together with their
confidence intervals, can be obtained using prediction functions and
telling them to predict values from empty data frames, which can be
created using helper functions like the `data_grid()` function from the
modelr package.
