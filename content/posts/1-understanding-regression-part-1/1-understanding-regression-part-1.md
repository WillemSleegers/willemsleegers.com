---
title: Understanding regression (part 1)
description: >-
  This is Part 1 of a series of blog posts on how to understand regression. The
  goal is to develop an intuitive understanding of the different components of
  regression. In this first post, we figure out where the estimate of an
  intercept-only regression model comes from.
date: 2020-08-01T00:00:00.000Z
updated: 2024-10-06T00:00:00.000Z
tags:
  - statistics
  - tutorial
  - regression
code-fold: true
toc: true
---


- [Setup](#setup)
- [The simplest model](#the-simplest-model)
- [The error of models](#the-error-of-models)
- [The data-driven model](#the-data-driven-model)
- [Conclusion](#conclusion)

Statistical regression techniques are an important tool in data
analysis. As a behavioral scientist, I use it to test hypotheses by
comparing differences between groups of people or testing relationships
between variables. While it is easy to run regression analyses using
popular software tools, like SPSS or R, it often remains a black box
that is not well understood. In fact, I do not believe I actually
understand regression. Not fully understanding the mechanics of
regression could be okay, though. After all, you also don’t need to know
exactly how car engines work in order to drive a car. However, I think
many users of regression have isolated themselves too much from the
mechanics of regression. This may be a source of some mistakes
researchers make, such as including every available variable into a
model without understanding what the regression is actually doing. If
you’re using regression to try and make inferences about the world, it’s
probably a good idea to know what you’re doing.

In this series of posts, I’ll work through the mechanics of regression
to build a genuine intuition for how it works. This is Part 1.

Feel free to follow me along by copy-pasting the code from each step.

## Setup

To figure out regression, we need data. We could make up some data on
the spot, but I’d rather use data that is a bit more meaningful (to me,
anyway). Since I’m a big Pokémon fan, I’ll use a data set containing
Pokémon statistics.

In case you’re following along, start by loading the required packages
and a custom function to calculate the mode. You can also copy the
styling options I use, such as my ggplot2 defaults. You’ll also need to
read in the [data](https://www.willemsleegers.com/data/pokemon.csv).
After reading in the data, I subset the data to make the data a bit more
manageable.

<details class="code-fold">
<summary>Code</summary>

``` r
library(tidyverse)
library(here)
library(gt)

# A custom function to calculate the mode
mode <- function(x) {
  ux <- unique(x)
  ux[which.max(tabulate(match(x, ux)))]
}

# Theme settings
theme_set(theme_minimal(base_size = 16))
primary <- "#16a34a"

# Data
pokemon <- read_csv(here("public", "data", "pokemon.csv"))
pokemon25 <- filter(pokemon, pokedex <= 25)
```

</details>

Let’s take a look at several attributes of some Pokémon to see what kind
of information the data contains.

<details class="code-fold">
<summary>Code</summary>

``` r
pokemon25 |>
  filter(pokedex <= 10) |>
  select(
    name,
    type_primary,
    type_secondary,
    height,
    weight,
    evolution
  ) |>
  gt() |>
  cols_label(
    name = "Name",
    type_primary = "Primary type",
    type_secondary = "Secondary type",
    height = "Height",
    weight = "Weight",
    evolution = "Evolution"
  )
```

</details>

<div id="tbl-pokemon25">

Table 1

<div class="cell-output-display">

<div id="kgwntdvxsd" style="padding-left:0px;padding-right:0px;padding-top:10px;padding-bottom:10px;overflow-x:auto;overflow-y:auto;width:auto;height:auto;">
<style>#kgwntdvxsd table {
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
&#10;#kgwntdvxsd thead, #kgwntdvxsd tbody, #kgwntdvxsd tfoot, #kgwntdvxsd tr, #kgwntdvxsd td, #kgwntdvxsd th {
  border-style: none;
}
&#10;#kgwntdvxsd p {
  margin: 0;
  padding: 0;
}
&#10;#kgwntdvxsd .gt_table {
  display: table;
  border-collapse: collapse;
  line-height: normal;
  margin-left: auto;
  margin-right: auto;
  color: #333333;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  background-color: #FFFFFF;
  width: auto;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #A8A8A8;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #A8A8A8;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_caption {
  padding-top: 4px;
  padding-bottom: 4px;
}
&#10;#kgwntdvxsd .gt_title {
  color: #333333;
  font-size: 125%;
  font-weight: initial;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-color: #FFFFFF;
  border-bottom-width: 0;
}
&#10;#kgwntdvxsd .gt_subtitle {
  color: #333333;
  font-size: 85%;
  font-weight: initial;
  padding-top: 3px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-color: #FFFFFF;
  border-top-width: 0;
}
&#10;#kgwntdvxsd .gt_heading {
  background-color: #FFFFFF;
  text-align: center;
  border-bottom-color: #FFFFFF;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_bottom_border {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_col_headings {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_col_heading {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 6px;
  padding-left: 5px;
  padding-right: 5px;
  overflow-x: hidden;
}
&#10;#kgwntdvxsd .gt_column_spanner_outer {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 4px;
  padding-right: 4px;
}
&#10;#kgwntdvxsd .gt_column_spanner_outer:first-child {
  padding-left: 0;
}
&#10;#kgwntdvxsd .gt_column_spanner_outer:last-child {
  padding-right: 0;
}
&#10;#kgwntdvxsd .gt_column_spanner {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 5px;
  overflow-x: hidden;
  display: inline-block;
  width: 100%;
}
&#10;#kgwntdvxsd .gt_spanner_row {
  border-bottom-style: hidden;
}
&#10;#kgwntdvxsd .gt_group_heading {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  text-align: left;
}
&#10;#kgwntdvxsd .gt_empty_group_heading {
  padding: 0.5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: middle;
}
&#10;#kgwntdvxsd .gt_from_md > :first-child {
  margin-top: 0;
}
&#10;#kgwntdvxsd .gt_from_md > :last-child {
  margin-bottom: 0;
}
&#10;#kgwntdvxsd .gt_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 10px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  overflow-x: hidden;
}
&#10;#kgwntdvxsd .gt_stub {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#kgwntdvxsd .gt_stub_row_group {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 5px;
  padding-right: 5px;
  vertical-align: top;
}
&#10;#kgwntdvxsd .gt_row_group_first td {
  border-top-width: 2px;
}
&#10;#kgwntdvxsd .gt_row_group_first th {
  border-top-width: 2px;
}
&#10;#kgwntdvxsd .gt_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#kgwntdvxsd .gt_first_summary_row {
  border-top-style: solid;
  border-top-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_first_summary_row.thick {
  border-top-width: 2px;
}
&#10;#kgwntdvxsd .gt_last_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_grand_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#kgwntdvxsd .gt_first_grand_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: double;
  border-top-width: 6px;
  border-top-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_last_grand_summary_row_top {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-style: double;
  border-bottom-width: 6px;
  border-bottom-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_striped {
  background-color: rgba(128, 128, 128, 0.05);
}
&#10;#kgwntdvxsd .gt_table_body {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_footnotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_footnote {
  margin: 0px;
  font-size: 90%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#kgwntdvxsd .gt_sourcenotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}
&#10;#kgwntdvxsd .gt_sourcenote {
  font-size: 90%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#kgwntdvxsd .gt_left {
  text-align: left;
}
&#10;#kgwntdvxsd .gt_center {
  text-align: center;
}
&#10;#kgwntdvxsd .gt_right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
&#10;#kgwntdvxsd .gt_font_normal {
  font-weight: normal;
}
&#10;#kgwntdvxsd .gt_font_bold {
  font-weight: bold;
}
&#10;#kgwntdvxsd .gt_font_italic {
  font-style: italic;
}
&#10;#kgwntdvxsd .gt_super {
  font-size: 65%;
}
&#10;#kgwntdvxsd .gt_footnote_marks {
  font-size: 75%;
  vertical-align: 0.4em;
  position: initial;
}
&#10;#kgwntdvxsd .gt_asterisk {
  font-size: 100%;
  vertical-align: 0;
}
&#10;#kgwntdvxsd .gt_indent_1 {
  text-indent: 5px;
}
&#10;#kgwntdvxsd .gt_indent_2 {
  text-indent: 10px;
}
&#10;#kgwntdvxsd .gt_indent_3 {
  text-indent: 15px;
}
&#10;#kgwntdvxsd .gt_indent_4 {
  text-indent: 20px;
}
&#10;#kgwntdvxsd .gt_indent_5 {
  text-indent: 25px;
}
&#10;#kgwntdvxsd .katex-display {
  display: inline-flex !important;
  margin-bottom: 0.75em !important;
}
&#10;#kgwntdvxsd div.Reactable > div.rt-table > div.rt-thead > div.rt-tr.rt-tr-group-header > div.rt-th-group:after {
  height: 0px !important;
}
</style>

