---
title: 'Understanding Regression: Getting Started'
description: >-
  This is the first post in a series on understanding regression. In this first
  post I focus on what the main question is that we should be asking when we
  think we should use regression.
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
- [The goal](#the-goal)
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

This is the first blog post of a series of blog posts about
understanding regression.

I’m a behavioral scientist with several scientific publications to my
name in which I’ve used statistical tools like regression to answer
questions. Yet, despite my experience, I admittedly don’t feel like I
*really* understand regression. I know *how* to use it—I can run models
and report the results. But there are times where I’m just running code
because I’ve been told “that’s how you do it.” When things get
complicated, and sometimes not even that complicated, I find myself
relying almost entirely on conventions rather than understanding it
myself.

You might feel the same way. Regression is often taught as a black box:
you run the code or click the buttons and copy the output. The focus is
on performing statistics rather than on building a conceptual
understanding. This, of course, does not breed understanding.

I also sometimes see a focus on the mechanics of statistics in classes
on regression. It consists of showing formulas or manually calculating
some part of statistics. While they help to some extent in building an
understanding of statistics, they are still often limited in that they
are either too simple (like calculating the sum of squared residuals
manually) or too complicated (like many formulas are, to me at least).

What I need, and what I suspect many others need, is an approach that is
more about creating a conceptual understanding that makes regression
make sense. That’s what this series is about.

## An example

To build this conceptual understanding, I’ll work through examples using
real data. I’ll use data from Richard McElreath’s excellent book
*Statistical Rethinking*, which is also the source of my inspiration for
the approach I’ll be taking. The data is a partial census of the !Kung
San people, compiled from interviews conducted by Nancy Howell in the
late 1960s. We’ll focus on heights of adults (18 years or older).

Here’s what the the first few rows of the data look like:

<details class="code-fold">
<summary>Code</summary>

``` r
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

``` r
ggplot(data, aes(x = height)) +
  geom_histogram()
```

</details>

![](1-understanding-regression-part-1_files/figure-commonmark/histogram-1.svg)

At this point I’d like to already run a regression model so we have some
numbers to look at and ask ourselves what these mean. The simplest model
we can run is one in which we regress heights onto… nothing, this is
called an **intercept-only model**.

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

As you can see in the output that we get running the `summary()`
function, we get an estimate of 154.6 cm and a standard error of 0.41
cm.

Here’s where I want to pause and ask some questions:

- What do these numbers *mean*? The estimate is 154.6 cm, but what is
  that estimating? Just the average of our sample, or something more?
- Why do they have these particular values? The estimate turns out to be
  the mean of the sample, but why is it the mean? Why not the median or
  some other number?
- **Why do we want these numbers?** Different people might run this
  model for different reasons—to describe the sample, to estimate a
  population parameter, to make predictions.

## The goal

When we run a regression model, we’re typically interested in one or
both of these goals:

1.  **Estimation**: What are the model parameters (like the mean) and
    how uncertain are we about them?
2.  **Prediction**: What would we expect to observe in new data?

Most researchers focus on estimation—reporting coefficients, standard
errors, confidence intervals. Prediction also seems to be what we often
want to know, though this seems less emphasized in papers I’m familiar
with.

I don’t want to assume one of these goals. I think both are often what’s
of interest, so when thinking about how to think about regression, I
want to take a perspective that encompasses both of these goals.

I think both of these goals can be understood through a single unifying
question:

**What distribution might have generated this data?**

For our height data, we might propose that heights follow a **normal
distribution**—a bell-shaped curve defined by two parameters: μ (the
mean) and σ (the standard deviation).

These two parameters give us everything we need for both estimation and
prediction:

- **For estimation**: μ tells us the typical height, and we can quantify
  how uncertain we are about that estimate
- **For prediction**: Both μ and σ together describe the full
  distribution, which we can use to predict what heights we’d expect in
  new individuals

This is why the distribution perspective is unifying—it naturally
encompasses both goals.

In this series, I’m going to build up an understanding of regression
from this foundation. The core question will always be: **What
distribution describes this data?**

For our height data, this means we’ll work through several steps. As we
do, we’ll need to address important questions about uncertainty (how
well have we estimated the parameters?) and appropriateness (is the
distribution we chose actually a good match for the data?). These
considerations are fundamental to statistical analysis.

Here are the main steps we’ll tackle:

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

The dashed line represents a **normal distribution**. We’re proposing
that heights are drawn from this distribution, which is defined by just
two parameters: a mean (μ) and a standard deviation (σ).

Our `lm()` model was estimating these parameters. The intercept (154.6)
is our estimate of μ, and the residual standard error is our estimate of
σ.

This lets us:

- Answer questions about the typical height (μ)
- Quantify our uncertainty about that estimate (the standard error tells
  us how uncertain we are about μ)
- Predict the range of heights we’d expect in a new sample (using both μ
  and σ)
- Check whether the normal distribution is appropriate (Does it match
  the data? A normal distribution spans from negative infinity to
  positive infinity, but heights have a clear minimum. Part of
  understanding regression is understanding when our chosen distribution
  might not be appropriate—and what to do about it.)

## Summary

This post introduces the core perspective that will guide this entire
series: **statistical modeling is about choosing and fitting
distributions to data.**

When you run a regression model, you’re proposing that heights follow a
specific distribution, and you’re estimating that distribution’s
parameters.

Those parameters are what let you answer questions. You can use them
to: - Estimate what the typical value is and how uncertain your estimate
of the parameter is - Test hypotheses (does the estimated parameter
differ from some value?) - Predict new observations

This distribution-focused perspective provides a unified framework for
understanding regression.

In the next post, we’ll dig deeper into the normal distribution and why
it’s often a reasonable distribution to use.
