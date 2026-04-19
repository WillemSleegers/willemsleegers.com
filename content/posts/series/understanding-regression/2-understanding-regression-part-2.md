---
title: 'Understanding Regression (Part 2): Why the Normal Distribution?'
description: >-
  In Part 1, I proposed that regression is about choosing and fitting
  distributions to data. In this post, I explain why the normal distribution is
  often the right choice.
date: 2025-01-16T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---


- [Recap](#recap)
- [The ubiquity of the normal
  distribution](#the-ubiquity-of-the-normal-distribution)
- [A parsimonious distribution](#a-parsimonious-distribution)
- [Applying this to our heights](#applying-this-to-our-heights)
- [When the normal distribution doesn’t
  apply](#when-the-normal-distribution-doesnt-apply)
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

In Part 1, I introduced the core question to help us understand
regression: **What distribution might have generated the data?**

When we run a model like `lm(height ~ 1)`, we’re saying that heights
follow a normal distribution and we estimate its parameters (μ and σ).
But this raises a question: why pick the normal distribution?

## The ubiquity of the normal distribution

Many natural phenomena follow an approximately normal distribution:
heights (of adults), blood pressure, test scores. This is because
outcomes that are influenced by many small, independent factors tend to
look bell-shaped when those factors add up. Heights, for example, are
shaped by many genes and environmental influences, each contributing a
small amount.

We can use a simple simulation to demonstrate that a normal distribution
emerges when many small effects add up. Imagine a variable that is the
sum of 20 small, independent effects. Each effect is a random number,
drawn uniformly between -1 and 1. On their own, these individual effects
look nothing like a normal distribution. They come from a uniform (flat)
distribution. But when we add up 20 of them and repeat this 1000 times,
the result looks like a normal distribution:

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

n_simulations <- 1000

sums <- replicate(n_simulations, sum(runif(20, min = -1, max = 1)))

ggplot(tibble(x = sums), aes(x = x)) +
  geom_histogram(aes(y = after_stat(density)), binwidth = 0.5) +
  stat_function(
    fun = dnorm,
    args = list(mean = mean(sums), sd = sd(sums)),
    linewidth = 1,
    color = "black",
    linetype = "dashed"
  ) +
  labs(
    x = "Sum of 20 small effects",
    y = "Density"
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-small-effects">

![](2-understanding-regression-part-2_files/figure-commonmark/fig-small-effects-1.svg)

Figure 1: Summing many small effects produces a normal distribution

</div>

No single effect is normally distributed, but their sum is. This is a
general pattern: whenever an outcome is shaped by many small, additive
influences, the result tends toward a normal distribution. Since many
things we measure in the real world (heights, blood pressure, test
scores) are plausibly the sum of many small factors, it’s no surprise
the normal distribution appears so often.

There’s another attractive property of the normal distribution that
makes it sensible to use: it’s parsimonious.

## A parsimonious distribution

The normal distribution is defined by just two parameters: a mean (μ)
and a standard deviation (σ). It describes a center and some spread, and
nothing more. It doesn’t claim the data is skewed, or that there are
multiple groups, or that there are hard boundaries. It commits to the
minimum structure needed to describe a distribution.

To see why that matters, consider three distributions that all have a
mean of 155 and a standard deviation of 8:

<details class="code-fold">
<summary>Code</summary>

``` r
x <- seq(120, 190, length.out = 500)

distributions <- bind_rows(
  tibble(
    x = x,
    density = dnorm(x, mean = 155, sd = 8),
    distribution = "Normal"
  ),
  tibble(
    x = x,
    density = ifelse(x >= 139, dgamma(x - 139, shape = 4, scale = 4), 0),
    distribution = "Skewed"
  ),
  tibble(
    x = x,
    density = 0.5 * dnorm(x, 148, sqrt(15)) + 0.5 * dnorm(x, 162, sqrt(15)),
    distribution = "Bimodal"
  )
) |>
  mutate(
    distribution = factor(
      distribution,
      levels = c("Normal", "Skewed", "Bimodal")
    )
  )

ggplot(distributions, aes(x = x, y = density, color = distribution)) +
  geom_line(linewidth = 1) +
  labs(
    x = "Value",
    y = "Density"
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-distributions">

![](2-understanding-regression-part-2_files/figure-commonmark/fig-distributions-1.svg)

Figure 2: Three distributions, all with mean = 155 and SD = 8

</div>

All three distributions agree on the same two facts: the mean is 155 and
the standard deviation is 8. But look at how different they are. Each
distribution makes different claims:

- The **skewed** distribution claims the data is asymmetric, with a
  longer tail on one side and a hard lower bound
- The **bimodal** distribution claims there are two distinct clusters
- The **normal** distribution claims a single most common value and
  variation around that single value

This is the key observation. The skewed and bimodal distributions are
both *adding* claims on top of the mean and SD. One claims the data is
asymmetric, the other claims there are multiple groups. These are
additional structural commitments that would need evidence to justify.

The normal distribution doesn’t add any of that. Among all distributions
with the same mean and variance, it’s the one that adds the least
structure.[^1] It commits to a center and some spread, nothing more.

Part of what makes the normal distribution uncommitted is that it
doesn’t claim any boundaries. Its tails extend infinitely in both
directions, with values becoming less and less likely as you move away
from the center. You might object: heights can’t be negative, so doesn’t
the normal distribution get that wrong? Technically yes, but a normal
distribution with mean 155 and SD 8 assigns essentially zero probability
to negative values. The boundary exists in reality, but it’s so far from
where the data lives that we can ignore it. We’ll see later that
boundaries can become relevant, in which case we need a different
distribution.

So the normal distribution has two things going for it: it’s often
genuinely the right distribution for the data, and it makes the fewest
structural claims beyond a mean and standard deviation. If we later find
evidence that a different distribution would make more sense, we can
update our model. But until then, the normal distribution is a strong
starting point.

## Applying this to our heights

Let’s return to our height data and see how well the normal distribution
fits.

<details class="code-fold">
<summary>Code</summary>

``` r
data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)

sample_mean <- mean(data$height)
sample_sd <- sd(data$height)

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

<div id="fig-histogram-with-normal">

![](2-understanding-regression-part-2_files/figure-commonmark/fig-histogram-with-normal-1.svg)

Figure 3: Heights with normal distribution overlay

</div>

The dashed line shows a normal distribution with mean 154.6 cm and
standard deviation 7.7 cm.

Does it fit perfectly? No. You can see places where the histogram bars
don’t quite match the curve. But look at what it does capture: the data
is roughly symmetric, peaked near the center, and tapers off at the
extremes. That’s exactly what we’d expect from an outcome shaped by many
small additive effects.

This is also how you’d spot a problem. If the data were clearly skewed
or had two peaks, the mismatch would be obvious, and we’d want to
reconsider our distributional choice. We’ll explore how to formally
check model fit later in the series.

But often you don’t even need to look at the data. Sometimes prior
knowledge about the outcome is enough to rule the normal distribution
out before you even see it.

## When the normal distribution doesn’t apply

The clearest case is when the outcome has hard boundaries. If you’re
measuring reaction times, values can’t be negative, so there’s a floor
at zero. If you’re measuring proportions, values are bounded between 0
and 1. The normal distribution extends infinitely in both directions, so
it doesn’t respect these constraints. For bounded or strictly positive
outcomes, other distributions (like the log-normal or beta distribution)
are better choices.

Similarly, if the outcome is a count (number of errors, number of
children), it can only take whole numbers. A normal distribution is
continuous and can take any value, including fractions and negatives.
Count data calls for distributions like the Poisson or negative
binomial.

The point isn’t that you need to get the distribution exactly right.
It’s that when you know something about the structure of your data (hard
boundaries, discrete values, strong skew), you should use that
knowledge. The normal distribution is often the right choice for
continuous, unbounded outcomes. But when the data has structure that the
normal can’t capture, use a distribution that reflects what you know.

We’ll return to alternative distributions later in the series.

## Summary

Why the normal distribution? For many things we measure, the normal
distribution is an accurate description of the data. It arises whenever
many small effects add up, which is the case for many outcomes in the
real world. It’s also parsimonious: defined by just two parameters (μ
and σ), it captures a center and some spread without adding claims about
asymmetry, multiple groups, or hard boundaries.

But how do we estimate μ and σ from our sample? That’s what we’ll tackle
in Part 3.

[^1]: There’s a formal way to express this. In information theory, the
    **maximum entropy distribution** for a given set of constraints is
    the distribution that is the most spread out while still satisfying
    those constraints. Entropy measures how much uncertainty a
    distribution contains: high entropy means the distribution is as
    noncommittal as possible. When the only constraints are a mean and a
    variance, the maximum entropy distribution is the normal
    distribution.
