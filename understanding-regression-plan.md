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
3. Given that distribution, what parameters define it?
4. What's the optimal way to estimate those parameters?
5. How well does the model fit?

**Pedagogical Approach**:

- **Heavily rely on simulations and visualizations** to build intuition (not formulas/equations)
- One focused concept per post (6+ granular posts)
- Primary dataset: !Kung San heights (real data, same as McElreath's book)
- Build from intercept-only → simple regression → multiple regression
- Mention theorems by name but don't prove them (keep current style)
- **Distributions first** - start with the distribution concept, not error functions
- **Distinguish from bootstrapping** - our framework is about modeling the data-generating distribution (parametric), not estimating sampling distributions of statistics (bootstrapping). Bootstrapping is a tool that can appear within the framework (Part 8) but doesn't replace it.
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
- **The most parsimonious choice**: Maximum entropy argument (the bulk of the post)
  - Maximum entropy distribution = fewest additional claims given constraints
  - For fixed mean and variance, the maximum entropy distribution is the normal
  - Entropy intuition: high entropy = noncommittal, low entropy = making specific claims
  - Walk through each alternative: skewed (claims asymmetry), bimodal (claims two groups), uniform (claims hard boundaries)
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
  1. Why use the mean specifically?
  2. Why is this optimal?
  3. How certain are we?
- **Key insight**: When you run lm(), you're estimating distribution parameters (intercept = μ, residual SE = σ)

**Dataset**: !Kung San heights from Howell1.csv
**Status**: File at `/Users/willem/GitHub/willemsleegers.com/content/posts/3-understanding-regression-part-3/3-understanding-regression-part-3.qmd` - completed, ~130 lines
**Length**: ~130 lines (significantly shorter than planned)

---

### Part 4: Error Functions and Estimation

**Goal**: Show how different error definitions lead to different parameter estimates

**Content**:

- We need to measure how well different values of μ fit our data
- Three error definitions:
  1. Binary (correct/incorrect) → leads to mode
  2. Sum of absolute residuals → leads to median
  3. Sum of squared residuals → leads to mean
- For each, visualize residuals and calculate error for range of μ values
- Show which value of μ minimizes error under each definition
- Explain why squared residuals is commonly used:
  - Punishes larger errors more heavily
  - Has nice mathematical properties (differentiable)
  - Connects to maximum likelihood under normal distribution
- **Key insight**: The error function you choose determines which parameter value you estimate; squared errors lead to the mean

**Dataset**: !Kung San heights
**Length estimate**: ~300 lines

---

### Part 5: Why OLS and Normal Pair Well

**Goal**: Explain why minimizing squared residuals is optimal for normal distributions

**Content**:

- We've seen that squared residuals lead to estimating the mean
- But why use squared residuals for normal data specifically?
- Demonstrate efficiency advantage (simulation-based):
  - Simulate drawing repeated samples (show sampling distribution)
  - Compare precision of mean vs median estimates for normal data
  - Show that mean uses all information, median uses only rank
  - Calculate relative efficiency (~57% more efficient)
- Connect to maximum likelihood: squared residuals = MLE for normal distribution
- Introduce OLS as the method that estimates μ by minimizing squared residuals
- Verify with `lm(height ~ 1)` - the intercept equals the mean
- Mention Gauss-Markov theorem (optimal among unbiased estimators)
- **Key insight**: For normally distributed data, OLS (minimizing squared residuals) is optimal because the mean is the natural location parameter and OLS estimates it most efficiently

**Dataset**: Heights + repeated sampling simulation
**Length estimate**: ~300 lines (includes efficiency simulation)

---

### Part 6: When the Distribution Choice Is Wrong

**Goal**: Show what happens when you choose the wrong distribution

**Content**:

- So far we've chosen the normal distribution for heights
- But what if that's not a good choice?
- Generate or use skewed data (income data, reaction times)
- Visualize the skewness
- Fit normal model anyway (OLS) - show mean, median, mode
- Show the problem: mean is pulled by tail, doesn't represent "typical" value
- Demonstrate this isn't an "outlier problem" - it's a distribution mismatch
- Two solutions:
  1. Transform the data (log-transform to make it closer to normal)
  2. Use a different distribution family (preview of GLMs)
- Show both approaches with data
- **Key insight**: Extreme values often signal wrong distributional choice, not bad data; fix the model, not the data

**Dataset**: Skewed data + transformations
**Length estimate**: ~300 lines

---

### Part 7: Using the Model for Prediction

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

### Part 8: Uncertainty and Inference

**Goal**: Understanding parameter uncertainty through the sampling distribution

**Content**:

- Return to heights data
- Population vs sample distinction
- We've estimated μ from our sample, but how certain are we?
- **Sampling distribution of the mean** (simulation-based):
  - Simulate drawing many samples of different sizes
  - Show how sampling distribution narrows with larger n
  - Visualize with density plots at n=10, 25, 50, 100
- **Sampling distribution of the standard deviation** (simulation-based):
  - Same simulation approach but for sample SD
  - Show that σ also has uncertainty
  - Visualize how it varies across samples
- **Compare the two**:
  - Both parameters have uncertainty
  - Standard practice: we report SE for μ but not for σ
  - This asymmetry is partly conventional (μ is usually the research question)
  - Bayesian approaches treat both symmetrically
- Variance decomposition for the mean:
  - Variance of the data (how spread out heights are: σ²)
  - Variance of the estimator (how uncertain our estimate is: σ²/n)
  - Relationship: SE = σ/√n
- Calculate confidence intervals
- Verify with `summary(lm(height ~ 1))`
- **Bootstrapping as an alternative approach to uncertainty**:
  - Introduce bootstrapping: resample from observed data to build empirical sampling distribution
  - Compare to the parametric approach used throughout the series
  - Key distinction: bootstrapping estimates the sampling distribution of a *statistic* (nonparametric); our framework models the *data-generating distribution* (parametric)
  - Bootstrapping sidesteps distributional assumptions — useful when you're unsure about the distribution choice
  - But: doesn't replace the modeling framework (no distributional choice, limited prediction, doesn't address conditional distributions in regression)
  - Position bootstrapping as a *tool within* the framework, not an alternative to it
- **Key insight**: Our estimates have uncertainty that decreases with sample size; we typically focus on uncertainty about μ, but σ also has uncertainty we often ignore. Bootstrapping offers a nonparametric alternative for quantifying uncertainty, but doesn't replace the need to model the data-generating distribution.

**Dataset**: Heights + repeated sampling simulations (all simulation-based, no equations)
**Length estimate**: ~400 lines (expanded to cover both parameters + bootstrapping comparison)

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

### Part 11: Multiple Predictors - The Basics

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

### Optional Part 14: Beyond Normal - Other Distribution Families

**Goal**: Brief introduction to generalized linear models (optional extension)

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

### Optional Part 15: Frequentist and Bayesian — More Alike Than You Think

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
