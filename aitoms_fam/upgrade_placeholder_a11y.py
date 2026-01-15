
import os

root = "/Users/jaynowman/dev/aitoms_fam/aitom_family"

# Heuristics for upgrading
interactive_atoms = [
    "accordion_item", "bottom_chat_input_bar", "carousel", "chat_card_v1",
    "chat_icon_band_popover", "chat_message_action_bar", "chat_rail_header_bar",
    "chat_safety_controls_bar", "chat_shortcuts_popover", "chat_upload_source_picker",
    "cta_button", "floating_pill_toolbar", "main_menu_icon_button",
    "section_email_signup", "theme_colour_schemes", "theme_layout_settings", # these are settings forms?
    "theme_typography_settings", "video_media_block", "section_slideshow"
]

content_atoms = [
    "chat_message_block", "chat_message_list", "heading_block",
    "hero_image", "image_media_block", "quote_block", "rich_text_block",
    "section_blog_posts", "section_collection_list", "section_custom_markup",
    "section_featured_collection_grid", "section_hero_banner", "section_image_with_text",
    "section_media_collage", "section_multicolumn_features", "section_rich_text",
    "multi_feed_grids", "multi_feed_tile"
]

layout_atoms = [
    "chat_rail_shell", "divider", "dropdown_header", "icon_divider", "icon_grid", 
    "lanes_calendar_grid_v1", "wireframe_canvas", "theme_card_surface"
]

def write_if_placeholder(path, content):
    # Only write if file doesn't exist OR if it matches "Not applicable for placeholder"
    should_write = False
    if not os.path.exists(path):
        should_write = True
    else:
        with open(path, 'r') as f:
            if "Not applicable for placeholder" in f.read():
                should_write = True
                
    if should_write:
        dir_name = os.path.dirname(path)
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
        with open(path, 'w') as f:
            f.write(content)
        # Remove NA.md if replacing with something else (handle separately?)
        # My script checks specific path. If I write a11y.md, I should remove NA.md
        return True
    return False

def clean_na(path):
    na_path = os.path.join(path, "NA.md")
    if os.path.exists(na_path):
        os.remove(na_path)

for atom in os.listdir(root):
    path = os.path.join(root, atom)
    if not os.path.isdir(path) or atom.startswith("haze_") or atom.startswith("_"):
        continue

    # 1. Accessibility
    if atom in interactive_atoms:
        updated = write_if_placeholder(os.path.join(path, "accessibility/a11y.md"), 
"""# Accessibility Spec

## Roles & States
- **Role**: `button`, `link`, or specific widget role.
- **States**: `aria-expanded`, `aria-pressed`, `aria-disabled`.
- **Focus**: Must be focusable via Keyboard (Tab).
- **Label**: Ensure `aria-label` or visible label is present.

## Keyboard
- `Enter` / `Space`: Activate.
- `Tab`: Navigate in/out.
""")
        if updated: clean_na(os.path.join(path, "accessibility"))

    elif atom in content_atoms:
        updated = write_if_placeholder(os.path.join(path, "accessibility/a11y.md"),
"""# Accessibility Spec

## Content Structure
- **Headings**: Use appropriate hierarchy (h1-h6).
- **Images**: Must have `alt` text or be hidden if decorative.
- **Reading Order**: Logical DOM order matches visual order.
""")
        if updated: clean_na(os.path.join(path, "accessibility"))

    elif atom in layout_atoms:
        # Keep or refine NA?
        # Divider might need separator role
        if atom == "divider" or atom == "icon_divider":
             updated = write_if_placeholder(os.path.join(path, "accessibility/a11y.md"), "# A11y\n- Role: `separator`\n")
             if updated: clean_na(os.path.join(path, "accessibility"))
        else:
             # Just ensure NA.md has justification
             write_if_placeholder(os.path.join(path, "accessibility/NA.md"), "Not applicable: purely presentational layout or wireframe container.")

    
    # 2. Tracking
    if atom in interactive_atoms:
        updated = write_if_placeholder(os.path.join(path, "tracking/events.md"),
"""# Tracking Spec

## Events
- `click`: Triggered on user interaction.
- `hover`: Optional engagement tracking.
- `impression`: When component enters viewport.
""")
        if updated: clean_na(os.path.join(path, "tracking"))

    else:
        # Content/Layout -> Impression only?
        updated = write_if_placeholder(os.path.join(path, "tracking/events.md"),
"""# Tracking Spec

## Events
- `impression`: Log when this content block is viewed.
""")
        if updated: clean_na(os.path.join(path, "tracking"))

print("Upgrade complete.")
