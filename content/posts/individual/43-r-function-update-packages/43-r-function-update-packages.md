---
title: An R function to update packages
description: A custom function to view and update out-of-date R packages.
date: 2025-01-10T00:00:00.000Z
updated: 2025-01-22T00:00:00.000Z
categories:
  - R
---


I’m a big fan of the new R IDE called
[Positron](https://positron.posit.co) but unlike RStudio, it doesn’t yet
have a built-in way to update out-of-date R packages. So I took a look
at the available functions for checking and updating packages and wrote
my own function.

The first function is `old.packages()`. It checks which packages are
outdated and displays this information as a matrix. It doesn’t look
particularly pretty and also includes some information that isn’t very
important (in most cases).

The second function is `update.packages()`. This function can be used to
update out-of-date packages, either one by one or all at once, or via
some kind of user interface (although that didn’t work for me).

I wrote a custom function that combines both `old.packages()` and
`update.packages()`. It more clearly displays which packages are
outdated and then prompts you to decide whether to update them:

<details open class="code-fold">
<summary>Code</summary>

``` r
update_packages <- function() {
  old.packages() |>
    tibble::as_tibble() |>
    dplyr::rename(
      package = Package,
      installed = Installed,
      available = ReposVer
    ) |>
    dplyr::select(package, installed, available) |>
    print()

  input <- readline(prompt = "Update packages? Yes/no ")

  if (input %in% c("y", "yes", "Yes")) {
    update.packages(ask = FALSE)
  }
}
```

</details>

The function roughly mimics how I use the graphical user interface of
RStudio to update packages. Feel free to copy it directly into your
projects, save it as a
[snippet](https://code.visualstudio.com/docs/editor/userdefinedsnippets),
or include it in a (personal) R package.

I’ve added a keyboard shortcut to run this code, using the following
settings in `keybindings.json`:

<details open class="code-fold">
<summary>Code</summary>

``` json
{
  "key": "cmd+p cmd+u",
  "command": "workbench.action.executeCode.console",
  "when": "editorTextFocus",
  "args": {
    "langId": "r",
    "code": "old.packages() |> tibble::as_tibble() |> dplyr::rename(package = Package,installed = Installed,available = ReposVer) |>dplyr::select(package, installed, available) |>print(n = Inf);input <- readline(prompt = 'Update packages? Yes/no ');if (input %in% c('y', 'yes', 'Yes')) {update.packages(ask = FALSE)}",
    "focus": false
  }
}
```

</details>

This means I can press CMD + P, followed by CMD + U, to update the
packages. Nifty!
