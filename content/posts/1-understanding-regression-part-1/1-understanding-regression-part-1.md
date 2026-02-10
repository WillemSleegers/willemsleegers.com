---
title: "Understanding Regression: Getting Started"
description: >-
  This is the first post in a series on understanding regression. In this first
  post I focus on what the main question is that we should be asking when we
  think we should use regression.
date: 2025-01-15T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---

- [Introduction](#introduction)
- [An example](#an-example)
- [Why use regression?](#why-use-regression)
- [What’s ahead](#whats-ahead)
- [Summary](#summary)

<details class="code-fold">
<summary>Code</summary>

```r
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

This is the first post of a series of blog posts about understanding
regression.

I’m a behavioral scientist with several scientific publications to my
name in which I’ve used statistical tools like regression to answer
questions. Yet, despite my experience, I admittedly don’t feel like I
_really_ understand regression. I know _how_ to use it—I can run models
and report the results. But there are times when I’m just running code
because I’ve been told “that’s how you do it.” When things get
complicated, and sometimes not even that complicated, I find myself
relying almost entirely on conventions rather than understanding it
myself.

You might feel the same way. Regression is often taught as a black box:
you run the code or click the buttons and copy the output. The focus is
on performing statistics rather than on building a conceptual
understanding.

I also sometimes see a focus on the mechanics of statistics in classes
on regression. It consists of showing formulas or manually calculating
some statistic. While this can help you understand statistics to some
extent, it is often still limited in that it is too simple (like
calculating the sum of squared residuals manually) or too complicated
(like many formulas are, to me at least).

What I need, and what I suspect many others need, is an approach that is
more about creating a _conceptual_ understanding that makes regression
make sense. That’s what this series is about.

## An example

To build this conceptual understanding, I’ll work through examples using
real data. I’ll use data from Richard McElreath’s excellent book
_Statistical Rethinking_, which also inspired the approach I’ll be
taking. The data is a partial census of the !Kung San people, compiled
from interviews conducted by Nancy Howell in the late 1960s. We’ll focus
on heights of adults (18 years or older).

Here’s what the first few rows of the data look like:

<details class="code-fold">
<summary>Code</summary>

```r
data <- read_csv(here("assets", "data", "Howell1.csv"))
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

And here’s what all the heights look like, as a histogram:

<details class="code-fold">
<summary>Code</summary>

```r
ggplot(data, aes(x = height)) +
  geom_histogram()
```

</details>

![](1-understanding-regression-part-1_files/figure-commonmark/histogram-1.svg)

Let’s immediately run a regression so we have some numbers to look at
and ask ourselves what they mean. The simplest model we can run is one
in which we regress heights onto… nothing; this is called an
**intercept-only model**.

<details class="code-fold">
<summary>Code</summary>

```r
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

As you can see in the output produced by running the `summary()`
function, we get an estimate of 154.6 cm and a standard error of 0.41
cm.

Here’s where I want to pause and ask some questions:

- What do these numbers _mean_? The estimate is 154.6 cm, but what is
  that estimating? Just the average of our sample, or something more?
- Why do they have these particular values? The estimate turns out to be
  the mean of the sample, but why is it the mean? Why not the median or
  some other number?
- **Why do we want these numbers?**

It is this last question I want to focus on.

## Why use regression?

When we run a regression model, we’re typically interested in one or
both of the following goals:

1.  **Estimation**: What are the model parameters (like the mean) and
    how uncertain are we about them?
2.  **Prediction**: What would we expect to observe in new data?

Most researchers focus on estimation. In the papers I’m familiar with,
authors often report coefficients, standard errors, and confidence
intervals, which suggests a focus on estimation. Prediction is often
what we want too, though it is less emphasized in papers (authors rarely
report prediction intervals).

I don’t want to assume one of these goals, though. I think both are
often what’s of interest, so I want to take a perspective that
encompasses both of these goals.

I think both of these goals can be understood through a single unifying
question:

**What distribution might have generated this data?**

For our height data, we might propose that heights follow a normal
distribution—a bell-shaped curve defined by two parameters: μ (the mean)
and σ (the standard deviation).

These two parameters give us everything we need for both estimation and
prediction:

- **For estimation**: μ tells us the typical height, and we can quantify
  how uncertain we are about that estimate
- **For prediction**: Both μ and σ together describe the full
  distribution, which we can use to predict what heights we’d expect in
  new individuals

Here are the heights again, but now with a proposed normal distribution
overlaid:

<details class="code-fold">
<summary>Code</summary>

```r
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

The dashed line represents a **normal distribution**. We’re proposing
that heights are drawn from this distribution, which is defined by just
two parameters: a mean (μ) and a standard deviation (σ).

Our `lm()` model was estimating these parameters. The intercept (154.6)
is our estimate of μ, and the residual standard error is our estimate of
σ.

## What’s ahead

In this series, I’m going to build up an understanding of regression
from this foundation. The core question will always be: **What
distribution describes this data?**

Here are the main steps we’ll tackle:

1.  **Choose a distribution**: What distribution might describe heights?
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

## Summary

This post introduces the core perspective that will guide this entire
series: **statistical modeling is about choosing and fitting
distributions to data.**

When you run a regression model, you’re proposing that your data follows
a specific distribution and you’re estimating that distribution’s
parameters. Those parameters let you estimate typical values, quantify
uncertainty, test hypotheses, and predict new observations.

In the next post, we’ll dig deeper into the normal distribution and why
it’s often a reasonable distribution to use.
