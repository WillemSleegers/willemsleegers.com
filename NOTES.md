# Notes: Understanding Regression series

## Philosophy

- **No long-run frequency framing.** Do not justify probability claims by invoking repeated sampling ("if we ran this study many times..."). Probability is framed in terms of distributions and where values fall within them, consistent with how we treated estimation throughout the series.

- **No "true" values.** Avoid language like "the true mean" or "the true parameter." We are working with models and estimates, not asserting the existence of a ground truth.

## Conceptual foundation for Part 7 (unresolved, to be worked out)

The logic of the p-value needs to be grounded in two competing distributions of means:

- Our model: the mean follows a distribution centered at our estimate, with spread SE
- The null model: the mean follows a distribution centered at 0 (or the reference value), with the same spread SE

Since SE is estimated (not known), these are t-distributions, not normal distributions. The p-value is where our observed mean falls in the null distribution.

Key points agreed on:
- We are talking about distributions of means, not of individual data points — SE is the right spread, not SD
- Dividing by SE is not a "standardization" step for its own sake; it falls naturally from asking where our mean sits on the null distribution's scale
- The null distribution is the t-distribution — it is not separately derived, it is the same t-distribution from Part 6 applied to the null model
- No long-run frequency framing; no "true values"

Still unclear: how to explain the relationship between the normal distribution of the mean (Part 4) and the t-distribution used in inference, without confusing readers.
