---
title: Useful R snippets
description: A collection of useful R snippets
date: 2024-09-21T00:00:00.000Z
updated: 2025-01-02T00:00:00.000Z
categories:
  - R
---


<details open class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
```

</details>

## Create a new column with a value from a specific cell

Take the following simple data frame:

<details open class="code-fold">
<summary>Code</summary>

``` r
df <- tribble(
  ~x,
  ~y,
  "A",
  0.1,
  "B",
  0.4,
  "C",
  0.2,
  "D",
  0.3,
  "E",
  0.5
)

df
```

</details>

    # A tibble: 5 x 2
      x         y
      <chr> <dbl>
    1 A       0.1
    2 B       0.4
    3 C       0.2
    4 D       0.3
    5 E       0.5

Using the following code, we can add a new column that repeats a
specific value from column `y` based on a value in a column `x`.

<details open class="code-fold">
<summary>Code</summary>

``` r
df <- mutate(df, z = nth(y, which(x == "B")))
df
```

</details>

    # A tibble: 5 x 3
      x         y     z
      <chr> <dbl> <dbl>
    1 A       0.1   0.4
    2 B       0.4   0.4
    3 C       0.2   0.4
    4 D       0.3   0.4
    5 E       0.5   0.4

This can be useful if you want to do scaling based on specific values.

<details open class="code-fold">
<summary>Code</summary>

``` r
df |>
  mutate(y_scaled = y / z)
```

</details>

    # A tibble: 5 x 4
      x         y     z y_scaled
      <chr> <dbl> <dbl>    <dbl>
    1 A       0.1   0.4     0.25
    2 B       0.4   0.4     1   
    3 C       0.2   0.4     0.5 
    4 D       0.3   0.4     0.75
    5 E       0.5   0.4     1.25

## A custom function to create a vector of 1s and 0s with a specific proportion of 1s

<details open class="code-fold">
<summary>Code</summary>

``` r
# Custom function to generate a vector of 1s and 0s with a specified proportion of 1s
rbinary <- function(p, n, shuffle = TRUE) {
  # Validate inputs
  if (!is.numeric(n) || length(n) != 1 || n <= 0 || n != round(n)) {
    stop("n must be a positive integer")
  }

  if (!is.numeric(p) || length(p) != 1 || p < 0 || p > 1) {
    stop("p must be a numeric value between 0 and 1")
  }

  # Check if p*n is an integer to avoid rounding
  if (abs(p * n - round(p * n)) > .Machine$double.eps^0.5) {
    stop(
      "The product of proportion (p) and sample size (n) must be an integer to avoid rounding"
    )
  }

  # Generate the binary vector
  ones_count <- p * n
  result <- c(rep(1, ones_count), rep(0, n - ones_count))

  # Shuffle the vector only if shuffle is TRUE
  if (shuffle) {
    result <- sample(result)
  }

  return(result)
}
```

</details>
