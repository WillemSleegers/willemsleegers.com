---
title: 'Understanding Regression (Part 7): The p-Value'
description: >-
  We have a t-value and know it follows a t-distribution. In this post, we use
  that distribution to ask how likely our t-value would be if the null
  hypothesis were true — and that probability is the p-value.
date: 2026-04-28T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---


- [Recap](#recap)
- [How likely is our t-value?](#how-likely-is-our-t-value)
- [The null distribution](#the-null-distribution)
- [Back to lm()](#back-to-lm)
- [What the p-value is and isn’t](#what-the-p-value-is-and-isnt)
- [Summary](#summary)

<details class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)

primary <- "#16a34a"

theme_set(theme_minimal(base_size = 16))
update_geom_defaults(
  "histogram",
  aes(fill = primary, color = "white")
)
```

</details>

## Recap

Part 6 introduced the t-value: the distance between our estimate and a
reference value, expressed in units of the SE. We also saw that t-values
follow the t-distribution rather than the normal, because using an
estimated σ adds variability to the SE and produces heavier tails. The
last column in the `lm()` output is `Pr(>|t|)`. \[this feels
disconnected from the previous sentence\] This post is about what that
number means.

<details class="code-fold">
<summary>Code</summary>

``` r
data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)

sample_mean <- mean(data$height)
sample_sd <- sd(data$height)
n <- nrow(data)
se <- sample_sd / sqrt(n)

t_vs_155 <- (sample_mean - 155) / se
t_vs_0 <- sample_mean / se
```

</details>

## How likely is our t-value?

We have an estimate and a t-value. The t-value tells us how far our
estimate sits from a reference value, in SE units. But knowing the
distance doesn’t yet tell us whether that distance is large or small in
any absolute sense. Is a t-value of 1 surprising? What about 3?

To answer that, we need to know what t-values we’d typically see if the
null hypothesis were true — that is, if the reference value actually
were the parameter. That distribution is what we can compare our
observed t-value against.

Let’s start with the following test: does the average height equal 155
cm? Our estimated mean is 154.6 cm, and testing against 155 cm gives:

$$t = \frac{154.6 - 155}{0.41} \approx -0.98$$

Our estimated mean of 154.6 cm produces a t-value of -0.98. Now the
question is: if the parameter *were* 155, how often would we expect a
t-value at least that far from zero?

\[i feel like we should maybe start with a section explaining the logic
first, without a specific example\]

## The null distribution

We can simulate this directly \[we can simulate what directly? I
generally don’t like continuing from the title as if everybody read the
title, at least I don’t\]. If the parameter were 155, we’d be drawing
samples from N(155, σ) \[we have not used this notation so far, not
consistently at least\]. For each simulated sample, we compute t the
same way we always do: subtract the reference value and divide by the
SE. Repeat this many times to build up the distribution of t-values we’d
expect under the null.

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

n_simulations <- 10000

null_t_values <- replicate(n_simulations, {
  sim <- rnorm(n, mean = 155, sd = sample_sd)
  (mean(sim) - 155) / (sd(sim) / sqrt(n))
})

x_range <- seq(-5, 5, length.out = 1000)
t_curve <- tibble(x = x_range, y = dt(x_range, df = n - 1))

shade_left <- t_curve |> filter(x <= -abs(t_vs_155))
shade_right <- t_curve |> filter(x >= abs(t_vs_155))

p_value_sim <- mean(abs(null_t_values) >= abs(t_vs_155))
p_value_exact <- 2 * pt(abs(t_vs_155), df = n - 1, lower.tail = FALSE)

ggplot() +
  geom_histogram(
    data = tibble(t = null_t_values),
    aes(x = t, y = after_stat(density)),
    binwidth = 0.1
  ) +
  geom_area(
    data = shade_left,
    aes(x = x, y = y),
    fill = "black",
    alpha = 0.3
  ) +
  geom_area(
    data = shade_right,
    aes(x = x, y = y),
    fill = "black",
    alpha = 0.3
  ) +
  geom_line(
    data = t_curve,
    aes(x = x, y = y),
    linetype = "dashed",
    linewidth = 0.8
  ) +
  geom_vline(
    xintercept = t_vs_155,
    linewidth = 1
  ) +
  labs(x = "t value", y = "Density") +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-null-distribution">

![](7-understanding-regression-part-7_files/figure-commonmark/fig-null-distribution-1.svg)

Figure 1: Distribution of t-values from 10,000 simulated samples where μ
= 155 cm. The dashed curve is the t-distribution; the vertical line
marks our observed t-value. The shaded regions show the proportion of
t-values at least as extreme as ours.

</div>

The histogram shows the simulated t-values; the dashed curve is the
t-distribution with df = 351.

The vertical line marks our observed t-value of -0.98. Values like that
don’t look unusual at all; the null distribution produces them
regularly. The shaded regions show the proportion of simulated t-values
as extreme or more extreme than ours — in both directions, since a
t-value of +0.98 would be equally surprising as −0.98.

That shaded proportion is the **p-value**. In our simulation, 32.3% of
t-values fell at least as far from zero as ours did. Using the
t-distribution directly \[unclear what this means, you mean calculating
it from the formula, rather than using simulation\] gives p = 0.33. Our
data are quite compatible with a mean of 155 cm \[dangerous phrasing. We
should stick close to the meaning of the p-value and signifance logic,
we fail to reject the null. We dont want to say this means the null is
probably true\].

The two-sided framing is why `lm()` reports `Pr(>|t|)`: it’s the
probability of \|t\| being at least this large, not just the probability
of a t-value this negative \[unclear phrasing, I think. ‘this
negative’\].

## Back to lm()

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

`lm()` always tests against 0. For heights, that gives:

$$t = \frac{154.6 - 0}{0.41} \approx 375$$

A t-value of 375 is 375 standard errors from zero. No t-distribution
with any reasonable degrees of freedom assigns meaningful probability to
values that extreme. The `Pr(>|t|)` column shows `< 2e-16`, which is R’s
way of saying the number is too small to represent with standard
floating-point precision. The three stars (\*\*\*) are the significance
codes at the bottom of the output, indicating a p-value below 0.001.

This result isn’t scientifically interesting. Of course the average
adult height isn’t zero. The t-value of 375 is enormous and obvious.
When we add predictors in later posts, the default null hypothesis
shifts to “this predictor has no effect”, which is a more interesting
question.

## What the p-value is and isn’t

The p-value is frequently misread, so it’s worth being precise.

**It is**: the probability of observing a t-value at least as extreme as
ours, given that the null hypothesis is true. It measures how compatible
our data are with the null.

**It is not** the probability that the null is true. A p-value of 0.33
from our test against 155 doesn’t mean there’s a 33% chance that the
mean equals 155. The p-value is a statement about data under an assumed
model, not about the model itself.

**It is not** a measure of effect size. With a large enough sample, even
a mean of 154.99 cm would produce a very small p-value when tested
against 155. The p-value reflects the ratio of the signal to the noise;
it doesn’t tell you how big the signal is.

**It is not** a measure of practical importance. A small p-value means
the data are hard to explain under the null — not that the effect
matters in practice.

\[perhaps this section is worth its own post, with simulations
demonstrating each of these points\]

\[I guess we will also need a post about treating 5% as significant.
this post would be about managing false positives and stuff, about the
logic of the decision rule. We don’t need to get into this in this post,
I think.\]

## Summary

The p-value is the probability of seeing a t-value at least as extreme
as ours if the null hypothesis were true. We build that null
distribution by simulating what t-values would look like under the null,
and it turns out to be the t-distribution with n − 1 degrees of freedom
— heavier-tailed than the normal, because σ is estimated.

For heights tested against 155 cm, p ≈ 0.33: our data are compatible
with a mean of 155. Tested against 0 — `lm()`’s default — the p-value is
essentially zero, because no one believed the mean height was zero to
begin with.

In Part 8, we’ll turn to the third goal from Part 1: prediction.