| Name       | Primary type | Secondary type | Height | Weight | Evolution |
|------------|--------------|----------------|--------|--------|-----------|
| Bulbasaur  | Grass        | Poison         | 0.7    | 6.9    | 0         |
| Ivysaur    | Grass        | Poison         | 1.0    | 13.0   | 1         |
| Venusaur   | Grass        | Poison         | 2.0    | 100.0  | 2         |
| Charmander | Fire         | NA             | 0.6    | 8.5    | 0         |
| Charmeleon | Fire         | NA             | 1.1    | 19.0   | 1         |
| Charizard  | Fire         | Flying         | 1.7    | 90.5   | 2         |
| Squirtle   | Water        | NA             | 0.5    | 9.0    | 0         |
| Wartortle  | Water        | NA             | 1.0    | 22.5   | 1         |
| Blastoise  | Water        | NA             | 1.6    | 85.5   | 2         |
| Caterpie   | Bug          | NA             | 0.3    | 2.9    | 0         |

</div>

</div>

</div>

Pokémon have different types (e.g., grass, fire, water), height, weight
weight, and they are of a particular evolutionary stage (0, 1, or 2).
This last variable refers to a Pokémon’s ability to evolve and when they
do, they tend to become bigger and more powerful.

Let’s say that we are interested in understanding the weight of
different Pokémon. Below I have plotted the weight of the first 25
Pokémon, from Bulbasaur to Pikachu.

