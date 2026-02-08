---
title: 'Bayesian tutorial: Two groups'
description: >-
  The fourth of a series of tutorial posts on Bayesian analyses. In this post I
  focus on using brms to model the difference between two groups.
date: 2023-04-24T00:00:00.000Z
updated: 2026-02-08T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - Bayesian statistics
  - regression
code-fold: true
---


In this blog post I will cover how to use brms to analyze the difference
between two groups. Interestingly, this might seem like a very simple
analysis, but there are actually multiple ways to go about this. I’ll
try to cover a few here.

The data we’ll use is the same as in the previous posts. This data
contains the sex of the participant in a column called `male`, in
addition to their height, weight, and age. This means we can
investigate, say, whether there’s a difference in height between men and
women.

Run the following setup code if you want to follow along.

<details class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
library(brms)
library(tidybayes)

theme_set(theme_minimal(base_size = 16))
primary <- "#16a34a"
secondary <- "#A3166F"

options(
  mc.cores = 4,
  brms.threads = 4,
  brms.backend = "cmdstanr",
  brms.file_refit = "on_change"
)

data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)
```

</details>

## Dummy coding

Probably the most common method to analyze the difference between two
groups is to regress the outcome on dummy coded data. That means the
group column contains the information about both groups, usually using a
0 and 1 to indicate which group is which. The `male` column in the
current data frame is dummy coded, with a 0 for females and a 1 for
males. The R formula for regressing height on male is `height ~ male`.
Let’s see what priors we need to set for this by using the `get_prior()`
function.

<details class="code-fold">
<summary>Code</summary>

``` r
get_prior(height ~ male, data = data)
```

</details>

                        prior     class coef group resp dpar nlpar lb ub tag
     student_t(3, 154.3, 8.5) Intercept                                     
                       (flat)         b                                     
                       (flat)         b male                                
         student_t(3, 0, 8.5)     sigma                             0       
           source
          default
          default
     (vectorized)
          default

The output shows we need to set a prior on sigma, the Intercept, and on
the male coefficient. The intercept refers to the heights of female
participants and the male coefficient refers to the difference between
males and females, at least that’s what you would expect in standard
regression. We’ll see that things are a bit more complicated. Sigma
refers, as always, to the standard deviation of the residuals.

Writing down this model shows that it’s actually the same as the simple
regression model:

<math>
$$heights_i ∼ Normal(\mu_i, \sigma)\\\\\mu_i = \alpha + \beta x_i$$
</math>

Despite this similarity, there’s an issue here that we need to get into.
Let’s demonstrate this issue by setting some priors and running the
model while only sampling from the priors. This means the estimates we
get for the intercept and male coefficient should match our priors.

<details class="code-fold">
<summary>Code</summary>

``` r
model_dummy_priors_default <- brm(
  height ~ male,
  data = data,
  family = gaussian,
  prior = c(
    prior(normal(165, 5), class = "Intercept"),
    prior(normal(10, 5), coef = "male"),
    prior(cauchy(5, 5), class = "sigma")
  ),
  sample_prior = "only",
  cores = 4,
  file = "./models/model-dummy-priors-default.rds"
)

model_dummy_priors_default
```

</details>

     Family: gaussian 
      Links: mu = identity 
    Formula: height ~ male 
       Data: data (Number of observations: 352) 
      Draws: 4 chains, each with iter = 2000; warmup = 1000; thin = 1;
             total post-warmup draws = 4000

    Regression Coefficients:
              Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    Intercept   160.48      5.50   149.71   171.52 1.00     2800     2295
    male          9.96      4.97     0.32    19.99 1.00     2898     2612

    Further Distributional Parameters:
          Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    sigma    17.68     69.96     0.64    90.22 1.00     2876     1744

    Draws were sampled using sample(hmc). For each parameter, Bulk_ESS
    and Tail_ESS are effective sample size measures, and Rhat is the potential
    scale reduction factor on split chains (at convergence, Rhat = 1).

Looking at the estimates we see that the estimate for male is indeed
around 10 but the intercept estimate is not what we set it too. The
intercept has an estimate of around 160, even though we set it to 165.
How can this be? The reason is that brms internally centers the
intercept so that it corresponds to the expected response when all
predictors are held at their means. This is what the prior is set to,
not to the mean of the heights of female participants. brms also
re-generates the true intercept, which is the one we see in the output,
so the intercept in the output does correctly indicate the mean height
of female participants. Confusing.

To prevent this from happening, we need to suppress the default
intercept and explicitly add one as a coefficient. This means we need to
update our prior for the intercept to refer to a `coef` (instead of
`class`).

<details class="code-fold">
<summary>Code</summary>

``` r
model_dummy_priors <- brm(
  height ~ 0 + Intercept + male,
  data = data,
  family = gaussian,
  prior = c(
    prior(normal(165, 5), coef = "Intercept"),
    prior(normal(10, 5), coef = "male"),
    prior(cauchy(5, 5), class = "sigma")
  ),
  sample_prior = "only",
  seed = 4,
  file = "./models/model-dummy-priors.rds"
)

