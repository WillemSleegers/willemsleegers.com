---
title: 'Understanding Regression: What About σ?'
description: >-
  We explored how much our estimate of μ varies from sample to sample. But σ is
  also estimated from our sample. How much does it vary, and why does this
  matter?
date: 2025-01-19T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---


- [Recap](#recap)
- [σ varies from sample to sample](#σ-varies-from-sample-to-sample)
- [A different shape](#a-different-shape)
- [How uncertain is σ?](#how-uncertain-is-σ)
- [Why this matters](#why-this-matters)
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
```

</details>

## Recap

In Part 4, we explored the uncertainty of our estimate of μ. We saw that
the sample mean varies from study to study, and we quantified that
variation with the standard error: SE = σ / √n.

But look at that formula. It uses σ, the population standard deviation.
We don’t know σ. We estimated it from our sample, just like we estimated
μ. So how much does our estimate of σ vary?

<details class="code-fold">
<summary>Code</summary>

``` r
data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)

sample_mean <- mean(data$height)
sample_sd <- sd(data$height)
n <- nrow(data)
```

</details>

## σ varies from sample to sample

Let’s do the same thing we did for the mean in Part 4: draw many samples
from our proposed distribution and see how much the sample SD varies.

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

With our large sample (n = 352), the variation is modest. But what about
smaller samples?

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

sample_sizes <- c(10, 50, 352)

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

At n = 10, the sample SD is all over the place. Some samples produce SDs
below 4, others above 12, even though the true value is 7.7. At n = 50,
the spread narrows considerably. At n = 352 (our actual sample), we’re
fairly precise.

## A different shape

Compare these distributions to the sampling distribution of the mean
from Part 4. The mean’s sampling distribution was symmetric: a normal
distribution centered on the true mean. The SD’s sampling distribution
looks different. It’s slightly **skewed**, with the right tail extending
further than the left. This is especially visible at n = 10.

The skewness makes sense. The SD can’t go below zero, but it can, in
principle, be quite large. With small samples, a single extreme
observation can pull the SD way up, producing occasional large
estimates. There’s no equivalent mechanism to push it far below zero.
The result is a distribution that’s bunched up on the left and stretched
out on the right.

This distribution has a name. The sampling distribution of the sample
*variance* (σ²) follows a **chi-squared distribution**, scaled by σ².
Since the SD is the square root of the variance, its sampling
distribution is a close relative.[^1] The key properties match what we
see: bounded below by zero, skewed to the right, and becoming more
symmetric as n grows.

With larger samples, the skew fades. At n = 352, the distribution is
nearly symmetric. But at small sample sizes, the asymmetry is real and
has consequences.

## How uncertain is σ?

In Part 4, we quantified μ’s uncertainty with the standard error: the SD
of the sampling distribution, which turned out to be σ / √n. Can we do
the same for σ?

Yes. Let’s measure the SD of our simulated sample SDs at different
sample sizes, just as we did for the mean in Part 4.

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
of the sample SDs at each sample size). The dashed line is the exact
formula:

$$SE(\sigma) = \sigma \sqrt{1 - \frac{2}{n-1} \left[\frac{\Gamma(n/2)}{\Gamma((n-1)/2)}\right]^2}$$

where Γ is the **gamma function** (a generalization of the factorial to
non-integer values).[^2] They match well. This formula tells us how much
σ’s estimate bounces around from sample to sample.

For our data: SE(σ) = 0.29 cm.

Compare this to the standard error of μ from Part 4: SE(μ) ≈ 0.41 cm.
Both are small relative to the parameters they’re estimating, because
our sample is large. But at n = 10, SE(σ) would be 1.8 cm, meaning our
estimate of σ could easily be off by a couple of centimeters. That’s
substantial when the true value is 7.7.

## Why this matters

You might wonder why we care about σ’s uncertainty. The `lm()` output
doesn’t even report a standard error for it. (Look at the output below:
the residual standard error is reported as a single number, with no
uncertainty attached.)

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

The reason is that σ shows up in everything else. The standard error of
our estimate of μ is σ / √n. When we don’t know the true σ and use our
sample’s SD instead, we introduce extra uncertainty into the SE itself.

Think about it this way. In Part 4, we said the SE tells us how much the
sample mean bounces around from study to study. But that SE was
calculated using our estimate of σ. If our estimate of σ happens to be
too low, our SE is too low, and we’re underestimating how much the mean
bounces around. If our estimate of σ is too high, we’re overestimating
it.

With large samples, this barely matters. Our estimate of σ is precise
(SE(σ) = 0.29 cm), so the SE we compute for μ is reliable. But with
small samples, where σ’s estimate can be substantially off, the SE we
compute might be noticeably too small or too large. The ruler we’re
measuring uncertainty with is itself imprecise.

## Summary

Both parameters of our model, μ and σ, are estimated from the sample and
both have uncertainty. We explored μ’s uncertainty in Part 4; now we’ve
seen σ’s. The mean’s sampling distribution is normal and symmetric. The
SD’s sampling distribution follows a chi-squared-related distribution
that is skewed, especially at small sample sizes. Both become more
precise with more data.

The practical consequence: since we use σ to compute the SE, uncertainty
in σ feeds directly into uncertainty about how precise our estimate of μ
is. This will have direct consequences in Part 6, when we divide the
estimate by the SE to get the t-value. The fact that the SE is itself
uncertain will change what distribution the resulting ratio follows.

[^1]: More precisely, (n − 1)s² / σ² follows a chi-squared distribution
    with n − 1 degrees of freedom. The sample SD follows a scaled **chi
    distribution**, which is the square root of the chi-squared.

[^2]: The formula comes from the fact that the sample variance follows a
    scaled chi-squared distribution. The gamma function ratios describe
    the exact mean and variance of the resulting chi distribution (the
    distribution of the sample SD). Unlike SE(μ) = σ / √n, this doesn’t
    simplify to anything tidy.