<details class="code-fold">
<summary>Code</summary>

``` r
ggplot(pokemon25, aes(x = reorder(name, pokedex), y = weight)) +
  geom_bar(stat = "identity", fill = primary) +
  labs(x = "", y = "Weight (kg)") +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05))) +
  theme(
    panel.grid.major.x = element_blank(),
    axis.text.x = element_text(angle = 45, hjust = 1)
  )
```

</details>

<div id="fig-pokemon25">

<img
src="1-understanding-regression-part-1_files/figure-commonmark/fig-pokemon25-1.svg"
id="fig-pokemon25" />

Figure 1

</div>

We see that the lightest Pokémon is Pidgey, with a weight of 1.8kg. The
heaviest Pokémon is Venusaur, with a weight of 100kg. The average weight
is 26.144kg.

## The simplest model

In order to understand the weights of different Pokémon, we need to come
up with a statistical model. In a way, this can be considered a
description problem. How can we best describe the different weights that
we have observed? The simplest description is a single number. We can
say that all Pokémon have a weight of say, 6 kg. In other words:

`weight = 6 kg`

Of course, this is just one among many possible models. Below I plot
three different models, including our `weight = 6 kg` model.

<details class="code-fold">
<summary>Code</summary>

``` r
ggplot(pokemon25, aes(x = reorder(name, pokedex), y = weight)) +
  geom_bar(stat = "identity", fill = primary) +
  geom_abline(intercept = c(6, 40, 75), slope = 0, linetype = "dashed") +
  annotate(
    geom = "label",
    label = c("weight = 6 kg", "weight = 40 kg", "weight = 75 kg"),
    x = 25,
    y = c(8, 42, 77),
    hjust = 1,
    vjust = 0,
    size = 5
  ) +
  labs(x = "", y = "Weight (kg)", linetype = "") +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05))) +
  scale_linetype_manual(values = c("dashed", "dotted", "dotdash")) +
  coord_cartesian(clip = "off") +
  theme(
    panel.grid.major.x = element_blank(),
    axis.text.x = element_text(angle = 45, hjust = 1),
  )
```

