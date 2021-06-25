
# Todo --------------------------------------------------------------------

# - Add BibTex citations to each publication as a button.
# - Make setting the language a parameter for each post

# Maybes ------------------------------------------------------------------

# - Color the domain part of the logo
# - Make it so that you can use the yaml to add words to highlight js

# Setup -------------------------------------------------------------------

# Update the .Rprofile file with the necessary settings:
# - Set blogdown.method = 'markdown' to support TOCs using Hugo

# Check -------------------------------------------------------------------

blogdown::check_site()

# Build -------------------------------------------------------------------

# Serve the website
blogdown::serve_site()

# Re-render website
blogdown::build_site(build_rmd = 'timestamp')

# Create production website
blogdown::build_site()

# Hugo --------------------------------------------------------------------

# Install hugo with extended = TRUE to support SCSS files
blogdown::install_hugo(extended = TRUE)

# CV ----------------------------------------------------------------------

# Download CV data
library(googlesheets4)
gs4_deauth()
cv <- read_sheet("1damDaFVsrPzCpR0N3b2JNUfA5Z-a08oCWoLKWQ_FsSk",
  col_types = "ccccc")
readr::write_csv(cv, "static/data/cv.csv")
