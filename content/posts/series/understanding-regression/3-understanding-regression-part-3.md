---
title: 'Understanding Regression (Part 3): Estimating Parameters'
description: >-
  We've chosen the normal distribution to describe heights. Now we need to
  estimate its parameters μ and σ from our sample. This post shows that lm()
  does exactly this: the intercept estimates μ (the mean) and the residual
  standard error estimates σ.
date: 2025-01-17T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---


- [Recap](#recap)
- [Estimating the parameters](#estimating-the-parameters)
- [What lm() is doing](#what-lm-is-doing)
- [Visualizing the estimated
  distribution](#visualizing-the-estimated-distribution)
- [What we’ve accomplished](#what-weve-accomplished)
- [What comes next](#what-comes-next)

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

In Part 2, I argued that the normal distribution is often the correct
distribution for outcomes like heights, which are shaped by many small
additive effects. It’s also parsimonious: defined by just two
parameters, it captures a center and some spread without adding claims
about skewness, multiple groups, or hard boundaries.

Now we need to estimate those two parameters from our data.

## Estimating the parameters

The normal distribution is defined by two parameters:

- **μ (mu)**: the mean, where the center of the distribution is
- **σ (sigma)**: the standard deviation, how spread out the distribution
  is

If we can estimate these from our sample, we’ve characterized the entire
distribution. The sample mean estimates μ and the sample standard
deviation estimates σ. Let me calculate these using the same height data
we’ve been working with:

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

They’re identical. When there are no predictors, the residual standard
error is the same as the sample standard deviation.

**This is what `lm(height ~ 1)` is doing**: it’s estimating the
parameters of a normal distribution.

- The intercept estimates μ (the mean)
- The residual standard error estimates σ (the standard deviation)

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
    linewidth = 1,
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

This is our model: heights follow a normal distribution with mean 154.6
cm and standard deviation 7.7 cm.

## What we’ve accomplished

We started with a question: what distribution describes heights?

We proposed an answer: the normal distribution.

Now we’ve estimated that distribution’s parameters from our sample: - μ
≈ 154.6 cm - σ ≈ 7.7 cm

When we run `lm(height ~ 1)`, we’re estimating these same parameters.
The regression output gives us both values, along with additional
information (like uncertainty about our estimates, which we’ll explore
later).

## What comes next

But these estimates are based on just one sample of 352 people. If we’d
measured a different group, we’d get different numbers. How much would
they vary? How certain can we be about our estimates?

That’s what we’ll tackle in Part 4.
