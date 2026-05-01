---
title: 'Understanding Regression (Part 6): The t-Value'
description: >-
  Parts 4 and 5 completed the estimation goal. Here we turn to the second goal
  from Part 1 — hypothesis testing. We introduce the t-value as a measure of how
  compatible an estimate is with a specific reference value, and explain why it
  follows the t-distribution.
date: 2025-01-21T00:00:00.000Z
categories:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
draft: true
---


- [Recap](#recap)
- [Hypothesis testing](#hypothesis-testing)
- [The t-value](#the-t-value)
- [t-values have a distribution, too](#t-values-have-a-distribution-too)
- [Degrees of freedom](#degrees-of-freedom)
- [Back to lm()](#back-to-lm)
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

Parts 4 and 5 worked through the first two columns of the `lm()` output:
the estimate of μ and its standard error. Those posts addressed the
estimation goal from Part 1, including quantifying uncertainty. The SE
tells us how much our estimate would vary from sample to sample. Part 5
established that σ is uncertain too.

Now we move to the second goal: hypothesis testing.

<details class="code-fold">
<summary>Code</summary>

``` r
data <- read_csv("Howell1.csv")
data <- filter(data, age >= 18)

sample_mean <- mean(data$height)
sample_sd <- sd(data$height)
n <- nrow(data)
se <- sample_sd / sqrt(n)

t_vs_0 <- sample_mean / se
t_vs_155 <- (sample_mean - 155) / se
```

</details>

## Hypothesis testing

Having an estimate and its uncertainty, we can now ask a different kind
of question: is our estimate consistent with some specific value?

This is what hypothesis testing does. We specify a value we want to
compare our estimate against — the **reference value** — and ask how
compatible our estimate is with it. The claim that the parameter equals
the reference value is called the **null hypothesis**.

You can choose any reference value that makes sense for your question. A
common choice is 0. In many situations, 0 serves as a natural baseline:
it represents the absence of an effect, or nothing going on. Testing
whether an estimate is consistent with zero is a way of asking whether
there is anything worth explaining. `lm()` uses 0 as the reference value
for every coefficient it reports.

## The t-value

The most direct way to assess compatibility is to look at how far our
estimate sits from the reference value. A small gap suggests the data
are consistent with the null hypothesis; a large one suggests they’re
not.

Our estimate of μ is 154.6 cm. Suppose we test against a reference of
155 cm, a plausible average adult height. The raw distance is 154.6 −
155 = -0.4 cm. But that number alone doesn’t tell us whether the gap is
large or small. It depends on how much our estimate typically varies
from sample to sample. A gap of 0.4 cm is unremarkable if estimates
bounce around by several centimeters; it would be substantial if
estimates are usually stable to within a few tenths.

The SE tells us exactly how much our estimate typically varies: 0.41 cm.
Dividing the distance by the SE puts the gap in context:

$$t = \frac{\text{Estimate} - \text{reference}}{\text{SE}} = \frac{154.6 - 155}{0.41} \approx -0.98$$

Our estimate sits about 1 standard error below 155 cm.

As mentioned before, `lm()` defaults to a reference value of 0:

$$t = \frac{154.6 - 0}{0.41} \approx 375$$

Writing the subtraction of 0 explicitly might seem redundant as it
doesn’t change the arithmetic (154.6 - 0 is just 154.6), but it’s good
to repeat the subtraction in order to remind yourself that the reference
value is always there. Our estimate is about 375 standard errors away
from 0 (which is quite substantial, as we’ll see later).

## t-values have a distribution, too

Like μ and σ before it, the t-value is a statistic computed from a
sample, so it has a sampling distribution. In Parts 4 and 5 we explored
those distributions by simulating many samples and watching how each
statistic varied. The same approach works here — and understanding what
distribution t-values follow is what will allow us to compute a p-value
in Part 7.

You might expect the sampling distribution of the t-value to be normal,
just as the mean’s was. But it isn’t. The SE uses an estimated σ, and
that estimate varies from sample to sample (as we saw in Part 5). If a
sample happens to produce an unusually small SD, the SE is too small and
the t-value ends up further from zero than the gap warrants. If the SD
comes out large, the SE is too large and the t-value is pulled toward
zero. To make this concrete: say a sample mean sits 5 cm from the
reference, with n = 5. If that sample happened to produce a small SD of
4 cm, the SE is only 1.8 cm and t = 2.8 — larger than the data warrant.
If instead the SD came out large at 12 cm, the SE inflates to 5.4 cm and
t shrinks to 0.9. This extra variability in the SE produces a
distribution with heavier tails than the normal.

We can see this directly by comparing t-values computed with a fixed σ
versus an estimated one:

<details class="code-fold">
<summary>Code</summary>

``` r
set.seed(42)

n_simulations <- 1000
n_small <- 5

compare_t <- bind_rows(
  tibble(
    t = replicate(n_simulations, {
      sim <- rnorm(n_small, mean = 0, sd = sample_sd)
      mean(sim) / (sample_sd / sqrt(n_small))
    }),
    sigma = "Fixed σ"
  ),
  tibble(
    t = replicate(n_simulations, {
      sim <- rnorm(n_small, mean = 0, sd = sample_sd)
      mean(sim) / (sd(sim) / sqrt(n_small))
    }),
    sigma = "Estimated σ"
  )
) |>
  mutate(sigma = factor(sigma, levels = c("Fixed σ", "Estimated σ")))

overlay <- bind_rows(
  tibble(
    x = seq(-8, 8, length.out = 500),
    density = dnorm(x),
    sigma = "Fixed σ"
  ),
  tibble(
    x = seq(-8, 8, length.out = 500),
    density = dt(x, df = n_small - 1),
    sigma = "Estimated σ"
  )
) |>
  mutate(sigma = factor(sigma, levels = c("Fixed σ", "Estimated σ")))

ggplot(compare_t, aes(x = t)) +
  geom_histogram(aes(y = after_stat(density)), binwidth = 0.5) +
  geom_line(
    data = overlay,
    aes(x = x, y = density),
    linetype = "dashed",
    linewidth = 0.8
  ) +
  facet_wrap(~sigma, ncol = 1) +
  coord_cartesian(xlim = c(-8, 8)) +
  labs(x = "t value", y = "Density") +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-known-vs-estimated">

![](6-understanding-regression-part-6_files/figure-commonmark/fig-known-vs-estimated-1.svg)

Figure 1: T-values computed with a fixed σ follow the standard normal;
with estimated σ, the tails are heavier. Small samples (n = 5) make the
difference visible.

</div>

With a fixed σ, the simulated t-values match the standard normal (dashed
curve, top panel). With estimated σ, the tails are noticeably heavier
(bottom panel). The dashed curve there is the **t-distribution**, and it
fits the simulated values well.

The t-distribution was derived for exactly this purpose: to describe the
distribution of t-values when σ is estimated rather than known.[^1]

Like any distribution, the t-distribution has parameters. In its general
form it has three: a location parameter (μ), a scale parameter (σ), and
degrees of freedom (ν). Computing the t-value has already fixed two of
them: subtracting the reference value centers the distribution at zero
(μ = 0), and dividing by the SE puts it on a scale of one (σ = 1). This
leaves a single free parameter: degrees of freedom.

## Degrees of freedom

You’ve likely seen the term **degrees of freedom** before — it appears
at the bottom of every `lm()` summary as “residual degrees of freedom.”
If you’re like me, this is one of those terms where you might have an
inkling of what it means, but that’s as close as it gets. So let’s try
and get a better understanding of it now.

In this context, degrees of freedom is just a name for the n − 1 that
comes out of estimating σ. To estimate σ, we compute deviations of each
observation from μ — which we don’t know. So we use the sample mean
instead. That substitution introduces a bias: the sample mean always
sits at the center of the observed data, so deviations from it are
systematically smaller than deviations from μ would be. Dividing by n −
1 rather than n corrects for that bias — I go into this in detail in [a
separate post on why we divide by n − 1 to calculate the variance of a
sample](../../individual/4-why-divide-by-n-1/4-why-divide-by-n-1.qmd).
The n − 1 that comes out of that correction is the degrees of
freedom.[^2]

For our data, df = n − 1 = 351. The t-distribution was derived
specifically for the t-value as we’ve defined it — (estimate −
reference) / SE — where the SE uses the bias-corrected sample SD. So df
= n − 1 in the t-distribution isn’t a separate fact: it comes directly
from the same n − 1 in the sample SD.

What df controls is how precisely σ was estimated. With few
observations, the sample SD is imprecise (as we saw in Part 5), making
the SE variable and the t-distribution’s tails heavier. With more
observations, σ is estimated more reliably, the SE stabilizes, and the
t-distribution converges toward the standard normal:

<details class="code-fold">
<summary>Code</summary>

``` r
x_range <- seq(-5, 5, length.out = 500)

convergence <- bind_rows(
  tibble(x = x_range, density = dt(x_range, df = 9), label = "n = 10"),
  tibble(x = x_range, density = dt(x_range, df = 29), label = "n = 30"),
  tibble(x = x_range, density = dt(x_range, df = 351), label = "n = 352"),
  tibble(x = x_range, density = dnorm(x_range), label = "Normal")
) |>
  mutate(
    label = factor(label, levels = c("n = 10", "n = 30", "n = 352", "Normal"))
  )

ggplot(convergence, aes(x = x, y = density, color = label, linetype = label)) +
  geom_line(linewidth = 1) +
  scale_color_manual(
    values = c(
      scales::alpha("black", 0.35),
      scales::alpha("black", 0.6),
      "black",
      primary
    )
  ) +
  scale_linetype_manual(values = c("solid", "solid", "solid", "dashed")) +
  labs(
    x = "Value",
    y = "Density",
    color = NULL,
    linetype = NULL
  ) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05)))
```

</details>

<div id="fig-t-convergence">

![](6-understanding-regression-part-6_files/figure-commonmark/fig-t-convergence-1.svg)

Figure 2: The t-distribution converges to the standard normal as degrees
of freedom increase

</div>

At n = 10 (df = 9), the tails are clearly heavier than the normal. By n
= 352 (df = 351), the two are nearly indistinguishable.

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

The t value column shows 374.6. That’s the estimate minus the reference
value of 0, divided by the SE:

$$t = \frac{154.6 - 0}{0.41} \approx 375$$

Every t-value in the output is a distance from zero, measured in units
of the SE. The residual degrees of freedom in the last line of the
output — 351 — is the df = n − 1 we just discussed: the same n − 1 from
the sample SD.

## Summary

Hypothesis testing asks whether an estimate is consistent with a
specific reference value. The claim that the parameter equals that value
is the null hypothesis. The t-value measures that consistency: it’s the
distance between the estimate and the reference, divided by the SE, so
the distance is expressed in units of natural sampling variability.

The t-distribution, rather than the normal, is used because σ is
estimated. Estimating σ introduces variability into the SE, producing
heavier tails. Degrees of freedom (df = n − 1) reflect how precisely σ
was estimated; with more data, the t-distribution converges to the
normal.

In Part 7, we’ll use the t-distribution to answer one final question:
given a t-value this large, how often would we expect one this extreme
if the reference value were the parameter?

[^1]: It was first published in 1908 by William Gosset, who wrote under
    the pseudonym “Student” — which is why it’s often called Student’s
    t-distribution.

[^2]: There is a more general explanation of the name: ‘degrees of
    freedom’ describes how many values in a set are free to vary.
    Because we compute deviations from the sample mean, those deviations
    must sum to exactly zero — if you know n − 1 of them, the last one
    is fully determined. So only n − 1 deviations are free to take any
    value; the final one is fixed. That’s where the name comes from, and
    it’s a general concept that appears throughout statistics wherever
    estimation introduces a dependency like this. I personally find that
    this explanation rarely serves as a useful one, which is why I’ve
    relegated it to a footnote.
