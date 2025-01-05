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
  ~x, ~y,
  "A", 0.1,
  "B", 0.4,
  "C", 0.2,
  "D", 0.3,
  "E", 0.5
)

df
```

</details>

| x   |   y |
|:----|----:|
| A   | 0.1 |
| B   | 0.4 |
| C   | 0.2 |
| D   | 0.3 |
| E   | 0.5 |

Using the following code, we can add a new column that repeats a
specific value from column `y` based on a value in a column `x`.

<details open class="code-fold">
<summary>Code</summary>

``` r
df <- mutate(df, z = nth(y, which(x == "B")))
df
```

</details>

| x   |   y |   z |
|:----|----:|----:|
| A   | 0.1 | 0.4 |
| B   | 0.4 | 0.4 |
| C   | 0.2 | 0.4 |
| D   | 0.3 | 0.4 |
| E   | 0.5 | 0.4 |

This can be useful if you want to do scaling based on specific values.

<details open class="code-fold">
<summary>Code</summary>

``` r
df |>
  mutate(y_scaled = y / z)
```

</details>

| x   |   y |   z | y_scaled |
|:----|----:|----:|---------:|
| A   | 0.1 | 0.4 |     0.25 |
| B   | 0.4 | 0.4 |     1.00 |
| C   | 0.2 | 0.4 |     0.50 |
| D   | 0.3 | 0.4 |     0.75 |
| E   | 0.5 | 0.4 |     1.25 |
