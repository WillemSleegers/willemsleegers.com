# Plan: Restructure Understanding Regression Series

## Overview

Complete redesign of the Understanding Regression blog post series to teach statistical modeling principles (not just OLS mechanics) using a granular, focused approach.

**Target Audience**: Behavioral scientists with experience running regression models who want deeper conceptual understanding.

**Primary Dataset**: !Kung San heights from McElreath's Statistical Rethinking (adults 18+).

## Design Philosophy

**Core Principle**: The question isn't "mean vs median?" but rather "what distribution describes this data?"

**Decision Sequence**:

1. What question are we trying to answer? (Understanding distributions, not summarizing data)
2. What distribution best represents the data?
3. Given that distribution, what parameters define it? (The computer estimates these for us)
4. How certain are we about those estimates?
5. How well does the model fit?
6. Can we add predictors to explain variation?

**Pedagogical Approach**:

- **Heavily rely on simulations and visualizations** to build intuition (not formulas/equations)
- One focused concept per post (6+ granular posts)
- Primary dataset: !Kung San heights (real data, same as McElreath's book)
- Build from intercept-only → simple regression → multiple regression
- Mention theorems by name but don't prove them (keep current style)
- **Distributions first** - start with the distribution concept, not error functions
- **Distinguish from bootstrapping** - our framework is about modeling the data-generating distribution (parametric), not estimating sampling distributions of statistics (bootstrapping). Bootstrapping is a tool that can appear within the framework but doesn't replace it.
- Target audience: behavioral scientists who've used regression but want conceptual understanding

**Critical Terminology Guidelines**:

- Use "**distribution**" not "process" (process implies causal mechanism; distribution is statistical/pragmatic)
- Use "**parsimonious choice**" or "**reasonable choice**" not "assumption" (we're making pragmatic modeling decisions based on what we know)
- Emphasize distributions as **pragmatic tools** for modeling, not claims about reality
- Focus on "**fewest additional claims**" rather than "fewest assumptions"
- Avoid implying there is a "**true distribution**" or "**true parameters**" out there — use "**the model's parameters**" or "**the parameters of the model we've proposed**" instead. μ and σ are fixed within our model, not fixed features of the world.
- Avoid "**true mean**", "**true value**", "**true σ**" in any context — in simulations, use "the value we used to generate the data" or "μ in our simulation"; in inference, use "if μ were 0" rather than "if the true mean were 0".
- **Potential meta-post**: The philosophical stance (distributions as pragmatic tools, no objective truth claim) could be explored explicitly in a reflective/meta post about the series' perspective.

**Tone and Style Guidelines**:

- **Personal and conversational**: Use "I" statements, be honest about learning journey
- **Direct but not negative**: Don't criticize researchers or be condescending about common practices
- **Simple intro**: Start with straightforward statement like "This is the first blog post on..."
- **Avoid marketing language**: No superlatives, no overselling
- **Don't assume readers are doing it wrong**: Don't assume people "just summarize data" or misuse tools
- **Neutral about different goals**: Estimation and prediction are both valid, don't favor one

## Proposed Series Structure

### Part 1: Getting Started (COMPLETED)

**Goal**: Reframe statistical modeling as understanding distributions, not summarizing data

**Content** (ACTUAL):

- **Introduction**: Simple and personal
  - Personal confession: "I'm a behavioral scientist... I don't feel like I *really* understand regression"
  - Problem: regression taught as black box, focus on mechanics not concepts
  - Goal: build conceptual understanding
- **Example with real data**: !Kung San heights (adults 18+) from McElreath's Statistical Rethinking
  - Histogram of heights
  - Run `lm(height ~ 1)` (explains what intercept-only model is first)
  - Pause to ask: What do these numbers mean? Why do we want them?
- **Why use regression?**: Three goals
  1. **Estimation**: What are the parameters and how uncertain are we?
  2. **Testing**: Is a parameter compatible with some reference value (like zero)?
  3. **Prediction**: What would we expect in new data?
  - Notes testing is most common in behavioral science; prediction least common
- **The core question**: "What distribution might have generated this data?"
  - Distributions as formal description of shape (more/less likely values)
  - Proposes normal distribution for heights (μ and σ)
  - Maps parameters to goals: μ for estimation, (estimate + uncertainty) for testing, (μ + σ) for prediction
- **Preview**: Histogram with normal distribution overlay
  - Connection: `lm()` estimates μ (intercept) and σ (residual SE)
- **Roadmap**: 6 steps listed
  1. Choose a distribution
  2. Estimate parameters
  3. Quantify uncertainty
  4. Test hypotheses
  5. Make predictions
  6. Add predictors
- **Summary**: Regression is about choosing and fitting distributions; parameters support estimation, uncertainty, testing, and prediction

**Dataset**: !Kung San heights from Howell1.csv (n=352 adults)
**Status**: Completed (published)
**File**: `content/posts/series/understanding-regression/1-understanding-regression-part-1.qmd`

---

### Part 2: Why the Normal Distribution? (DRAFT)

**Goal**: Introduce the normal distribution as a pragmatic, parsimonious choice for modeling heights

**Content** (ACTUAL):

- **Recap**: Core question from Part 1, why normal?
- **The ubiquity of the normal distribution**: General, data-independent section
  - Normal shows up everywhere: heights, blood pressure, test scores
  - Simulation: sum of 20 small uniform effects → bell-shaped (demonstrates CLT)
  - First argument: sensible default when many small additive factors at play
- **A parsimonious distribution**: Parsimony argument (the bulk of the post)
  - Defined by just two parameters: μ (center) and σ (spread)
  - No claims about skew, multiple groups, or hard boundaries
  - KEY VISUALIZATION: Three distributions all with mean = 155 and SD = 8 (normal, skewed/gamma, bimodal/mixture — no uniform)
    - Skewed claims asymmetry and a hard lower bound
    - Bimodal claims two distinct clusters
    - Normal adds nothing beyond mean and spread
  - Maximum entropy argument in footnote
  - The normal says: "I know the mean and the spread. I'm not going to pretend I know anything else."
  - Note on infinite tails: technically heights can't be negative, but normal assigns essentially zero probability there
- **Applying this to our heights**: Load data + overlay normal on histogram
  - Honest assessment: not perfect but captures general pattern
  - How you'd spot a problem: if clearly skewed or bimodal, you'd reconsider
  - Sometimes prior knowledge alone rules out normal before looking at data
- **When the normal distribution doesn't apply**:
  - Bounded/skewed outcomes (reaction times, proportions) → log-normal, beta
  - Count data → Poisson, negative binomial
  - Likert scales → ordinal models
  - Preview: will return to alternative distributions later
- **Summary**: Two reasons (ubiquity + parsimony); defined by two parameters; bridge to Part 3 (estimating μ and σ)

**Dataset**: !Kung San heights from Howell1.csv
**Status**: Draft (in progress)
**File**: `content/posts/series/understanding-regression/2-understanding-regression-part-2.qmd`
**Length**: ~182 lines

---

### Part 3: Estimating Parameters (DRAFT)

**Goal**: Show that lm() estimates the normal distribution's parameters μ and σ

**Content** (ACTUAL):

- **Recap**: Normal distribution is parsimonious choice; now need to estimate its parameters from data
- **Estimating the parameters**: μ = mean of distribution, σ = standard deviation
  - Sample mean and sample SD are our estimates
  - Distinction: Greek letters (μ, σ) are the model's parameters; sample statistics are estimates that depend on which people were measured
- **What lm() is doing**:
  - Calculate sample mean and SD
  - Run `lm(height ~ 1)` and show output
  - Compare: intercept = sample mean, residual SE = sample SD (they're identical)
  - Explains the name "residual standard error": residuals are heights minus mean; squaring, summing, dividing by n−1, and taking square root = the sample SD computation
  - lm() uses different names ("intercept", "residual standard error") that will make more sense when predictors are added
- **Visualizing the estimated distribution**: Histogram with normal distribution overlay using estimated parameters
- **Summary**: Proposed normal distribution, estimated μ ≈ 154.6 cm and σ ≈ 7.7 cm; bridge to Part 4 (uncertainty — estimates vary across samples)

**Dataset**: !Kung San heights from Howell1.csv
**Status**: Draft (completed)
**File**: `content/posts/series/understanding-regression/3-understanding-regression-part-3.qmd`
**Length**: ~118 lines

---

### Part 4: Uncertainty and the Standard Error (DRAFT)

**Goal**: Understanding parameter uncertainty through the sampling distribution

**Content** (ACTUAL):

- **Recap**: In Part 3 we estimated μ and σ. These are based on one sample — a different group would give different numbers. Focus on μ because lm() reports its SE; σ's uncertainty not reported at all (Part 5).
- **One sample, many possibilities**: Simulate mean across 1000 samples
  - Histogram of sample means, clustered around μ
  - Name it: the **sampling distribution of the mean**; any statistic has its own sampling distribution
  - Explain why it's normal: CLT in footnote (exact for normal model; approximate via CLT for non-normal)
- **What affects uncertainty?**: Two factors
  - Sample size: sampling distributions at n = 10, 50, 352 (faceted plot) — more data, tighter estimates
  - Data variability: sampling distributions at σ = 4, 8, 16 (faceted plot) — more variable data, less precise mean
- **The standard error**:
  - SE = spread of the sampling distribution; measures how much μ's estimate varies
  - Plot simulated SEs (SD of sample means) against σ/√n formula across many sample sizes — they match
  - Diminishing returns: each new observation has less leverage to move the mean
  - Variance derivation in footnote (variance adds linearly, SE is on square root scale)
  - Using sample SD as stand-in for σ here
  - For our heights: SE ≈ 0.41 cm, small relative to σ (7.7 cm)
- **Back to lm()**: The "Std. Error" column = SE of the sampling distribution of the intercept
- **What about σ?**: σ has uncertainty too — Part 5
- **Summary**: SE of μ ≈ 0.41 cm; lm() reports this in "Std. Error" column; σ is next

**Dataset**: !Kung San heights + simulations
**Status**: Draft (completed)
**File**: `content/posts/series/understanding-regression/4-understanding-regression-part-4.qmd`

---

### Part 5: What About σ? (DRAFT)

**Goal**: Show that σ is also uncertain, setting up the t-distribution in Part 6

**Content** (ACTUAL):

- **Recap**: In Part 4 we quantified μ's uncertainty; σ also has uncertainty since it feeds directly into calculating the SE for μ
- **σ varies from sample to sample**: Simulation — draw 1000 samples, calculate SD of each
  - Histogram of sample SDs, clustered around σ
  - Parallel to Part 4's simulation for the mean
- **Different sample sizes**: Sampling distributions of σ at n = 10, 50, 352
  - At n = 10, σ's estimate is all over the place
  - At n = 352, fairly precise
- **A different shape**: σ's sampling distribution is skewed (right tail), unlike μ's symmetric normal
  - SD can't go below zero but can be quite large; extreme observations pull it up, nothing pushes it below zero
  - Distribution follows chi-squared-related distribution; footnote names it formally
  - Skew fades with larger n (same CLT principle)
- **How uncertain is σ?**: Quantifying SE(σ)
  - Plot simulated SE(σ) values (SD of sample SDs) against exact formula across many sample sizes
  - Exact formula uses gamma function ratios: SE(σ) = σ√(1 − [2/(n−1)] · [Γ(n/2)/Γ((n−1)/2)]²)
  - Matches simulations; reports SE(σ) ≈ 0.29 cm for our data
- **Back to lm()**: Residual standard error has no "Std. Error" next to it
  - lm() handles σ's uncertainty implicitly via the t-distribution (heavier tails absorb the extra uncertainty from estimating σ)
- **Summary**: Both μ and σ have sampling distributions; σ's is skewed and chi-squared-related; lm() absorbs σ's uncertainty through the t-distribution; bridge to Part 6 (hypothesis testing)

**Dataset**: !Kung San heights + simulations
**Status**: Draft (completed)
**File**: `content/posts/series/understanding-regression/5-understanding-regression-part-5.qmd`

---

### Part 6: The t-Value (DRAFT)

**Goal**: Explain what the t-value in the lm() output means and why the t-distribution exists

**Content** (ACTUAL):

- **Recap**: Parts 4 and 5 completed the estimation goal (estimate + SE for μ, uncertainty in σ). Part 6 turns to the second goal: hypothesis testing.
- **Hypothesis testing**: Is our estimate consistent with some specific value?
  - The claim that the parameter equals the reference value = the null hypothesis
  - Any reference value can be used; lm() defaults to 0
- **The t-value**: Distance from estimate to reference, in SE units
  - Motivating example: test against 155 cm → t = (154.6 − 155) / 0.41 ≈ −0.98 (interpretable)
  - lm() default test against 0 → t ≈ 377 (trivial for heights but shows the formula)
  - Writing "Estimate − 0" explicitly reinforces that the reference is always there
- **t-values have a distribution, too**: Simulation
  - t-value is a statistic, so it has a sampling distribution
  - Comparison plot at n = 5: fixed σ produces t-values matching standard normal; estimated σ produces heavier tails
  - Reason: variable SE (from variable sample SD) pushes t-values out when SD is small, pulls them in when large
  - The **t-distribution** describes exactly this; historical note in footnote (Gosset/"Student", 1908)
  - In general form: location, scale, and degrees of freedom; computing t already fixes location = 0 and scale = 1, leaving df as the only free parameter
- **Degrees of freedom**: Dedicated section
  - df = n − 1 comes from the bias correction when estimating σ (sample mean is used in place of μ)
  - Dividing by n − 1 corrects the bias; links to a separate post on why we divide by n − 1
  - More general meaning in footnote (n − 1 deviations free to vary since deviations must sum to zero)
  - df controls how precisely σ was estimated → with few observations, heavier tails; with more, converges to normal
- **Convergence**: t-distribution converges to standard normal as n grows
  - Convergence plot at n = 10, 30, 352, and standard normal
- **Back to lm()**: t value column = (estimate − 0) / SE; residual df = n − 1 shown in output
- **Summary**: t-value = distance from reference in SE units; t-distribution used (not normal) because σ is estimated; df = n − 1; bridge to Part 7 (p-value)

**Dataset**: !Kung San heights + simulations (comparison simulation uses n = 5)
**Status**: Draft (completed)
**File**: `content/posts/series/understanding-regression/6-understanding-regression-part-6.qmd`
**Length**: ~210 lines

---

### Part 7: The p-Value

**Goal**: Explain what the p-value means using the t-distribution from Part 6

**Content**:

- **Recap**: We have a t-value and know it follows a t-distribution. The last column in the lm() output is Pr(>|t|). What is this?
- **The question hypothesis testing asks**: If the true parameter were zero, how surprising would our observed t-value be?
  - This is a specific, narrow question. Not "is the mean zero?" but "if the mean WERE zero, would we see data like ours?"
- **Simulation**: Build the null distribution
  - Draw many samples from N(0, σ), compute t for each
  - This gives the distribution of t-values we'd expect if the null were true
  - Plot this distribution and mark where our observed t falls
  - The p-value: the proportion of simulated t-values as extreme as (or more extreme than) ours
- **For heights, this is trivially small**: Of course the mean height isn't zero. The t-value is enormous (hundreds of SEs away from zero). The p-value is essentially zero.
  - Acknowledge this test is uninteresting for the intercept-only model
  - Preview: when we add predictors, the null hypothesis (slope = 0) becomes a meaningful question ("does this predictor matter?")
- **What the p-value does and doesn't tell you**:
  - It IS: the probability of seeing data this extreme if the null were true
  - It is NOT: the probability that the null is true
  - It is NOT: a measure of effect size (a tiny effect can have a tiny p-value with enough data)
  - It is NOT: a measure of practical importance
- **Back to lm()**: The Pr(>|t|) column, the significance stars
- **Summary**: The p-value answers a specific question about compatibility with the null. For the intercept, this test is trivial, but the same machinery becomes central when testing whether predictors have effects.
- **Key insight**: The p-value uses the t-distribution to ask how surprising our estimate would be if the true value were zero. It's a measure of compatibility with the null hypothesis, not a measure of importance or truth.

**Dataset**: !Kung San heights + simulations
**Length estimate**: ~250 lines

---

### Part 8: Using the Model for Prediction

**Goal**: Demonstrate different ways to use the estimated distribution for prediction

**Content**:

- We've estimated μ and σ from our sample
- Now we can use these parameters to make predictions
- **Three types of prediction**:
  1. **Expected values** (`predict()`):
     - Shows what the model expects (μ)
     - For intercept-only model, all predictions are identical (the mean)
     - Useful for estimating the center of the distribution
  2. **Prediction intervals** (`predict(interval = "prediction")`):
     - Accounts for both parameter uncertainty AND individual variation (σ)
     - Gives a range where we expect a new observation to fall
     - Much wider than confidence intervals
  3. **Simulating new observations** (`simulate()` or `rnorm()`):
     - Actually draws new values from N(μ, σ)
     - Shows the variability we expect in real data
     - Can generate many samples to understand distribution
- **Visualize the differences**:
  - Plot showing: point prediction, confidence interval, prediction interval, and simulated values
  - Highlight that they answer different questions
- **Connection to the distribution perspective**:
  - predict() gives μ
  - prediction intervals incorporate σ
  - simulation uses full distribution N(μ, σ)
- **Key insight**: The parameters μ and σ serve different roles in prediction: μ tells us the expected value, σ tells us how much individual observations vary around that expectation

**Dataset**: !Kung San heights
**Length estimate**: ~250 lines

---

### Part 9: Adding a Predictor

**Goal**: Extend from intercept-only to simple regression (one predictor)

**Content**:

- So far: modeled heights as coming from one distribution (all people the same)
- But what if heights vary systematically with something? (e.g., weight, age, sex)
- Use heights with a predictor (weight or sex from the dataset)
- Visualize: scatter plot of predictor vs heights
- Pose the question: "Can we describe heights as a function of weight?"
- The model changes: instead of one μ for everyone, μ varies with weight
- Model: height = intercept + slope × weight + error
- The error still comes from N(0, σ²), but now the mean varies
- Show how OLS finds the line that minimizes squared residuals
- Visualize residuals from the fitted line
- Interpret coefficients: what does slope mean? what does intercept mean?
- **Key insight**: Simple regression is still about estimating means from a normal distribution, but now the mean varies with a predictor

**Dataset**: Heights + predictor (weight or sex)
**Length estimate**: ~300 lines

---

### Part 10: Understanding the Slope

**Goal**: Deep dive into what the slope represents and how it's estimated

**Content**:

- Continue with heights ~ weight (or other predictor)
- Show that slope = Cov(X,Y) / Var(X) (conceptually, not mathematically)
- Visualize different slopes (weak relationship, strong relationship)
- Decompose variation: total variance vs explained variance vs residual variance
- Introduce R²: proportion of variance explained
- Show how uncertainty in slope depends on:
  - Sample size
  - Variance in X (more spread in predictor = more precise slope)
  - Residual variance (noisier relationship = less precise slope)
- Calculate confidence intervals for slope
- **Key insight**: Slope precision depends on sample size, predictor variance, and relationship strength

**Dataset**: Heights + predictor, with simulations showing different scenarios
**Length estimate**: ~300 lines

---

### Part 11: Multiple Predictors

**Goal**: Extend to multiple regression (Y ~ X1 + X2)

**Content**:

- Use heights with multiple predictors (e.g., weight + age, or male/female + age)
- Visualize with multiple 2D plots or facets
- Model: height = intercept + β₁×weight + β₂×age + error
- Still assuming normal distribution for errors
- Show how OLS finds the best-fitting plane (not line)
- Interpret coefficients: "holding other variables constant"
- Compare:
  - Simple regression: height ~ weight (slope = ?)
  - Multiple regression: height ~ weight + age (slope for weight = ?)
  - Show how coefficients can change when you add/remove predictors
- **Key insight**: Multiple regression estimates the effect of each predictor while "controlling for" others; still estimating conditional means from normal distributions

**Dataset**: Heights + multiple predictors
**Length estimate**: ~300 lines

---

### Part 12: Model Selection and Comparison

**Goal**: How to choose which predictors to include

**Content**:

- Continue with heights data, consider multiple potential predictors
- The problem: which predictors should we include?
- Approaches to model comparison:
  1. Adjusted R² (penalizes complexity)
  2. AIC/BIC (information criteria)
  3. Cross-validation (holdout performance)
- Demonstrate each approach
- Show the bias-variance tradeoff:
  - Too simple: underfitting (high bias)
  - Too complex: overfitting (high variance)
- **Key insight**: More predictors ≠ better model; need to balance fit and complexity

**Dataset**: Heights + multiple predictors
**Length estimate**: ~350 lines

---

### Part 13: Diagnostics and Model Checking

**Goal**: How to assess whether your distributional choice and model structure are appropriate

**Content**:

- Use real or simulated data that violates different modeling choices:
  1. Non-normal residuals (skewed)
  2. Non-constant variance (heteroscedasticity)
  3. Non-linear relationship
- For each, show:
  - What the violation looks like in diagnostic plots
  - Why it's a problem
  - How to detect it (residual plots, Q-Q plots)
  - How to fix it (transformations, different model)
- Introduce diagnostic plots systematically:
  - Residuals vs fitted (detect non-linearity, heteroscedasticity)
  - Q-Q plot (assess normality)
  - Residuals vs leverage (detect influential points)
- **Key insight**: Distributional choices and model structure are checkable; diagnostics help you detect when you've chosen the wrong model

**Dataset**: Data with different violations
**Length estimate**: ~350 lines

---

### Supplementary: Under the Hood — How lm() Calculates Parameters

**Goal**: For curious readers, explain the mechanics of how parameter estimates are actually computed

**Framing**: "You don't need this to use regression, but if you want to understand what the computer is doing..."

**Content**:

- Three error definitions and what they estimate:
  1. Binary (correct/incorrect) → mode
  2. Sum of absolute residuals → median
  3. Sum of squared residuals → mean
- For each, visualize residuals and calculate error for range of μ values
- Why squared residuals pair well with the normal distribution:
  - Minimizing squared residuals = maximum likelihood estimation for normal data
  - The mean is the most efficient estimator (simulation comparing mean vs median)
  - Gauss-Markov theorem (mentioned, not proven)
- OLS as the name for minimizing squared residuals
- **Key insight**: The distribution choice drives the estimation method, not the other way around. For a normal distribution, the sample mean is the maximum likelihood estimate, and OLS is the method that finds it.

**Dataset**: !Kung San heights + efficiency simulation
**Length estimate**: ~400 lines

---

### Supplementary: Beyond Normal — Other Distribution Families

**Goal**: Brief introduction to generalized linear models

**Content**:

- Recap: we've focused on normal distributions because that's what OLS uses
- But what if your outcome is:
  - Binary (yes/no) → logistic regression (binomial family)
  - Count (0, 1, 2, ...) → Poisson regression
  - Continuous and positive → gamma regression
- Show one example in detail (e.g., binary outcome):
  - Generate binary test pass/fail based on study hours
  - Show why linear regression with normal distribution fails (predicts outside 0-1)
  - Introduce logistic regression as the appropriate distributional choice
  - Interpret coefficients on log-odds scale
- **Key insight**: The distribution family should match your outcome type; normal/OLS is just one option among many

**Dataset**: Binary or count outcome example
**Length estimate**: ~300 lines

---

### Supplementary: The Forgotten Parameter — Uncertainty in σ

**Goal**: Explore why σ's uncertainty is typically ignored, why it matters, and how different frameworks handle it

**Content**:

- **σ has a sampling distribution too**:
  - Simulation: draw many samples, calculate SD each time
  - Show that σ's sampling distribution is skewed (not normal), unlike the mean's
  - It follows a chi-related distribution — bounded below by zero, with a right tail
  - SE of σ ≈ σ / √(2n), so it shrinks with sample size, but more slowly than SE of the mean
- **Why isn't this commonly reported?**:
  - Convention: researchers focus on μ because it answers questions about typical values and predictor effects
  - The lm() output reports SE for coefficients but not for the residual standard error
  - This creates a blind spot, especially for prediction (where σ directly determines prediction interval width)
- **The t-distribution as the frequentist solution**:
  - When we estimate μ, we don't know the true σ — we use the sample SD instead
  - The t-distribution accounts for this: it's wider than the normal, with heavier tails
  - With large n, the t-distribution converges to the normal (because σ's uncertainty shrinks)
  - Mathematically, the t-distribution is the exact, complete solution for confidence and prediction intervals
  - But it handles σ's uncertainty implicitly — you never see σ's sampling distribution or its confidence interval
  - This makes it conceptually opaque: the uncertainty is baked in without being visible
- **Bayesian approaches make σ explicit**:
  - In a Bayesian framework, both μ and σ get posterior distributions
  - You can directly visualize and summarize uncertainty about σ
  - Prediction naturally incorporates uncertainty in both parameters
  - This is more transparent, even if the conclusions are similar
- **When does σ's uncertainty matter most?**:
  - Small samples: the t-distribution is noticeably wider than the normal
  - Prediction: prediction intervals depend directly on σ, so underestimating σ's uncertainty means overconfident predictions
  - Comparing groups: if you're comparing variability across groups, σ's uncertainty is the research question
- **Key insight**: σ is a full parameter of the model with its own uncertainty. The frequentist framework handles this implicitly through the t-distribution. Bayesian approaches make it explicit. Both get the math right, but they differ in transparency.

**Dataset**: !Kung San heights + simulations
**Length estimate**: ~300 lines

---

### Supplementary: Bootstrapping — Uncertainty Without Distributions

**Goal**: Show how bootstrapping provides an alternative route to uncertainty and testing that doesn't require committing to a specific distribution

**Content**:

- **Recap**: Throughout the series, we've built uncertainty from a distributional model. We proposed a normal distribution, estimated its parameters, and derived SEs, t-values, and p-values from that model. But what if we don't want to commit to a specific distribution?
- **The core idea**: Instead of simulating from a proposed distribution (as we did in Parts 4-7), resample from the actual data with replacement
  - Draw a bootstrap sample (same size as original, with replacement)
  - Calculate the statistic of interest (e.g., the mean)
  - Repeat many times to build up a distribution of the statistic
- **Bootstrap sampling distribution**: Simulation with the heights data
  - Draw 1000 bootstrap samples, calculate the mean each time
  - Histogram of bootstrap means
  - Compare to the parametric sampling distribution from Part 4 — they look very similar
- **Bootstrap SEs and confidence intervals**:
  - The SD of the bootstrap means is the bootstrap SE
  - Compare to the formula-based SE (σ / √n) — nearly identical for our data
  - Bootstrap confidence intervals (percentile method): just take the 2.5th and 97.5th percentiles
- **Bootstrap testing**:
  - Can also construct a null distribution by centering the bootstrap
  - Compare to the t-distribution approach from Parts 6-7
- **When does bootstrapping shine?**:
  - When you're not sure the normal distribution is right
  - For statistics where the sampling distribution is hard to derive analytically (e.g., medians, ratios, correlations)
  - When data is skewed or has outliers
- **When does the parametric approach win?**:
  - When the distributional choice is well-justified, parametric methods are more efficient (tighter intervals with same data)
  - Parametric models give you a complete generative model (you can simulate new data, not just resample existing data)
  - With very small samples, bootstrapping can be unreliable because resampling from a small dataset doesn't capture the full population variability
- **They're not as different as they seem**:
  - Both are trying to estimate the same thing: the sampling distribution of a statistic
  - Parametric: derives it from a distributional model
  - Bootstrap: approximates it by resampling from the data
  - With large samples and well-behaved data, they converge to the same answer
- **Key insight**: Bootstrapping trades distributional commitments for computational effort. It's a powerful alternative when you're uncertain about the distribution, but the parametric approach gives you more when the distributional choice is justified.

**Dataset**: !Kung San heights + bootstrap simulations
**Length estimate**: ~300 lines

---

### Supplementary: Frequentist and Bayesian — More Alike Than You Think

**Goal**: Show that the frequentist approach already involves subjective modeling decisions, and that Bayesian statistics extends (rather than replaces) this framework

**Content**:

- Recap the series' core move: choosing a distribution is a subjective, knowledge-informed decision
  - We chose the normal distribution for heights based on what we know about heights (symmetric, continuous, clustered)
  - This isn't "letting the data speak" — it's bringing prior knowledge to the modeling process
  - Every `lm()` call embeds a subjective choice (normal errors)
- The frequentist/Bayesian divide is narrower than often presented:
  - **Both approaches** choose a distributional form (the likelihood) based on domain knowledge
  - **Frequentist**: Estimates parameters from data alone
  - **Bayesian**: Adds explicit prior distributions on the parameters, then combines with data to get posteriors
  - The distributional choice (likelihood) is shared — it's not unique to either tradition
- The distributional choice is technically the *likelihood*, not a prior in the Bayesian sense
  - But in the colloquial sense, it IS prior reasoning — you're making a decision before looking at the data
  - Bayesian statistics just extends this subjectivity explicitly to the parameters
- Implications:
  - The frequentist approach isn't as purely "objective" as sometimes presented
  - The Bayesian approach isn't as purely "subjective" as sometimes criticized — frequentists make subjective choices too, they just don't call them that
  - Both are making modeling decisions informed by knowledge
- Practical comparison: fit the same heights model using both approaches
  - Show that with weak/uninformative priors, Bayesian results ≈ frequentist results
  - Show how informative priors shift the estimates
  - This reinforces that the distributional choice matters in both traditions
- **Key insight**: Choosing a distribution is a subjective modeling decision that both frequentist and Bayesian approaches share. Bayesian statistics makes additional subjective decisions explicit (priors on parameters), but the core act of modeling — proposing a distribution for the data — is common to both.

**Dataset**: !Kung San heights (same data, frequentist vs Bayesian comparison)
**Length estimate**: ~300 lines
