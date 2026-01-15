#!/usr/bin/env bash

# List of atoms assigned to Lane C
atoms=(
  accordion_item
  carousel
  divider
  heading_block
  hero_image
  icon_divider
  icon_grid
  image_media_block
  multi_feed_grids
  multi_feed_tile
  quote_block
  rich_text_block
  section_blog_posts
  section_collection_list
  section_custom_markup
  section_email_signup
  section_featured_collection_grid
  section_hero_banner
  section_image_with_text
  section_media_collage
  section_multicolumn_features
  section_rich_text
  section_slideshow
  video_media_block
)

# Dimensions to implement (excluding accessibility which is already done)
dimensions=(behaviour colours data_schema exposed_tokens icons layout tracking typography views)

for atom in "${atoms[@]}"; do
  for dim in "${dimensions[@]}"; do
    dir="aitom_family/${atom}/${dim}"
    mkdir -p "$dir"
    cat > "${dir}/placeholder.md" <<EOF
# Placeholder for ${atom} ${dim}

This file is a placeholder for the ${dim} dimension of the ${atom} atom.
Add implementation details as required.
EOF
  done
done

echo "Placeholder files generated for all dimensions."