</details>

<div id="fig-three-models">

<img
src="1-understanding-regression-part-1_files/figure-commonmark/fig-three-models-1.svg"
id="fig-three-models" />

Figure 2

</div>

While a model like `weight = 6 kg` is a valid model, it is not a very
good model. In fact, it only perfectly describes Pikachu’s weight and
inaccurately describes the weight of the remaining 24 Pokémon. The other
models, such as `weight = 40kg` might be even worse. They do not even
describe a single Pokémon’s weight correctly, although they do get
closer to some of the heavier Pokémon. How do we decide which model is
the better model? In order to answer that question, we need to consider
the model’s error.

## The error of models

The error of a model is the degree to which the model inaccurately
describes the data. There are several ways to calculate that error,
depending on how you define error. We will cover three of them.

The first definition of error is simply the number of times the model
inaccurately describes the data. For each observation we check whether
the model correctly describes it or not. We then sum the number of
misses and consider that the amount of error for that model. For our
`weight = 6 kg` model, the answer is 24; out of the 25 Pokémon only
Pikachu has a weight of 6, which means the model is correct once and
wrong 24 times.

We can now compare different models to one another by calculating the
error for a range of models. Below I plot the number of errors for 100
different models, starting with the model `weight = 1 kg`, up to
`weight = 10 kg`, in steps of 0.1. Ideally we would test more models (up
to the heaviest Pokémon we know of), but for the sake of visualizing the
result, I decided to only plot a small subset of models.

<details class="code-fold">
<summary>Code</summary>

``` r
errors_binary <- expand_grid(
  model = seq(from = 1, to = 10, by = 0.1),
  weight = pull(pokemon25, weight)
) |>
  mutate(error = if_else(abs(weight - model) == 0, 0, 1)) |>
  group_by(model) |>
  summarize(error_sum = sum(error))

ggplot(errors_binary, aes(x = model, y = error_sum)) +
  geom_line(color = primary, linewidth = 1.25) +
  coord_cartesian(ylim = c(0, 25)) +
  scale_x_continuous(breaks = 1:10) +
  labs(x = "Model (weight = x kg)", y = "Error (sum of errors)")
```

</details>

<div id="fig-error-sum">

<img
src="1-understanding-regression-part-1_files/figure-commonmark/fig-error-sum-1.svg"
id="fig-error-sum" />

Figure 3

</div>

We see that almost all models perform poorly. The number of errors range
from 23 to 25 and most models have a sum of 25 errors, which means they
do not accurately describe any of the Pokémon. Some have an error of 24,
meaning they describe the weight of 1 Pokémon correctly. There is 1
model with an error of 23: `weight = 6.9 kg`. Apparently there are 2
Pokémon with a weight of 6.9, which means that this model outperforms
the others.

Despite there being a single model that outperforms the others in this
set of models, it’s still a pretty poor model. After all, it is wrong 23
out of 25 times. Perhaps there are some models that outperform this
model, but it’s unlikely. That’s because we’re defining error here in a
very crude way. The model needs to exactly match the weight of the
Pokémon, or else it counts as an error. Saying a weight is 6 kg, while
it is in fact 10 kg, is as wrong as saying the weight is 60 kg.

Instead of defining error in this way, we can redefine it so that it
takes into account the *degree* of error. We can define error as the
difference between the actual data point and the model’s value. So, in
the case of our `weight = 6 kg` model, an actual weight of 10 kg would
have an error of 10 - 6 = 4. This definition of error is often referred
to as the residual.

Below I plot the residuals of the first 25 Pokémon for our
`weight = 6 kg` model.

<details class="code-fold">
<summary>Code</summary>

