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

**Tone and Style Guidelines**:

- **Personal and conversational**: Use "I" statements, be honest about learning journey
- **Direct but not negative**: Don't criticize researchers or be condescending about common practices
- **Simple intro**: Start with straightforward statement like "This is the first blog post on..."
- **Avoid marketing language**: No superlatives, no overselling
- **Don't assume readers are doing it wrong**: Don't assume people "just summarize data" or misuse tools
- **Neutral about different goals**: Estimation and prediction are both valid, don't favor one

## Proposed Series Structure

### Part 1: The Modeling Question (IN PROGRESS)

**Goal**: Reframe statistical modeling as understanding distributions, not summarizing data

**Content** (ACTUAL):

- **Introduction**: Simple and personal
  - "This is the first blog post on a series of blog posts about understanding regression."
  - Personal confession: "I'm a behavioral scientist, and to be honest, I don't really feel like I understand regression"
  - Problem: regression taught as black box, focus on mechanics not concepts
  - Goal: build conceptual understanding
  - Avoids assuming reader is behavioral scientist, but clarifies author's perspective
- **Example with real data**: !Kung San heights (adults 18+) from McElreath's Statistical Rethinking
  - Explains why using examples: "To build this conceptual understanding, I'll work through examples using real data"
  - Run familiar `lm(height ~ 1)` model (explains what intercept-only model is first)
  - Pause to ask: What do these numbers mean? What perspective is useful?
- **The core question**: "What distribution might have generated this data?"
  - Explains distributions as pragmatic tools, not biological claims
  - "Given what we know about heights... the normal distribution is a reasonable, parsimonious choice"
  - Bridge to concrete applications: estimation, uncertainty, prediction, model checking
- **Roadmap**: 5 steps listed
  1. Choose a distribution (parsimonious choice given what we know)
  2. Estimate parameters
  3. Quantify uncertainty
  4. Check the model
  5. Add predictors (not "extend to regression" - intercept-only IS regression)
- **Preview**: Histogram with normal distribution overlay
  - Connection: `lm()` estimates μ (intercept) and σ (residual SE)
  - Key: we're proposing a distribution and estimating its parameters
- **Summary**: Distribution perspective provides unified framework
  - Brief mention of hypothesis testing

**Dataset**: !Kung San heights from Howell1.csv (n=352 adults)
**Status**: File at `/Users/willem/GitHub/willemsleegers.com/content/posts/1-understanding-regression-part-1/1-understanding-regression-part-1.qmd` - still being edited

---

### Part 2: Why the Normal Distribution? (IN PROGRESS)

**Goal**: Introduce the normal distribution as a pragmatic, parsimonious choice for modeling heights

**Content** (ACTUAL):

- **Recap**: Core question from Part 1 (what distribution might have generated this data?), question: why normal?
- **The ubiquity of the normal distribution**: General, data-independent section
  - Normal shows up everywhere: heights, blood pressure, measurement errors, test scores
  - Many small independent factors adding up → bell-shaped
  - First argument: it's a sensible default for continuous data
  - But "it shows up a lot" isn't fully satisfying — can we do better?
- **What do we actually know?**: Set up the constraints (general, not heights-specific)
  - We know two things: there's a mean (μ) and a standard deviation (σ)
  - We don't have theoretical reasons to claim a specific shape, multiple groups, or tail behavior
  - Question: given just a mean and SD, what distribution should we choose?
- **Many distributions, same facts**: KEY VISUALIZATION
  - Show four distributions (normal, skewed/gamma, bimodal/mixture, uniform) all with mean = 155 and SD = 8
  - Each non-normal distribution is making additional claims beyond mean/SD (asymmetry, two groups, hard boundaries)
  - The normal distribution adds nothing extra
- **The most parsimonious choice**: Parsimony argument (the bulk of the post)
  - The normal adds the least structure beyond mean and variance
  - Maximum entropy argument relegated to footnote
  - Walk through each alternative: skewed (claims asymmetry), bimodal (claims two groups)
  - The normal says: "I know the mean and the spread. I'm not going to pretend I know anything else."
  - Parsimony = not just simplicity, but adding nothing beyond what we know
  - Personal note: "I find this a genuinely compelling reason"
- **Applying this to our heights**: NOW bring in the data (load + overlay)
  - Overlay normal distribution on histogram
  - Honest assessment: not perfect, but captures the general pattern
  - If it clearly didn't fit, we'd reconsider — formal model checking comes later
- **Summary**: Two reasons (ubiquity + parsimony), defined by two parameters, bridge to Part 3 (how to estimate μ and σ)

**Dataset**: !Kung San heights from Howell1.csv
**Status**: File at `/Users/willem/GitHub/willemsleegers.com/content/posts/2-understanding-regression-part-2/2-understanding-regression-part-2.qmd` - still being edited
**Length**: ~167 lines

---

### Part 3: Estimating Distribution Parameters (COMPLETED)

**Goal**: Show that lm() estimates the normal distribution's parameters μ and σ

**Content** (ACTUAL):

- **Recap**: Normal distribution is parsimonious choice, now need to estimate parameters
- **The normal distribution's parameters**: μ (mean) and σ (standard deviation)
- **Natural estimators**: Sample mean and sample SD
- **What lm() is doing**:
  - Calculate sample mean and SD
  - Run lm(height ~ 1) and show output
  - Compare: intercept = sample mean, residual SE = sample SD
  - "lm() is estimating the parameters of a normal distribution"
- **Visualizing the estimated distribution**: Histogram with normal distribution overlay using estimated parameters
- **What we've accomplished**: We proposed normal distribution and estimated μ and σ
- **Questions this raises**: Preview future posts
  1. How certain are we about these estimates?
  2. What can we do with this model?
  3. Does the model actually fit?
