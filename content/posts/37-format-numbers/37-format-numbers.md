---
title: Formatting numbers
description: A showcase of the function I use to format numbers.
date: 2024-05-17T00:00:00.000Z
categories:
  - R
  - function
code-tools: true
code-fold: show
---


This blog post covers the function I use to format numbers. It’s kinda
work-in-progress / test place for my function because I know I’m not
happy with it yet and, as you can see below, I’ll show what output it
produces for many different numbers, so I can also use it to see if it
does what I want it to do.

Run the following setup code if you want to follow along.

<details open class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
```

</details>

## The function

Below is the function I use. It has 4 arguments:

- `x`: The number to format
- `trailing_digits`: This is a bit of a weird one. It refers to how many
  decimals you want, excluding leading zeroes in the decimal part of the
  number. I often want a number like 0.002121 to be rounded to 0.0021
  instead of 0.00, so instead of simply referring to the number of
  digits, I call it trailing digits.
- `digits`: This one forces the number of decimals, so setting this to 2
  will always show (only) 2 digits
- `omit_zero`: For numbers that can only range from -1 to 1, the leading
  zero is often non-informative, so this argument removes that leading
  zero.

<details open class="code-fold">
<summary>Code</summary>

``` r
format_number <- function(
    x,
    trailing_digits = 2,
    digits = NULL,
    omit_zero = FALSE) {
  # Convert the number to a string to use regex to extract different parts
  # of the number (e.g., decimals)
  string <- as.character(x)

  # Extract and count decimals
  decimals <- stringr::str_extract(string, "(?<=\\.).+")
  decimals_n <- dplyr::if_else(is.na(decimals), 0, stringr::str_length(decimals))

  # Count number of leading zeroes in the decimals
  zeroes <- stringr::str_extract(string, "(?<=\\.)0+")
  zeroes_n <- dplyr::if_else(is.na(zeroes), 0, stringr::str_length(zeroes))

  # If digits are set, it overrules trailing digits
  if (!is.null(digits)) {
    output <- format(round(x, digits), nsmall = digits)
  } else {
    trailing_digits <- dplyr::if_else(
      decimals_n > trailing_digits,
      trailing_digits + zeroes_n,
      trailing_digits
    )

    output <- x |>
      round(digits = trailing_digits) |>
      purrr::map2_chr(trailing_digits, formatC, format = "f")
  }

  # Remove leading zero
  if (omit_zero) output <- stringr::str_remove(output, "^0")

  # Replace NAs with NA
  output <- dplyr::if_else(stringr::str_detect(output, "NA"), NA, output)

  return(output)
}
```

</details>

## Testing it out

The table below shows what kind of output is produced by the function
depending on its input. It serves as an illustration of how the function
works and as a test for me to see whether the function does what I want
it to do.

| Number     | `trailing_digits` | `digits` | `omit_zero` | Result   |
|------------|-------------------|----------|-------------|----------|
| 1          | 0                 | \-       | `FALSE`     | 1        |
| 1          | 2                 | \-       | `FALSE`     | 1.00     |
| 1          | \-                | 2        | `FALSE`     | 1.00     |
| 1.0        | 2                 | \-       | `FALSE`     | 1.00     |
| 1.02       | 1                 | \-       | `FALSE`     | 1.02     |
| 1.02       | \-                | 1        | `FALSE`     | 1.0      |
| 1.02       | 2                 | \-       | `FALSE`     | 1.02     |
| 1.0234     | 2                 | \-       | `FALSE`     | 1.023    |
| 1.00234    | 2                 | \-       | `FALSE`     | 1.0023   |
| 1.00020345 | 2                 | \-       | `FALSE`     | 1.00020  |
| 0.123      | 2                 | \-       | `TRUE`      | .12      |
| 0.123      | 2                 | \-       | `FALSE`     | 0.12     |
| `NA`       | 2                 | \-       | `FALSE`     | NA       |
| 1.23, 4.56 | 1                 | \-       | `FALSE`     | 1.2, 4.6 |

## Limitations

The function isn’t complete yet. For example, I should also add
something to deal with very large or very small numbers. I’ll update the
post when I make adjustments to the function.

## Updates

- The function is now vectorized, so it works when you give it multiple
  numbers at once.
- The function can now deal with missing values.

*This post was last updated on 2025-01-03.*