model_dummy_priors
```

</details>

     Family: gaussian 
      Links: mu = identity 
    Formula: height ~ 0 + Intercept + male 
       Data: data (Number of observations: 352) 
      Draws: 4 chains, each with iter = 2000; warmup = 1000; thin = 1;
             total post-warmup draws = 4000

    Regression Coefficients:
              Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    Intercept   164.95      4.86   155.35   174.68 1.00     3258     2757
    male          9.93      5.02     0.51    19.97 1.00     3196     2443

    Further Distributional Parameters:
          Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    sigma    17.33    120.01     0.48    72.66 1.00     2908     1844

    Draws were sampled using sample(hmc). For each parameter, Bulk_ESS
    and Tail_ESS are effective sample size measures, and Rhat is the potential
    scale reduction factor on split chains (at convergence, Rhat = 1).

The estimates (i.e., our priors) show that the average height for women
is 164.95 and that for men is 164.95 + 9.93 = 174.88.

But now there’s a new problem. Let’s take a look at how uncertain we
should be at these estimates by predicting the means for both men and
women and then calculating the width of the 95% quartile interval.

<details class="code-fold">
<summary>Code</summary>

``` r
tibble(male = c(0, 1)) |>
  add_epred_draws(model_dummy_priors) |>
  median_qi() %>%
  mutate(width = .upper - .lower)
```

</details>

    # A tibble: 2 x 9
       male  .row .epred .lower .upper .width .point .interval width
      <dbl> <int>  <dbl>  <dbl>  <dbl>  <dbl> <chr>  <chr>     <dbl>
    1     0     1   165.   155.   175.   0.95 median qi         19.3
    2     1     2   175.   161.   189.   0.95 median qi         27.4

We see that the width for males is slightly wider than that for females.
If you run the model multiple times at different seeds, you’ll see that
this is something that happens consistently. The reason there is more
uncertainty for the mean of male participants is that we’ve added a
separate prior that only applies to males—the prior on the male
coefficient. The mean of female participants is wholly determined by the
data and the prior on the intercept, but for males it’s the data and the
prior for the intercept + the prior for the male coefficient. This is
not desirable.

On top of that it less intuitive to think about the priors as a mean for
females and then a prior for how much males deviate from this mean. It
seems nicer to just specify what we think the heights are for females
and what the heights are for males, without thinking about the
deviation.

Both of these issues can be solved by using index coding instead of
dummy coding.

## Index coding

Index coding requires that we create a new column that is a factor or
that contains string values to indicate the sex of the participant.
Below I create a new column called `sex` that contains the values `male`
and `female` as string values.

<details class="code-fold">
<summary>Code</summary>

``` r
data <- mutate(data, sex = if_else(male == 1, "male", "female"))
```

</details>

To solve the uncertainty issue, we regress height onto the index-coded
sex column, and omit an intercept. This will result in a model that
requires priors for each group separately.

<details class="code-fold">
<summary>Code</summary>

``` r
get_prior(height ~ 0 + sex, data = data)
```

</details>

                    prior class      coef group resp dpar nlpar lb ub tag
                   (flat)     b                                          
                   (flat)     b sexfemale                                
                   (flat)     b   sexmale                                
     student_t(3, 0, 8.5) sigma                                  0       
           source
          default
     (vectorized)
     (vectorized)
          default

As you can see, we need a prior for `sexfemale` and `sexmale`, as well
as sigma.

We should alter how we describe this model. We can now drop the
<math>$\beta$</math> parameter from the model and we should more
explicitly indicate that we will model several parameters for
<math>$\alpha$</math>, one for each sex.

<math> $$
heights_i ∼ Normal(\mu_i, \sigma) \\\ \mu_i = \alpha_{sex[i]}
$$ </math>

Next, I simply translated the previous priors to this new notation. The
prior for the heights of female participants stays the same (a normal
distribution with a mean of 165 and a standard deviation of 5). The
prior for the heights of male participants is also still a normal
distribution, but now with a mean of 175 (165 + 10) and the same
standard deviation.

<details class="code-fold">
<summary>Code</summary>

``` r
model_index_prior <- brm(
  height ~ 0 + sex,
  data = data,
  family = gaussian,
  prior = c(
    prior(normal(165, 5), coef = "sexfemale"),
    prior(normal(175, 5), coef = "sexmale"),
    prior(cauchy(5, 5), class = "sigma")
  ),
  sample_prior = "only",
  seed = 4,
  file = "./models/model-index-prior.rds"
)