- **Key insight**: When you run lm(), you're estimating distribution parameters (intercept = μ, residual SE = σ)

**Dataset**: !Kung San heights from Howell1.csv
**Status**: File at `/Users/willem/GitHub/willemsleegers.com/content/posts/3-understanding-regression-part-3/3-understanding-regression-part-3.qmd` - completed, ~130 lines
**Length**: ~130 lines (significantly shorter than planned)

---

### Part 4: Uncertainty and the Standard Error (COMPLETED)

**Goal**: Understanding parameter uncertainty through the sampling distribution

**Content** (ACTUAL):

- **Recap**: In Part 3 we estimated μ and σ. But these are based on one sample of 352 people. How much would they vary with a different sample?
- **One sample, many possibilities**: Simulation — draw 1000 samples from N(μ, σ), calculate the mean of each
  - Histogram of sample means, clustered around the true mean
  - Name it: the **sampling distribution**
  - Explain why it's normal: same principle from Part 2 (adding independent things → normal). The sample mean is a sum of independent observations divided by n. CLT in footnote.
- **What affects uncertainty?**: Two factors
  - Sample size: sampling distributions at n = 10, 50, 352 (faceted plot)
  - Data variability: sampling distributions at σ = 4, 8, 16 (faceted plot)
- **The standard error**:
  - Measure SE from simulations (SD of sample means at each n)
  - Plot simulated SEs against σ/√n formula — they match
  - SE is the SD of the sampling distribution
  - Because the sampling distribution is normal, SE fully characterizes it (along with the mean μ)
  - √n derivation in footnote (variance addition → σ²/n → take square root)
  - Diminishing returns: doubling n only reduces SE by factor √2
  - For our data: SE ≈ 0.41 cm, tiny relative to σ (7.7 cm)
- **Back to lm()**: The "Std. Error" column is exactly this
- **What about σ?**: σ also has uncertainty, but standard practice doesn't report it. Partly convention, partly because μ is usually the research question. But σ matters for prediction.
- **Summary**: Sampling distribution describes estimate variability, SE measures its spread, lm() reports it

**Dataset**: !Kung San heights + simulations
**Status**: Completed, ~245 lines
**Note**: Part 4 now bridges to Part 5 (σ's uncertainty).

---

### Part 5: What About σ?

**Goal**: Show that σ is also uncertain, setting up the t-distribution in Part 6

**Content**:

- **Recap**: In Part 4 we quantified μ's uncertainty with the SE = σ / √n. But the formula uses σ, which we also estimated.
- **σ varies from sample to sample**: Simulation — draw 1000 samples, calculate SD of each
  - Histogram of sample SDs, clustered around the true SD
  - Parallel to Part 4's simulation for the mean
- **Different sample sizes**: Sampling distributions of σ at n = 10, 50, 352
  - At n = 10, σ's estimate is very imprecise
  - At n = 352, fairly precise
- **A different shape**: σ's sampling distribution is skewed (right tail), unlike μ's symmetric normal
  - SD can't go below zero but can be arbitrarily large
  - Skew is most visible at small n, fades with large n
- **Why this matters**: The SE uses σ. Since we estimate σ, the SE itself is uncertain.
  - If σ's estimate is too low → SE is too low → we underestimate uncertainty about μ
  - If σ's estimate is too high → SE is too high → we overestimate uncertainty about μ
  - The "ruler" for measuring uncertainty is itself imprecise
- **Back to lm()**: The residual standard error has no "Std. Error" next to it — lm() doesn't report σ's uncertainty
- **Summary**: Bridge to Part 6 — dividing the estimate by the SE will produce a ratio whose distribution is affected by σ's uncertainty

**Dataset**: !Kung San heights + simulations
**Length estimate**: ~150 lines

---

### Part 6: The t-Value and the t-Distribution

**Goal**: Explain what the t-value in the lm() output means and why the t-distribution exists

**Content**:

- **Recap**: Parts 4 and 5 — we have an estimate with SE, but the SE is uncertain because σ is estimated. The next column in the lm() output is the t value.
- **What question is the t-value answering?**: Is the estimate compatible with some reference value (by default, zero)?
  - For heights, testing against zero is silly, but the same machinery tests whether predictor effects are zero
- **Measuring distance in the right units**: t = (Estimate - 0) / SE
  - Explicitly show the subtraction of 0 in the formula
  - Walk through the intuition: if the true mean were 0, the SE tells us how much estimates bounce around. Getting 154.6 when estimates only move ~0.41 cm is an enormous discrepancy.
  - Signal-to-noise ratio framing
- **What t-values would we expect?**: Simulation under the null
  - Draw many samples from N(0, σ), compute t for each
  - Distribution clusters around 0, rarely beyond ±3
  - Our observed t-value (~377) is off the charts
- **Why the t-distribution?**: The distribution of t-values has heavier tails than the normal
  - Because the denominator uses the sample SD (which varies from sample to sample, as we saw in Part 5)
  - Simulation comparing known σ vs estimated σ at n = 10 — shows heavier tails
  - Connects directly to Part 5's observation about σ's uncertainty
- **Convergence**: The t-distribution converges to the standard normal as n grows
  - Convergence plot at n = 10, 30, 352, and standard normal
  - Degrees of freedom (df = n - 1) as the t-distribution's parameter
- **Back to lm()**: The t value column
- **Key insight**: The t-value standardizes the estimate relative to its uncertainty. The t-distribution (not the normal) is the right reference because we estimate σ rather than knowing it.

**Dataset**: !Kung San heights + simulations
**Length estimate**: ~250 lines

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