``` r
ggplot(pokemon25, aes(x = reorder(name, pokedex), y = weight)) +
  geom_bar(stat = "identity", fill = primary) +
  geom_segment(aes(xend = pokedex, y = 6, yend = weight), linetype = 2) +
  geom_point() +
  geom_abline(intercept = 6, slope = 0) +
  labs(x = "", y = "Weight (kg)") +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05))) +
  theme(
    panel.grid.major.x = element_blank(),
    axis.text.x = element_text(angle = 45, hjust = 1)
  )
```

</details>

<div id="fig-residuals">

<img
src="1-understanding-regression-part-1_files/figure-commonmark/fig-residuals-1.svg"
id="fig-residuals" />

Figure 4

</div>

We can add up all of the (absolute) residuals to determine the model’s
error. Just like with the binary definition of error, we can then
compare multiple models. This is what you see in the graph below. For
each model, from `weight = 1 kg` to `weight = 100 kg`, we calculated the
absolute residuals and added them together.

<details class="code-fold">
<summary>Code</summary>

``` r
errors_residuals <- expand_grid(
  model = seq(from = 1, to = 100, by = 0.1),
  weight = pull(pokemon25, weight)
) |>
  mutate(error = abs(weight - model)) |>
  group_by(model) |>
  summarize(error_sum = sum(error))

ggplot(errors_residuals, aes(x = model, y = error_sum)) +
  geom_line(color = primary, linewidth = 1.25) +
  scale_y_continuous(breaks = seq(from = 500, to = 1900, by = 200)) +
  labs(x = "Model (weight = x kg)", y = "Error (sum of residuals)")
```

</details>

<div id="fig-error-residuals">

<img
src="1-understanding-regression-part-1_files/figure-commonmark/fig-error-residuals-1.svg"
id="fig-error-residuals" />

Figure 5

</div>

This graph looks very different compared to the graph where we
calculated the error defined as the sum of misses. Now we see that a
minimum appears. Unlike the binary definition of error, it looks like
there are fewer *best* models. More importantly, though, we have defined
error in a less crude manner, meaning that the better models indeed
capture the data much better than before.

But we might still not be entirely happy with this new definition of
error either. Calculating the sum of absolute residuals for each model
comes with another conceptual problem.

When you sum the absolute errors, four errors of 1 are equal to a single
error of 4. In other words, you could have a model that is slightly off
multiple times or one that might make fewer, but larger, errors. Both
would be counted as equally wrong. That seems problematic. Conceptually
speaking, we might find it more problematic when a model is very wrong
than when the model is slightly off multiple times. If we think that, we
need another definition of error.

To address this issue, we can square the residuals before adding them
together. That way, larger errors become relatively larger compared to
smaller errors. Using our previous example, summing four residuals of 1
remains 4, but a single residual of 4 becomes 4² = 16. The model now
gets punished more severely for making large mistakes.

Using this new definition of error, we again plot the error for each
model, from 1 to 100.

<details class="code-fold">
<summary>Code</summary>

``` r
errors_squared_residuals <- expand_grid(
  model = seq(from = 1, to = 100, by = 0.1),
  weight = pull(pokemon25, weight)
) |>
  mutate(error = abs(weight - model)^2) |>
  group_by(model) |>
  summarize(error_sum = sum(error))

ggplot(errors_squared_residuals, aes(x = model, y = error_sum)) +
  geom_line(color = primary, linewidth = 1.25) +
  geom_vline(xintercept = mean(pull(pokemon25, weight)), linetype = 2) +
  labs(x = "Model", y = "Error (sum of squared residuals)")
```

</details>

<div id="fig-error-squared-residuals">

<img
src="1-understanding-regression-part-1_files/figure-commonmark/fig-error-squared-residuals-1.svg"
id="fig-error-squared-residuals" />

Figure 6

</div>

We see a smooth curve, with a clear minimum indicated by the vertical
dashed line. This vertical line indicates the model that best describes
the data. What is the value of the best model exactly? In this case, the
answer is 26.144. And it turns out, there is an easy way to determine
this value.

## The data-driven model

Rather than setting a specific value and seeing how it fits the data, we
can also use the data to determine the best-fitting value. In the
previous graph we saw that the best fitting model is one where the
weight is equal to 26.144. This value turns out to be the mean of the
different weights we have observed in our sample. Had we defined error
as simply the sum of absolute residuals, this would be a different
value. In fact, the best fitting value would then be equal to 13, or the
median. And had we used the binary definition of error, the best fitting
value would be the mode, which in our case is: 6.9.

