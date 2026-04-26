---
title: 'Understanding Regression (Part 3): Estimating Parameters'
description: >-
  We've chosen the normal distribution to describe heights. Now we need to
  estimate its parameters μ and σ from our sample. This post shows that lm()
  does exactly this: the intercept estimates μ (the mean) and the residual
  standard error estimates σ.
date: 2026-04-26T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
---


- [Recap](#recap)
- [Estimating the parameters](#estimating-the-parameters)
- [What lm() is doing](#what-lm-is-doing)
- [Visualizing the estimated
  distribution](#visualizing-the-estimated-distribution)
- [Summary](#summary)

<details class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)

# Theme settings
primary <- "#16a34a"

theme_set(theme_minimal(base_size = 14))
update_geom_defaults(
  "histogram",
  aes(fill = primary, color = "white")
)
```

</details>

## Recap

In Part 2, we argued that the normal distribution is often a sensible
choice for outcomes like heights, because adult heights are the result
of many small additive effects which produce a normal distribution. This
distribution is also a parsimonious choice; it is defined by just two
parameters.

Now we need to estimate those two parameters from our data.

## Estimating the parameters

The normal distribution is defined by two parameters:

- **μ (mu)**: where the distribution is centered
- **σ (sigma)**: how spread out the distribution is

By definition, μ is the mean of the distribution and σ is its standard
deviation, so we estimate them with the mean and standard deviation of
our sample. These are not the same thing, though — the sample mean and
sample standard deviation are estimates of μ and σ, our best guess at
the model’s parameters based on the data we have. The distinction
matters: within the model we’ve proposed, μ and σ are fixed values we’re
trying to pin down. Our sample mean and sample standard deviation are
estimates that depend on which 352 people happened to be measured. A
different sample would give slightly different numbers. The Greek
letters are a reminder that what we really care about is the parameters
of our model, not the specific numbers from this particular sample.

Let’s calculate our estimates using the height data we’ve been working
with:

<details class="code-fold">
<summary>Code</summary>

``` r
data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)

sample_mean <- mean(data$height)
sample_sd <- sd(data$height)
```

</details>

- **Sample mean**: 154.6 cm
- **Sample SD**: 7.74 cm

These are our estimates of μ and σ.

## What lm() is doing

Now let’s run the same regression model from Part 1:

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

Look at the output:

- The **intercept** is 154.6 cm
- The **residual standard error** is 7.74 cm

Compare these to what we calculated:

- Intercept (154.6) = Sample mean (154.6)
- Residual SE (7.74) = Sample SD (7.74)

They’re identical. When there are no predictors, the intercept equals
the sample mean and the residual standard error equals the sample
standard deviation.

`lm()` doesn’t call them the mean and standard deviation — it calls them
the *intercept* and the *residual standard error*. Those names will make
more sense when we add predictors, but for now the intercept is simply
our estimate of μ and the residual standard error is our estimate of σ.

The name *residual standard error* comes from how it’s computed. A
**residual** is the difference between an observed value and the model’s
prediction. For our intercept-only model, the model’s prediction is the
mean, so each residual is just a height minus the mean. The residual
standard error then squares those residuals, sums them, divides by n −
1, and takes the square root. That’s exactly how the sample standard
deviation is calculated: take each value, subtract the mean, square the
differences, sum them, divide by n − 1, and take the square root.
They’re the same computation.

So `lm()` isn’t doing anything exotic. The intercept is the sample mean
(our estimate of μ) and the residual standard error is the sample
standard deviation (our estimate of σ).

## Visualizing the estimated distribution

Let me overlay the distribution with our estimated parameters on the
histogram:

<details class="code-fold">
<summary>Code</summary>

``` r
ggplot(data, aes(x = height)) +
  geom_histogram(aes(y = after_stat(density)), binwidth = 5) +
  stat_function(
    fun = dnorm,
    args = list(mean = sample_mean, sd = sample_sd),
    linewidth = 0.75,
    color = "black",
    linetype = "dashed"
  ) +
  labs(
    x = "Height (cm)",
    y = "Density"
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-estimated-distribution">

![](3-understanding-regression-part-3_files/figure-commonmark/fig-estimated-distribution-1.svg)

Figure 1: Heights with normal distribution using estimated parameters

</div>

This is what our regression model produces: a fully specified
distribution. We chose the normal distribution in Part 2, and now we’ve
pinned down its parameters using our data. We know where the
distribution is centered and how spread out it is. What we don’t yet
know is how much to trust those estimates.

## Summary

We started with a question: what distribution might have generated our
height data? We proposed the normal distribution, and now we’ve
estimated its parameters from our sample: μ ≈ 154.6 cm and σ ≈ 7.7 cm.

But these estimates are based on just one sample of 352 people. If we’d
measured a different group, we’d get different numbers. How much would
they vary? How certain can we be about our estimates? That’s what we’ll
tackle in Part 4.
