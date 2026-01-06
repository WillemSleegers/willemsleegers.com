---
title: Understanding regression (part 1)
description: >-
  This is the first post in a series on understanding regression. I start with a
  brief introduction to the importance of understanding regression well and then
  discuss some data and ask the question what we should ask of this data, as the
  first step to understanding regression.
date: 2025-01-15T00:00:00.000Z
tags:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---


- [Introduction](#introduction)
- [An example](#an-example)
- [The question](#the-question)
- [The roadmap ahead](#the-roadmap-ahead)
- [A preview: Where we’re headed](#a-preview-where-were-headed)
- [Summary](#summary)

<details class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
library(here)

# Theme settings
primary <- "#16a34a"

theme_set(theme_minimal(base_size = 16))
update_geom_defaults(
  "histogram",
  aes(fill = primary, color = "white")
)
```

</details>

## Introduction

This is the first blog post on a series of blog posts about
understanding regression.

I’m a behavioral scientist, and to be honest, I don’t really feel like I
understand regression. I know *how* to use it—I can run models and
report the results. But there are times where I’m just running code
because I’ve been told “that’s how you do it.” When things get
complicated, and sometimes not even that complicated, I find myself
relying almost entirely on conventions rather than understanding it
myself.

If you work with data, you might feel the same way. This shouldn’t be
surprising. Regression is often taught as a black box: you run the code
or click the buttons and copy the output. The focus is on performing
statistics rather than on building a conceptual understanding. This can
lead to confusion about what the results actually mean.

The other approach I often see is to focus on the mechanics of
statistics. It consists of showing formula’s or on manually calculating
some part of statistics. While they help to some extent in building an
understanding of statistics, they are still often limited in that they
are either too simple (like calculating some small part of statistics
yourself) or too complicated (like many formula’s are, to me at least).

What I need, and what I suspect many others need, is an approach that is
more about creating a conceptual understanding that makes regression
make sense. That’s what this series is about.

## An example

To build this conceptual understanding, I’ll work through examples using
real data. I’ll use data from Richard McElreath’s excellent book
*Statistical Rethinking*. The data is a partial census of the !Kung San
people, compiled from interviews conducted by Nancy Howell in the late
1960s. We’ll focus on heights of adults (18 years or older).

<details class="code-fold">
<summary>Code</summary>

``` r
data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)

head(data)
```

</details>

    # A tibble: 6 × 4
      height weight   age  male
       <dbl>  <dbl> <dbl> <dbl>
    1   152.   47.8    63     1
    2   140.   36.5    63     0
    3   137.   31.9    65     0
    4   157.   53.0    41     1
    5   145.   41.3    51     0
    6   164.   63.0    35     1

Here’s what the heights look like:

<details class="code-fold">
<summary>Code</summary>

``` r
ggplot(data, aes(x = height)) +
  geom_histogram()
```

</details>

![](1-understanding-regression-part-1_files/figure-commonmark/histogram-1.svg)

We can run a regression model on this data. Since we’re just looking at
heights without any predictors, this is called an **intercept-only
model**—it estimates a single value that represents the data:

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

We get an estimate of 154.6 cm with a standard error of 0.41 cm.

## The question

Here’s where I want to pause and ask some questions:

- What do these numbers actually *mean*? The estimate is 154.6 cm—but
  what is that estimating? Just the average of our sample, or something
  more?
- Why do they have these particular values? The estimate turns out to be
  the mean of the sample, but why is it the mean? Why not the median or
  some other number?
- **What perspective helps us understand what we’re doing?** Different
  people might run this model for different reasons—to describe the
  sample, to estimate a population parameter, to make predictions. What
  framework ties these goals together?

When we run a regression model, we’re typically interested in one or
both of these goals:

1.  **Estimation**: What are the model parameters (like the mean) and
    how uncertain are we about them?
2.  **Prediction**: What would we expect to observe in new data?

Most researchers focus on estimation—reporting means, coefficients,
standard errors, confidence intervals. Prediction is valuable too,
though perhaps less commonly emphasized.

Both of these goals can be understood through a single unifying
question:

**What distribution might have generated this data?**

This might seem abstract, so let me explain what I mean. When we look at
our height data, we see variation—some people are taller, some shorter.
This variation follows some pattern. We can describe that pattern
mathematically using a **probability distribution**.

A distribution is a pragmatic tool. When we say heights follow a normal
distribution, we’re not making a deep claim about biology. We’re saying:
“Given what we know about heights (they cluster around a central value,
they vary in a certain way, they have natural limits), the normal
distribution is a reasonable, parsimonious choice for describing the
pattern.”

The normal distribution says: “heights vary around some central value
(μ), with some amount of spread (σ), following this specific
mathematical pattern.” That’s it—just two numbers (μ and σ) characterize
the entire distribution.

Once we think this way, everything else follows:

- **Estimation**: We estimate the parameters (μ and σ) that define the
  process
- **Uncertainty**: We quantify how uncertain we are about those
  parameters (because our sample is just one possible outcome from the
  process)
- **Prediction**: We can predict new observations by drawing from the
  distribution with our estimated parameters
- **Model checking**: We can evaluate whether our assumed process
  matches the actual data

## The roadmap ahead

In this series, I’m going to build up an understanding of regression
from this foundation. The core question will always be: **What
distribution describes this data?**

For our height data, this means we’ll work through several steps:

1.  **Choose a distribution**: What distribution might describe heights?
    (We’ll start with the normal distribution and explore why it’s a
    reasonable, parsimonious choice given what we know about heights)
2.  **Estimate parameters**: Once we’ve chosen a distribution, how do we
    estimate its parameters (μ and σ) from our data?
3.  **Quantify uncertainty**: How certain can we be about those
    estimates?
4.  **Check the model**: Does the distribution we chose actually match
    the data?
5.  **Add predictors**: What happens when we think the distribution’s
    parameters depend on other variables (like height depending on sex
    or age)?

Each post in the series will tackle one of these steps, building up our
understanding gradually.

## A preview: Where we’re headed

Here are the heights again, but now with a proposed model overlaid:

<details class="code-fold">
<summary>Code</summary>

``` r
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
  )
```

</details>

![Heights with normal distribution
overlay](1-understanding-regression-part-1_files/figure-commonmark/distribution-1.svg)

The dashed line represents a **normal distribution**—a specific
mathematical process that could generate heights like these. We’re
proposing that heights are drawn from this process, which is defined by
just two parameters: a mean (μ) and a standard deviation (σ).

Our `lm()` model was estimating these parameters. The intercept (154.6)
is our estimate of μ, and the residual standard error is our estimate of
σ.

But here’s the key: we’re not just “fitting a curve to data.” We’re
proposing a distribution and estimating its parameters. This lets us:

- Answer questions about the typical height (μ)
- Quantify our uncertainty about that estimate (the standard error tells
  us how uncertain we are about μ)
- Predict the range of heights we’d expect in a new sample (using both μ
  and σ)

There’s also a critical meta-question we need to ask:

- **Is the normal distribution appropriate for this data?** A normal
  distribution spans from negative infinity to positive infinity, but
  heights have a clear minimum (you can’t be -50 cm tall). Part of
  understanding regression is understanding when our chosen distribution
  might not be appropriate—and what to do about it.

## Summary

This post introduces the core perspective that will guide this entire
series: **statistical modeling is about choosing and fitting
distributions to data.**

When you run `lm(height ~ 1)`, you’re not just calculating a mean and
standard error. You’re proposing that heights follow a specific
distribution (the normal distribution), and you’re estimating that
distribution’s parameters (μ and σ).

Those parameters are what let you answer questions. You can use them
to: - Estimate what the typical value is and how uncertain that estimate
is - Test hypotheses (does the mean differ from some value?) - Predict
new observations

This distribution-focused perspective provides a unified framework for
understanding regression.

In the next post, we’ll dig deeper into this idea by exploring
distributions as models. Why do we use a normal distribution for
heights? What makes it a reasonable, parsimonious choice?