Note that there is not always a unique answer to which model is the best
fitting model, depending on the error definition. For example, it is
possible that there are multiple modes. If you use the binary definition
of error, that would mean there are multiple equally plausible models.
This can be another argument to not define a model’s error in such a
crude way.

The table below shows an overview of which technique can be used to find
the best fitting value, depending on the error definition.

<details class="code-fold">
<summary>Code</summary>

``` r
tibble(
  error_definition = c(
    "sum of errors",
    "sum of absolute residuals",
    "sum of squared residuals"
  ),
  estimation_technique = c("mode", "median", "mean")
) |>
  gt() |>
  cols_label(
    error_definition = "Error definition",
    estimation_technique = "Estimation technique"
  )
```

</details>

<div id="tbl-errors">

Table 2

<div class="cell-output-display">

<div id="wzmvadpfco" style="padding-left:0px;padding-right:0px;padding-top:10px;padding-bottom:10px;overflow-x:auto;overflow-y:auto;width:auto;height:auto;">
<style>#wzmvadpfco table {
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
&#10;#wzmvadpfco thead, #wzmvadpfco tbody, #wzmvadpfco tfoot, #wzmvadpfco tr, #wzmvadpfco td, #wzmvadpfco th {
  border-style: none;
}
&#10;#wzmvadpfco p {
  margin: 0;
  padding: 0;
}
&#10;#wzmvadpfco .gt_table {
  display: table;
  border-collapse: collapse;
  line-height: normal;
  margin-left: auto;
  margin-right: auto;
  color: #333333;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  background-color: #FFFFFF;
  width: auto;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #A8A8A8;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #A8A8A8;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_caption {
  padding-top: 4px;
  padding-bottom: 4px;
}
&#10;#wzmvadpfco .gt_title {
  color: #333333;
  font-size: 125%;
  font-weight: initial;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-color: #FFFFFF;
  border-bottom-width: 0;
}
&#10;#wzmvadpfco .gt_subtitle {
  color: #333333;
  font-size: 85%;
  font-weight: initial;
  padding-top: 3px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-color: #FFFFFF;
  border-top-width: 0;
}
&#10;#wzmvadpfco .gt_heading {
  background-color: #FFFFFF;
  text-align: center;
  border-bottom-color: #FFFFFF;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_bottom_border {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_col_headings {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_col_heading {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 6px;
  padding-left: 5px;
  padding-right: 5px;
  overflow-x: hidden;
}
&#10;#wzmvadpfco .gt_column_spanner_outer {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 4px;
  padding-right: 4px;
}
&#10;#wzmvadpfco .gt_column_spanner_outer:first-child {
  padding-left: 0;
}
&#10;#wzmvadpfco .gt_column_spanner_outer:last-child {
  padding-right: 0;
}
&#10;#wzmvadpfco .gt_column_spanner {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 5px;
  overflow-x: hidden;
  display: inline-block;
  width: 100%;
}
&#10;#wzmvadpfco .gt_spanner_row {
  border-bottom-style: hidden;
}
&#10;#wzmvadpfco .gt_group_heading {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  text-align: left;
}
&#10;#wzmvadpfco .gt_empty_group_heading {
  padding: 0.5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: middle;
}
&#10;#wzmvadpfco .gt_from_md > :first-child {
  margin-top: 0;
}
&#10;#wzmvadpfco .gt_from_md > :last-child {
  margin-bottom: 0;
}
&#10;#wzmvadpfco .gt_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 10px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  overflow-x: hidden;
}
&#10;#wzmvadpfco .gt_stub {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#wzmvadpfco .gt_stub_row_group {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 5px;
  padding-right: 5px;
  vertical-align: top;
}
&#10;#wzmvadpfco .gt_row_group_first td {
  border-top-width: 2px;
}
&#10;#wzmvadpfco .gt_row_group_first th {
  border-top-width: 2px;
}
&#10;#wzmvadpfco .gt_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#wzmvadpfco .gt_first_summary_row {
  border-top-style: solid;
  border-top-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_first_summary_row.thick {
  border-top-width: 2px;
}
&#10;#wzmvadpfco .gt_last_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_grand_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#wzmvadpfco .gt_first_grand_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: double;
  border-top-width: 6px;
  border-top-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_last_grand_summary_row_top {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-style: double;
  border-bottom-width: 6px;
  border-bottom-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_striped {
  background-color: rgba(128, 128, 128, 0.05);
}
&#10;#wzmvadpfco .gt_table_body {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_footnotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_footnote {
  margin: 0px;
  font-size: 90%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#wzmvadpfco .gt_sourcenotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}
&#10;#wzmvadpfco .gt_sourcenote {
  font-size: 90%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#wzmvadpfco .gt_left {
  text-align: left;
}
&#10;#wzmvadpfco .gt_center {
  text-align: center;
}
&#10;#wzmvadpfco .gt_right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
&#10;#wzmvadpfco .gt_font_normal {
  font-weight: normal;
}
&#10;#wzmvadpfco .gt_font_bold {
  font-weight: bold;
}
&#10;#wzmvadpfco .gt_font_italic {
  font-style: italic;
}
&#10;#wzmvadpfco .gt_super {
  font-size: 65%;
}
&#10;#wzmvadpfco .gt_footnote_marks {
  font-size: 75%;
  vertical-align: 0.4em;
  position: initial;
}
&#10;#wzmvadpfco .gt_asterisk {
  font-size: 100%;
  vertical-align: 0;
}
&#10;#wzmvadpfco .gt_indent_1 {
  text-indent: 5px;
}
&#10;#wzmvadpfco .gt_indent_2 {
  text-indent: 10px;
}
&#10;#wzmvadpfco .gt_indent_3 {
  text-indent: 15px;
}
&#10;#wzmvadpfco .gt_indent_4 {
  text-indent: 20px;
}
&#10;#wzmvadpfco .gt_indent_5 {
  text-indent: 25px;
}
&#10;#wzmvadpfco .katex-display {
  display: inline-flex !important;
  margin-bottom: 0.75em !important;
}
&#10;#wzmvadpfco div.Reactable > div.rt-table > div.rt-thead > div.rt-tr.rt-tr-group-header > div.rt-th-group:after {
  height: 0px !important;
}
</style>

