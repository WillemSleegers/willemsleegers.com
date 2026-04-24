---
title: 'Understanding Regression (Part 1): Getting Started'
description: >-
  This is the first post in a series on understanding regression. In this first
  post I focus on what the main question is that we should be asking when using
  regression.
date: 2025-01-15T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
---


- [Introduction](#introduction)
- [An example](#an-example)
- [Why use regression?](#why-use-regression)
- [What’s ahead](#whats-ahead)
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

## Introduction

I’m a behavioral scientist with several scientific publications to my
name in which I’ve used statistical tools like regression. Yet, despite
my experience with this statistical technique, I don’t feel like I
*really* understand regression. I know *how* to use it—I can run models
and report the results-but there are times when I’m just running code
because I’ve been told that’s how you do it. When things get
complicated, and sometimes not even that complicated, I find myself
relying almost entirely on conventions rather than on my own
understanding.

You might feel the same way. Regression is often taught as a black box:
you run the code or click the buttons and copy the output. The focus in
many courses is on performing statistics rather than on building a
conceptual understanding. I’ve also noticed a lot of statistical
teaching takes a more mechanical approach. You’re given formulas to
memorize or asked to calculate statistics by hand. I can see the appeal
of this approach, since working through the steps yourself can build
intuition, but formulas rarely help me understand something, and
calculating things by hand only takes you so far.

What I need, and what I suspect many others need, is an approach that is
more about creating a *conceptual* understanding that makes regression
make sense. That’s what this series is about.

## An example

To build this conceptual understanding, I’ll work through examples using
real data. I’ll use data from Richard McElreath’s excellent book
*Statistical Rethinking*. The data is a partial census of the !Kung San
people, compiled from interviews conducted by Nancy Howell in the late
1960s. We’ll focus on heights of adults (18 years or older).

Here’s what the first few rows of the data look like:

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

And here’s a histogram of all the heights:

<details class="code-fold">
<summary>Code</summary>

``` r
ggplot(data, aes(x = height)) +
  geom_histogram()
```

</details>

![](1-understanding-regression-part-1_files/figure-commonmark/histogram-1.svg)

Let’s immediately run a regression so we have some concrete numbers to
look at. The simplest model we can run is one in which we regress
heights onto… nothing; this is called an **intercept-only model**.

<details open class="code-fold">
<summary>Code</summary>

``` r
model <- lm(height ~ 1, data = data)
```

</details>

We use `summary()` to get the numbers we need.

<details class="code-fold">
<summary>Code</summary>

``` r
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

As you can see in the output, we get an estimate of 154.6 cm and a
standard error of 0.41 cm.

Here’s where I want to pause and ask ourselves the question, why do we
actually use these statistical tools? Why do we use regression?

## Why use regression?

When we run a regression model, we’re typically interested in one or
more of the following goals:

1.  **Estimation**: What are the model parameters (like the mean) and
    how uncertain are we about them?
2.  **Testing**: Is a parameter compatible with some reference value
    (like zero)?
3.  **Prediction**: What would we expect to observe in new data?

In the behavioral science literature I’m familiar with, testing is by
far the most common goal. Researchers want to know whether an effect is
“significant”, which means running a model and checking whether the
estimate is compatible with zero. Estimation is also common, with
researchers reporting coefficients, standard errors, and confidence
intervals. Prediction is less popular (authors rarely report prediction
intervals), but is also important.

I’m looking for a way of thinking that makes it easier to understand how
regression can be used for each of those goals and I think it comes down
to the following question:

**What distribution might have generated this data?**

Instead of starting with a procedure — run a model, get an estimate —
you start by imagining how the data came to be. Some process generated
these numbers. That process had some underlying shape: values that were
more likely, values that were less likely. A distribution is a way of
describing that shape formally. You may already be familiar with some:
the normal distribution, the Poisson distribution, or perhaps the
binomial distribution.

For our height data, we can propose that heights follow a normal
distribution. This is a bell-shaped curve defined by two parameters: μ
(the mean) and σ (the standard deviation).

These two parameters give us everything we need for estimation, testing,
and prediction:

- **For estimation**: μ tells us the typical height, and we can quantify
  how uncertain we are about that estimate
- **For testing**: Once we know the estimate and its uncertainty, we can
  ask whether it’s compatible with a specific value (like zero)
- **For prediction**: Both μ and σ together describe the full
  distribution, which we can use to predict what heights we’d expect in
  new individuals

Here are the heights again, but now with a normal distribution on top of
the histogram.

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

The dashed line is the normal distribution we’re proposing heights are
drawn from.

Our `lm()` model estimated the parameters that define the distribution.
The intercept (154.6) is our estimate of μ, and the residual standard
error is our estimate of σ.

## What’s ahead

In this series, I’m going to build up an understanding of regression
from this foundation. The core question will always be: **What
distribution might have generated this data?**

Here are the main steps we’ll tackle:

1.  **Choose a distribution**: What distribution might describe the
    data?
2.  **Estimate parameters**: How do we estimate its parameters from our
    data?
3.  **Quantify uncertainty**: How certain can we be about those
    estimates?
4.  **Test hypotheses**: Are the estimates compatible with specific
    values?
5.  **Make predictions**: What would we expect to observe in new data?
6.  **Add predictors**: What happens when the distribution’s parameters
    depend on other variables (like height depending on sex or age)?

Each post in the series will tackle one or more of these steps, building
up our understanding gradually.

## Summary

This post introduces the core perspective to hopefully have regression
make sense: **regression is about choosing and fitting distributions to
data.**

When you run a regression model, you’re proposing that your data follows
a specific distribution and you’re estimating that distribution’s
parameters. Those parameters let you estimate typical values, quantify
uncertainty, test hypotheses, and predict new observations.

In the next post, we’ll dig deeper into the normal distribution and why
it’s often a sensible default.
