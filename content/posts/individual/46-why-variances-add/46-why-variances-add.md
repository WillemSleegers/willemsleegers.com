---
title: Why do variances add but standard deviations don't?
description: >-
  When you add two independent quantities, their variances add up but their
  standard deviations don't. This post explains why, with a concrete example and
  the algebra behind it.
date: 2026-02-15T00:00:00.000Z
categories:
  - statistics
code-fold: true
toc: true
draft: true
---


- [Standard deviation and variance](#standard-deviation-and-variance)
- [Simulation](#simulation)
- [A toy example](#a-toy-example)
- [Why not just add standard
  deviations?](#why-not-just-add-standard-deviations)
- [Why adding variances works](#why-adding-variances-works)
- [The general pattern](#the-general-pattern)
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

A lot of statistics relies on knowing how variability combines. When
calculating standard errors, for instance, we need to add variances
together.

The rule is that when you add two independent quantities, you add their
variances, not their standard deviations.

In this post I want to work through why that is, step by step, and see
if we can build a conceptual understanding of what’s going on.

## Standard deviation and variance

Both the **standard deviation** and the **variance** measure spread by
looking at deviations from the mean. For each value, you compute how far
it is from the mean (its deviation), and then you square it. The
**variance** is the average of these squared deviations. The **standard
deviation** is the square root of the variance, which brings the number
back to the original scale.

The two carry the same information, just on different scales. But as
we’ll see, the squared scale of the variance has a special property that
makes it possible to combine variabilities from independent sources.

## Simulation

Suppose you measure two independent heights, each varying with a
standard deviation of 8 cm (a variance of 64 cm²). We’ll draw two
heights from a normal distribution (μ = 155, σ = 8), compute their sum,
and repeat this 10,000 times.

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

n_simulations <- 10000

sums <- replicate(n_simulations, {
  h1 <- rnorm(1, mean = 155, sd = 8)
  h2 <- rnorm(1, mean = 155, sd = 8)
  h1 + h2
})

sd_of_sum <- sd(sums)

ggplot(tibble(sums = sums), aes(x = sums)) +
  geom_histogram(aes(y = after_stat(density)), binwidth = 1) +
  labs(
    x = "Sum of two heights (cm)",
    y = "Density"
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-simulation">

![](46-why-variances-add_files/figure-commonmark/fig-simulation-1.svg)

Figure 1: The sum of two independent heights varies by about 11.3 cm,
not 16 cm

</div>

If you added the two standard deviations, you’d expect the sum of two
heights to vary with a standard deviation of 8 + 8 = 16 cm. But the
actual standard deviation of the sum is 11.3 cm. Why?

## A toy example

To see exactly what’s going on, let’s simplify things. Imagine each
height can only be one standard deviation above or below the mean (so
deviations of +8 or -8). With two heights, there are four equally likely
scenarios:

| Scenario | Height 1 | Height 2 | Sum’s deviation |
|----------|----------|----------|-----------------|
| 1        | +8       | +8       | +16             |
| 2        | +8       | -8       | 0               |
| 3        | -8       | +8       | 0               |
| 4        | -8       | -8       | -16             |

If both heights are above average (scenario 1), the sum is above average
by 8 + 8 = 16. Both deviations push in the same direction, so they add
up. The same happens when both are below average (scenario 4): the sum
is 16 below what we’d get if both heights were exactly at the mean.

But in scenarios 2 and 3, the deviations push in opposite directions.
One height is 8 above the mean, the other is 8 below, and the sum lands
right at the combined mean. The deviations cancel out.

So half the time the deviations compound and half the time they cancel.
Adding standard deviations (8 + 8 = 16) only gives the right answer for
scenarios 1 and 4, where both deviations push the same way. It ignores
scenarios 2 and 3, where the deviations cancel. The result is that 16
overstates how much the sum actually varies.

## Why not just add standard deviations?

There’s also a more direct way to see why adding standard deviations
can’t work. Think of variance as the area of a square whose side length
is the standard deviation. Each height has SD = 8 and variance = 64, so
each one is an 8 × 8 square with area 64.

<details class="code-fold">
<summary>Code</summary>

``` r
squares <- tibble(
  label = c(
    "Height 1\nSD = 8\nVar = 64",
    "Height 2\nSD = 8\nVar = 64",
    "Sum (correct)\nSD = 11.3\nVar = 128",
    "Sum (if SDs added)\nSD = 16\nVar = 256"
  ),
  side = c(8, 8, sqrt(128), 16),
  x = c(0, 10, 22, 36),
  fill = c(TRUE, TRUE, TRUE, FALSE)
)

ggplot(squares) +
  geom_rect(
    aes(
      xmin = x,
      xmax = x + side,
      ymin = 0,
      ymax = side,
      fill = fill
    ),
    color = "black",
    linewidth = 0.5
  ) +
  geom_text(
    aes(
      x = x + side / 2,
      y = side / 2,
      label = label
    ),
    size = 3.2,
    lineheight = 1.1
  ) +
  scale_fill_manual(
    values = c("TRUE" = primary, "FALSE" = "transparent"),
    guide = "none"
  ) +
  coord_equal() +
  theme_void()
```

</details>

<div id="fig-squares">

![](46-why-variances-add_files/figure-commonmark/fig-squares-1.svg)

Figure 2: Adding variances (areas) gives the correct combined spread.
Adding standard deviations (side lengths) overshoots.

</div>

When we add variances, we add the areas: 64 + 64 = 128. The combined
square has side √128 ≈ 11.3. But if we added the side lengths instead
(8 + 8 = 16), we’d get a square with area 256, nearly double the correct
value. The standard deviation is the square root of the variance, and
square roots don’t preserve sums: √(64 + 64) ≠ √64 + √64.

So there are really two things going on. First, variances are additive
for independent quantities. Second, the square root that converts
variance to standard deviation is a nonlinear operation that breaks that
additivity. The toy example showed us the first part. Now let’s look at
why variances are additive in the first place.

## Why adding variances works

So adding standard deviations doesn’t account for cancellation. But
adding variances does. Why?

Let a be the deviation of height 1 and b be the deviation of height 2.
The sum’s deviation is a + b. To compute the variance of the sum, we
need the average of (a + b)² across all scenarios. When you expand that
squared sum, something useful happens:

$$(a + b)^2 = a^2 + 2ab + b^2$$

The a² part depends only on height 1. The b² part depends only on height
2. And the 2ab part captures the *interaction* between the two: whether
they deviate in the same direction. Let’s compute each part for our four
scenarios:

| Scenario | a   | b   | a²  | 2ab  | b²  | (a + b)² |
|----------|-----|-----|-----|------|-----|----------|
| +8, +8   | 8   | 8   | 64  | +128 | 64  | 256      |
| +8, -8   | 8   | -8  | 64  | -128 | 64  | 0        |
| -8, +8   | -8  | 8   | 64  | -128 | 64  | 0        |
| -8, -8   | -8  | -8  | 64  | +128 | 64  | 256      |

Look at the columns:

- **a²** is always 64. It doesn’t depend on b.
- **b²** is always 64. It doesn’t depend on a.
- **2ab** flips between +128 and -128. When averaged across all four
  scenarios, it’s zero.

The cross-term averages to zero across all scenarios because we assumed
the two heights are independent: when a is positive, b is equally likely
to be positive or negative, so 2ab is equally likely to be +128 or -128.

Since the interaction term vanishes, the variance of the sum is just the
sum of the individual variances:

$$\text{Var}(a + b) = \text{Var}(a) + \text{Var}(b)$$

To see how much independence matters here, consider what happens if the
two heights are perfectly correlated, always deviating in the same
direction. Then only scenarios 1 and 4 occur: the 2ab term is always
+128, never -128. It doesn’t cancel. The variance of the sum becomes
64 + 128 + 64 = 256, and the standard deviation is √256 = 16. That’s
exactly what you’d get by adding standard deviations (8 + 8 = 16). So
adding standard deviations is only correct when the quantities always
move together. Independence is what reduces the combined variability
below that, and the cross-term is what captures the reduction.

This is why adding variances works for independent quantities. The
squaring step creates a decomposition where the individual contributions
(a² and b²) are cleanly separated from the interaction (2ab).
Independence makes the interaction vanish, leaving only the individual
variances.

And this matches our simulation: each height has variance 64, so the
variance of the sum is 64 + 64 = 128, giving a standard deviation of
√128 ≈ 11.3 cm.

This isn’t specific to our ±8 toy example. For any two independent
quantities, the deviation of b doesn’t depend on the deviation of a, so
the product ab is just as likely to be positive as negative. On average,
the cross-term 2ab is zero. That’s why we can go straight from
individual variances to the variance of the sum without enumerating
scenarios.

## The general pattern

This extends beyond two heights. For n independent quantities, each with
variance σ²:

- The variance of the sum is n × σ²
- The standard deviation of the sum is σ√n (not nσ)

Each additional quantity adds σ² to the variance, but the standard
deviation only grows as √n, more slowly than the number of quantities.
Ten quantities don’t produce ten times the spread, only √10 ≈ 3.2 times.

This connects directly to standard errors. The mean of n observations is
the sum divided by n. Dividing by n scales the variance by 1/n² (because
variance involves squaring), so the variance of the mean is n × σ² / n²
= σ²/n, and the standard deviation of the mean is σ/√n.

## Summary

Standard deviation measures how far values typically fall from the mean.
But the typical deviation of a sum isn’t the sum of the typical
deviations, because the individual deviations can point in opposite
directions and offset each other. Variance measures the same thing on a
squared scale, and squaring creates a decomposition ((a + b)² = a² +
2ab + b²) that separates individual contributions from their
interaction. For independent quantities, the interaction term averages
to zero, leaving just Var(a) + Var(b).