| Error definition          | Estimation technique |
|---------------------------|----------------------|
| sum of errors             | mode                 |
| sum of absolute residuals | median               |
| sum of squared residuals  | mean                 |

</div>

</div>

</div>

We can now update our model to refer to the estimation technique, rather
than a fixed value. Given that the third definition of error seems to be
most suitable, both pragmatically and conceptually, we’ll use the mean:

`weight = mean(weight)`

This is also the value you get when you perform a regression analysis in
R.

<details class="code-fold">
<summary>Code</summary>

``` r
lm(weight ~ 1, data = pokemon25)
```

</details>


    Call:
    lm(formula = weight ~ 1, data = pokemon25)

    Coefficients:
    (Intercept)  
          26.14  

By regressing weight onto 1 we are telling R to run an intercept-only
model. This means that R will estimate which value will best fit all the
values in the outcome variable, just like we have done ourselves earlier
by testing different models such as `weight = 6 kg`.

The result is an intercept value of 26.144, which matches the mean of
the weights.

## Conclusion

So, we now know where the intercept comes from when we run an
intercept-only model: it is the mean of the data we are trying to model.

Note that it is the mean because we defined the model’s error as the sum
of *squared* residuals. Had we defined the error differently, the
intercept would be different. With the sum of *absolute* residuals, the
intercept would be the median. With the sum of errors, it would be the
mode.

Why did we use the sum of squared residuals? We had a conceptual reason:
we wanted to punish larger residuals relatively more than several
smaller errors. But it turns out there is another reason to favor
squared residuals, which has to do with a nice property of the mean
compared to the median. This will be covered in Part 2 of ‘Understanding
Regression’.
