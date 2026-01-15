import os
import shutil

SOURCE_BASE = "/Users/jaynowman/dev/aitoms_fam/aitom_family"
TARGET_BASE = "/Users/jaynowman/dev/atoms_factory/atoms/aitom_family"

ATOMS_TO_MOVE = [
    "accordion_item",
    "app_header_appname_dropdown",
    "blackboard",
    "bottom_chat_input_bar",
    "carousel",
    "chat_card_v1",
    "chat_icon_band_popover",
    "chat_message_action_bar",
    "chat_message_block",
    "chat_message_list",
    "chat_rail_header_bar",
    "chat_rail_shell",
    "chat_safety_controls_bar",
    "chat_shortcuts_popover",
    "chat_upload_source_picker",
    "cta_button",
    "divider",
    "dropdown_header",
    "floating_pill_toolbar",
    "heading_block",
    "hero_image",
    "icon_divider",
    "icon_grid",
    "image_media_block",
    "lanes_calendar_grid_v1",
    "macro_temp_indicator",
    "main_menu_icon_button",
    "maybes_note",
    "multi_feed_grids",
    "multi_feed_tile",
    "quote_block",
    "rich_text_block",
    "section_blog_posts",
    "section_collection_list",
    "section_custom_markup",
    "section_email_signup",
    "section_featured_collection_grid",
    "section_hero_banner",
    "section_image_with_text",
    "section_media_collage",
    "section_multicolumn_features",
    "section_rich_text",
    "section_slideshow",
    "theme_card_surface",
    "theme_colour_schemes",
    "theme_layout_settings",
    "theme_typography_settings",
    "video_media_block",
    "wireframe_canvas",
]

def migrate():
    report = []
    skipped = []
    
    if not os.path.exists(TARGET_BASE):
        os.makedirs(TARGET_BASE)

    for atom_id in ATOMS_TO_MOVE:
        source_path = os.path.join(SOURCE_BASE, atom_id)
        target_path = os.path.join(TARGET_BASE, atom_id)

        if not os.path.isdir(source_path):
            print(f"SKIPPING: Source not found for {atom_id}")
            skipped.append(atom_id)
            continue

        try:
            # Copy
            if os.path.exists(target_path):
                shutil.rmtree(target_path) # clear if partial exists from prev run
            
            shutil.copytree(source_path, target_path)
            
            # Verify
            if os.path.isdir(target_path):
                # Delete Source
                shutil.rmtree(source_path)
                print(f"MOVED: {atom_id}")
                report.append(atom_id)
            else:
                 print(f"ERROR: Failed to verify copy for {atom_id}")
                 skipped.append(atom_id)

        except Exception as e:
            print(f"ERROR: processing {atom_id}: {e}")
            skipped.append(atom_id)

    # Write report
    with open("/Users/jaynowman/dev/atoms_factory/MOVE_REPORT.md", "w") as f:
        f.write("# Migration Report\n\n")
        f.write(f"Total Moved: {len(report)}\n")
        f.write(f"Total Skipped: {len(skipped)}\n\n")
        f.write("## Moved Atoms\n")
        for a in sorted(report):
            f.write(f"- {a}\n")
        
        f.write("\n## Skipped Atoms\n")
        if not skipped:
            f.write("None\n")
        else:
            for s in skipped:
                f.write(f"- {s}\n")
        
        f.write("\n## Shared Assets\n")
        if os.path.exists("/Users/jaynowman/dev/atoms_factory/fonts/RobotoFlex-VariableFont_GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght.ttf"):
             f.write("- Fonts copied: YES\n")
        else:
             f.write("- Fonts copied: NO\n")

if __name__ == "__main__":
    migrate()