model_index_prior
```

</details>

     Family: gaussian 
      Links: mu = identity 
    Formula: height ~ 0 + sex 
       Data: data (Number of observations: 352) 
      Draws: 4 chains, each with iter = 2000; warmup = 1000; thin = 1;
             total post-warmup draws = 4000

    Regression Coefficients:
              Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    sexfemale   165.04      4.92   155.39   175.02 1.00     3196     2273
    sexmale     175.12      4.87   165.40   184.66 1.00     3048     2807

    Further Distributional Parameters:
          Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    sigma    56.52   1001.19     0.60   103.49 1.00     2628     1230

    Draws were sampled using sample(hmc). For each parameter, Bulk_ESS
    and Tail_ESS are effective sample size measures, and Rhat is the potential
    scale reduction factor on split chains (at convergence, Rhat = 1).

Let’s confirm that the uncertainty in the priors for the male and female
average heights are the same.

<details class="code-fold">
<summary>Code</summary>

``` r
tibble(sex = c("male", "female")) |>
  add_epred_draws(model_index_prior) |>
  median_qi() |>
  mutate(width = .upper - .lower)
```

</details>

    # A tibble: 2 x 9
      sex     .row .epred .lower .upper .width .point .interval width
      <chr>  <int>  <dbl>  <dbl>  <dbl>  <dbl> <chr>  <chr>     <dbl>
    1 female     2   165.   155.   175.   0.95 median qi         19.6
    2 male       1   175.   165.   185.   0.95 median qi         19.3

They are. This means we can now run the model and also sample from the
posterior.

<details class="code-fold">
<summary>Code</summary>

``` r
model_index <- brm(
  height ~ 0 + sex,
  data = data,
  family = gaussian,
  prior = c(
    prior(normal(165, 5), coef = "sexfemale"),
    prior(normal(175, 5), coef = "sexmale"),
    prior(cauchy(5, 5), class = "sigma")
  ),
  sample_prior = TRUE,
  seed = 4,
  silent = 2,
  file = "./models/model-index.rds"
)

model_index
```

</details>

     Family: gaussian 
      Links: mu = identity 
    Formula: height ~ 0 + sex 
       Data: data (Number of observations: 352) 
      Draws: 4 chains, each with iter = 2000; warmup = 1000; thin = 1;
             total post-warmup draws = 4000

    Regression Coefficients:
              Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    sexfemale   149.60      0.41   148.78   150.41 1.00     3393     3130
    sexmale     160.47      0.44   159.60   161.34 1.00     3768     3110

    Further Distributional Parameters:
          Estimate Est.Error l-95% CI u-95% CI Rhat Bulk_ESS Tail_ESS
    sigma     5.56      0.21     5.16     6.00 1.00     4073     2873

    Draws were sampled using sample(hmc). For each parameter, Bulk_ESS
    and Tail_ESS are effective sample size measures, and Rhat is the potential
    scale reduction factor on split chains (at convergence, Rhat = 1).

The estimates show, more clearly now, that the average height for women
is 149.6 and that for men is 160.47. The posteriors of these estimates
are shown below.

<details class="code-fold">
<summary>Code</summary>

``` r
draws <- model_index |>
  gather_draws(b_sexfemale, b_sexmale) |>
  mutate(sex = str_extract(.variable, "female|male"))

ggplot(draws, aes(x = .value, fill = sex)) +
  geom_histogram(binwidth = 0.1) +
  labs(x = "Average height", y = "", fill = "Sex") +
  scale_fill_manual(values = c(primary, secondary))
```

</details>

![](20-bayesian-tutorial-2-groups_files/figure-commonmark/groups-plot-1.svg)

## Calculating a difference score

In the previous section I’ve argued that we should use index coding so
that we can more easily think about, and see the results, of the priors
about the two groups. I realize, though, that we are often still
interested in the difference between the groups. This is easy to obtain,
though. We can simply take the posterior samples from each group and
subtract them from each other.

In the code below I extract the draws of each parameter (`b_sexfemale`
and `b_sexmale`) and calculate the difference score. I then extract the
draws of the difference score and calculate the median and quartile
interval.

<details class="code-fold">
<summary>Code</summary>

``` r
model_index |>
  spread_draws(b_sexfemale, b_sexmale) |>
  mutate(difference = b_sexmale - b_sexfemale) |>
  pull(difference) |>
  median_qi()
```

</details>

            y    ymin   ymax .width .point .interval
    1 10.8645 9.68385 12.056   0.95 median        qi

Alternatively, we can also plot it as a distribution.

<details class="code-fold">
<summary>Code</summary>

``` r
draws <- model_index |>
  spread_draws(b_sexfemale, b_sexmale) |>
  mutate(difference = b_sexmale - b_sexfemale)

ggplot(draws, aes(x = difference)) +
  geom_histogram(binwidth = 0.1, fill = primary) +
  labs(x = "Difference", y = "")
```

</details>

![](20-bayesian-tutorial-2-groups_files/figure-commonmark/difference-score-plot-1.svg)

## Summary

Just like running a correlation, testing a group difference consists of
running a simple regression. However, having groups as a predictor means
the regression is not so simple after all. You have to think more
carefully about what the priors mean (particularly the intercept) and
you have to deal with greater uncertainty for some estimates, depending
on how you code the group predictor. I’ve shown that explicitly
including the intercept and using index coding makes thinking about this
scenario a bit easier.
