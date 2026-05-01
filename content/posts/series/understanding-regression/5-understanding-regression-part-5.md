---
title: 'Understanding Regression (Part 5): What About σ?'
description: >-
  Like μ, σ is estimated from a sample and has its own uncertainty. In this
  post, we look at σ's sampling distribution, explain why its uncertainty
  matters for inference about μ, and why lm() doesn't report it.
date: 2026-04-27T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---


- [Recap](#recap)
- [The uncertainty of σ](#the-uncertainty-of-σ)
- [A different shape](#a-different-shape)
- [How uncertain is σ?](#how-uncertain-is-σ)
- [Back to lm()](#back-to-lm)
- [The estimation goal](#the-estimation-goal)
- [Summary](#summary)

<details class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)

# Theme settings
primary <- "#16a34a"

theme_set(theme_minimal(base_size = 16))
update_geom_defaults(
  "histogram",
  aes(fill = primary, color = "white")
)

data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)

sample_mean <- mean(data$height)
sample_sd <- sd(data$height)
n <- nrow(data)
```

</details>

## Recap

In Part 4, we explored the uncertainty of our estimate of μ. We
simulated its sampling distribution — how much the sample mean would
vary across studies — and quantified that variation with the standard
error. We also saw that `lm()` reports this directly in the “Std. Error”
column of the intercept.

## The uncertainty of σ

Like μ, σ is estimated from our sample, and a different sample would
give a different estimate. This uncertainty matters because SE(μ) = σ /
√n — σ is an input to the formula, so if our estimate of σ is off, our
measure of uncertainty about μ is off too.

We can explore σ’s uncertainty the same way we explored μ’s by
simulating its sampling distribution.

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

n_simulations <- 1000

sample_sds <- replicate(n_simulations, {
  simulated_sample <- rnorm(n, mean = sample_mean, sd = sample_sd)
  sd(simulated_sample)
})

ggplot(tibble(sds = sample_sds), aes(x = sds)) +
  geom_histogram(aes(y = after_stat(density)), binwidth = 0.1) +
  geom_vline(
    xintercept = sample_sd,
    linetype = "dashed",
    linewidth = 1
  ) +
  labs(
    x = "Sample SD (cm)",
    y = "Density"
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-sampling-sd">

![](5-understanding-regression-part-5_files/figure-commonmark/fig-sampling-sd-1.svg)

Figure 1: Distribution of sample standard deviations from 1000 simulated
samples

</div>

The sample SDs cluster around 7.7 cm (dashed line), just as the sample
means clustered around 154.6 cm in Part 4. But there’s spread: across
our 1000 simulations, the SD ranges from about 6.7 to 8.8 cm.

The variation is modest at n = 352, but what about smaller samples?

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

sample_sizes <- c(5, 50, 352)
n_simulations <- 10000

sd_distributions <- map_dfr(sample_sizes, function(size) {
  sds <- replicate(n_simulations, {
    sd(rnorm(size, mean = sample_mean, sd = sample_sd))
  })
  tibble(
    sample_sd_sim = sds,
    n_label = paste("n =", size)
  )
}) |>
  mutate(n_label = factor(n_label, levels = paste("n =", sample_sizes)))

ggplot(sd_distributions, aes(x = sample_sd_sim)) +
  geom_histogram(aes(y = after_stat(density)), binwidth = 0.2) +
  facet_wrap(~n_label, ncol = 1, scales = "free_y") +
  geom_vline(
    xintercept = sample_sd,
    linetype = "dashed",
    linewidth = 0.5
  ) +
  labs(
    x = "Sample SD (cm)",
    y = "Density"
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05))) +
  theme(legend.position = "none")
```

</details>

<div id="fig-sd-sample-sizes">

![](5-understanding-regression-part-5_files/figure-commonmark/fig-sd-sample-sizes-1.svg)

Figure 2: Sampling distributions of σ at different sample sizes

</div>

At n = 5, the sample SD is all over the place. Some samples produce SDs
below 4, others above 12, even though we’re drawing from a distribution
with σ = 7.7. At n = 50, the spread narrows considerably. At n = 352
(our actual sample), we’re fairly precise.

## A different shape

The SD’s sampling distribution has a different shape from the mean’s.
The mean’s sampling distribution was a normal distribution centered on μ
— symmetric, unbounded in both directions. The SD can’t follow the same
pattern because it’s bounded below by zero. That means the distribution
is right-skewed, at least at smaller sample sizes. You can see this in
the graph above. At n = 5, there’s a right skew, but at n = 352 it looks
normal.

This distribution has a name. The sampling distribution of the sample
*variance* (σ²) follows a **chi-squared distribution**, scaled by σ².
You may have come across this distribution before — it’s the same one
that shows up in chi-squared tests. Since the SD is the square root of
the variance, its sampling distribution is a close relative — the **chi
distribution**, which is just the square root of a chi-squared.[^1] With
larger samples, the distribution becomes more symmetric and converges
toward normality, just as we saw with the mean in Part 4.[^2]

## How uncertain is σ?

In Part 4, we quantified μ’s uncertainty with the standard error: the SD
of the sampling distribution, which turned out to be σ / √n. Can we do
the same for σ?

Yes, we can. Let’s measure the SD of our simulated sample SDs at
different sample sizes, just as we did for the mean in Part 4.

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

many_sample_sizes <- c(10, 25, 50, 100, 200, 352, 500, 1000)

se_exact <- function(sigma, n) {
  c4 <- sqrt(2 / (n - 1)) * exp(lgamma(n / 2) - lgamma((n - 1) / 2))
  sigma * sqrt(1 - c4^2)
}

se_sigma_by_n <- map_dfr(many_sample_sizes, function(size) {
  sds <- replicate(n_simulations, {
    sd(rnorm(size, mean = sample_mean, sd = sample_sd))
  })
  tibble(
    n = size,
    simulated_se = sd(sds)
  )
}) |>
  mutate(formula_se = se_exact(sample_sd, n))

ggplot(se_sigma_by_n, aes(x = n)) +
  geom_point(aes(y = simulated_se), size = 3, color = primary) +
  geom_line(
    aes(y = formula_se),
    linetype = "dashed",
    linewidth = 1
  ) +
  labs(
    x = "Sample size (n)",
    y = "Standard error of σ (cm)"
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-se-sigma">

![](5-understanding-regression-part-5_files/figure-commonmark/fig-se-sigma-1.svg)

Figure 3: Standard error of σ decreases with sample size

</div>

The dots are the standard errors measured from our simulations (the SD
of the sample SDs at each sample size). The dashed line can be captured
by a formula, but it’s quite a complicated one and I don’t think you
need to understand it.[^3] What matters is that it matches our
simulations and that we can use it to calculate the standard error of σ
exactly.

For our data: SE(σ) = 0.29 cm — small relative to σ (7.7 cm), so our
estimate of the spread is quite precise.

## Back to lm()

Let’s take a look again at the output of `lm()`.

<details class="code-fold">
<summary>Code</summary>

``` r
model <- lm(height ~ 1, data = data)
summary(model)
```

</details>


    Call:
    lm(formula = height ~ 1, data = data)

    Residuals:
         Min       1Q   Median       3Q      Max 
    -18.0721  -6.0071  -0.2921   6.0579  24.4729 

    Coefficients:
                Estimate Std. Error t value Pr(>|t|)    
    (Intercept) 154.5971     0.4127   374.6   <2e-16 ***
    ---
    Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

    Residual standard error: 7.742 on 351 degrees of freedom

While we see the standard error for the intercept, we don’t see a
standard error for σ (the residual standard error). This might be odd,
given that we’ve now covered that it also carries its own uncertainty
and that this uncertainty feeds into the uncertainty of other estimates,
like our estimate of μ.

So why is it not included in the output of `lm()`?

The reason is that `lm()` handles σ’s uncertainty implicitly. Rather
than reporting it explicitly, `lm()` uses the t-distribution instead of
the normal when computing p-values and confidence intervals for μ. The
t-distribution is a distribution with heavier tails that absorb exactly
the extra uncertainty that comes from estimating σ rather than knowing
it. You never see σ’s uncertainty in the output, but it’s baked into the
distribution used for inference. We’ll cover this in greater depth in
the next post.

## The estimation goal

That covers the estimation side of `lm()`’s output: we have estimates of
both μ and σ, and we understand the uncertainty behind each. In Part 6,
we turn to the next goal: testing.

## Summary

Both parameters of our model, μ and σ, are estimated from the sample and
both have uncertainty. We explored μ’s uncertainty in Part 4; now we’ve
seen σ’s. The mean’s sampling distribution is normal and symmetric. The
SD’s sampling distribution follows a chi-squared-related distribution
that is skewed, especially at small sample sizes. Both become more
precise with more data.

[^1]: More precisely, (n − 1)s² / σ² follows a chi-squared distribution
    with n − 1 degrees of freedom. The sample SD follows a scaled chi
    distribution, which is the square root of the chi-squared.

[^2]: The Central Limit Theorem again.

[^3]: If you’re curious, the formula is:

    $$SE(\sigma) = \sigma \sqrt{1 - \frac{2}{n-1} \left[\frac{\Gamma(n/2)}{\Gamma((n-1)/2)}\right]^2}$$

    where Γ is the gamma function.
