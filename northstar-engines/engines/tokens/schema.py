import re
from typing import Any, Dict, List, Optional, Union, Literal
from pydantic import BaseModel, Field

# Schema definition matching TOKENS_CONTRACT_v1.md

class TokenDef(BaseModel):
    path: str
    type: Literal["string", "number", "boolean", "object", "color"]
    description: Optional[str] = None
    enum: Optional[List[str]] = None
    min: Optional[float] = None
    max: Optional[float] = None
    format: Optional[str] = None # e.g. "color", "url"

# Define the authoritative list
TOKEN_DEFINITIONS: List[TokenDef] = [
    # A) Global + Page
    TokenDef(path="page.id", type="string"),
    TokenDef(path="page.name", type="string"),
    TokenDef(path="page.slug", type="string"),
    TokenDef(path="page.template_kind", type="string", enum=["landing", "product", "blog", "brand_story"]),
    
    # A2 SEO
    TokenDef(path="seo.title", type="string"),
    TokenDef(path="seo.description", type="string"),
    TokenDef(path="seo.canonical_url", type="string", format="url"),
    TokenDef(path="seo.robots", type="string"),
    TokenDef(path="seo.og.title", type="string"),
    TokenDef(path="seo.og.description", type="string"),
    TokenDef(path="seo.og.image_url", type="string", format="url"),
    TokenDef(path="seo.schema_jsonld", type="object"),

    # A3 Tracking
    TokenDef(path="tracking.ga4.measurement_id", type="string"),
    TokenDef(path="tracking.meta_pixel.pixel_id", type="string"),
    TokenDef(path="tracking.tiktok_pixel.pixel_id", type="string"),
    TokenDef(path="tracking.pinterest_pixel.tag_id", type="string"),

    # A4 UTM
    TokenDef(path="tracking.utm.default_source", type="string"),
    TokenDef(path="tracking.utm.default_medium", type="string"),
    TokenDef(path="tracking.utm.default_campaign", type="string"),
    TokenDef(path="tracking.utm.default_content", type="string"),
    TokenDef(path="tracking.utm.default_term", type="string"),

    # A5 Global Layout
    TokenDef(path="page.background.color", type="color"),
    TokenDef(path="page.background.image_url", type="string", format="url"),
    TokenDef(path="page.background.gradient", type="string"),
    TokenDef(path="page.max_width", type="string"),
    TokenDef(path="page.grid.columns", type="number"),
    TokenDef(path="page.grid.gutter_x", type="string"),
    TokenDef(path="page.grid.gutter_y", type="string"),

    # B) Universal - Layout
    TokenDef(path="layout.position.mode", type="string", enum=["flow", "absolute", "fixed", "sticky"]),
    TokenDef(path="layout.x", type="string"),
    TokenDef(path="layout.y", type="string"),
    TokenDef(path="layout.z_index", type="number"),
    
    TokenDef(path="layout.width", type="string"), 
    TokenDef(path="layout.height", type="string"),
    TokenDef(path="layout.min_width", type="string"),
    TokenDef(path="layout.max_width", type="string"),
    TokenDef(path="layout.min_height", type="string"),
    TokenDef(path="layout.max_height", type="string"),

    TokenDef(path="layout.margin.top", type="string"),
    TokenDef(path="layout.margin.right", type="string"),
    TokenDef(path="layout.margin.bottom", type="string"),
    TokenDef(path="layout.margin.left", type="string"),
    TokenDef(path="layout.padding.top", type="string"),
    TokenDef(path="layout.padding.right", type="string"),
    TokenDef(path="layout.padding.bottom", type="string"),
    TokenDef(path="layout.padding.left", type="string"),

    TokenDef(path="layout.display", type="string", enum=["block", "flex", "grid", "none"]),
    TokenDef(path="layout.flex_direction", type="string"),
    TokenDef(path="layout.wrap", type="string"),
    TokenDef(path="layout.grid_template_columns", type="string"),
    TokenDef(path="layout.justify_content", type="string"),
    TokenDef(path="layout.align_items", type="string"),
    TokenDef(path="layout.overflow_x", type="string"),
    TokenDef(path="layout.overflow_y", type="string"),
    TokenDef(path="layout.gap", type="string"),

    TokenDef(path="responsive.mobile.*", type="object"), # Simplified wildcard
    TokenDef(path="responsive.tablet.*", type="object"),
    TokenDef(path="responsive.desktop.*", type="object"),

    # C) Universal Style
    TokenDef(path="style.background.color", type="color"),
    TokenDef(path="style.background.opacity", type="number", min=0.0, max=1.0),
    TokenDef(path="style.background.image_url", type="string", format="url"),
    TokenDef(path="style.border.width", type="string"),
    TokenDef(path="style.border.color", type="color"),
    TokenDef(path="style.border.style", type="string"),
    TokenDef(path="style.border.radius", type="string"),
    TokenDef(path="style.shadow.kind", type="string", enum=["none", "sm", "md", "lg", "custom"]),
    TokenDef(path="style.shadow.value", type="string"),
    
    TokenDef(path="style.opacity", type="number", min=0.0, max=1.0),
    TokenDef(path="style.visibility", type="string", enum=["visible", "hidden"]),
    TokenDef(path="style.overflow", type="string", enum=["visible", "hidden", "clip", "scroll"]),
    TokenDef(path="style.blur", type="string"),
    
    TokenDef(path="style.overlay.color", type="color"),
    TokenDef(path="style.overlay.opacity", type="number", min=0.0, max=1.0),
    TokenDef(path="style.text_gradient", type="string"),

    # D) Typography
    TokenDef(path="text.font.family", type="string"),
    TokenDef(path="text.font.variable_axes.weight", type="number"),
    TokenDef(path="text.font.variable_axes.slant", type="number"),
    TokenDef(path="text.font.size", type="string"),
    TokenDef(path="text.font.line_height", type="string"),
    TokenDef(path="text.letter_spacing", type="string"),
    TokenDef(path="text.case", type="string", enum=["none", "upper", "lower", "title"]),
    TokenDef(path="text.decoration", type="string", enum=["none", "underline", "strike"]),
    TokenDef(path="text.align", type="string", enum=["left", "center", "right", "justify"]),
    
    TokenDef(path="text.color", type="color"),
    TokenDef(path="text.outline.width", type="string"),
    TokenDef(path="text.outline.color", type="color"),
    TokenDef(path="text.fill.color", type="color"),
    
    TokenDef(path="content.text", type="string"),

    TokenDef(path="typography.base.*", type="object"),
    TokenDef(path="typography.title.*", type="object"),
    TokenDef(path="typography.subtitle.*", type="object"),
    TokenDef(path="typography.body.*", type="object"),
    TokenDef(path="typography.price.*", type="object"),
    TokenDef(path="typography.badge.*", type="object"),
    TokenDef(path="typography.quote.*", type="object"),
    TokenDef(path="typography.author.*", type="object"),
    TokenDef(path="typography.mobile.*", type="object"),

    # E) Media
    TokenDef(path="media.type", type="string", enum=["image", "video"]),
    TokenDef(path="media.src", type="string", format="url"),
    TokenDef(path="media.poster_src", type="string", format="url"),
    TokenDef(path="media.autoplay", type="boolean"),
    TokenDef(path="media.loop", type="boolean"),
    TokenDef(path="media.controls", type="boolean"),
    
    TokenDef(path="media.fit", type="string", enum=["cover", "contain", "fill"]),
    TokenDef(path="media.focal_point.x", type="number"),
    TokenDef(path="media.focal_point.y", type="number"),
    TokenDef(path="media.aspect_ratio", type="string"),

    TokenDef(path="media.alt_text", type="string"),
    TokenDef(path="media.filename", type="string"),

    TokenDef(path="media.filter.brightness", type="number"),
    TokenDef(path="media.filter.contrast", type="number"),
    TokenDef(path="media.filter.saturation", type="number"),
    TokenDef(path="media.filter.blur", type="number"),
    TokenDef(path="media.filter.hue_rotate", type="number"),
    TokenDef(path="media.filter.grayscale", type="number"),

    # F) Tracking
    TokenDef(path="tracking.analytics_event_name", type="string"),
    TokenDef(path="tracking.click_event", type="string"),
    TokenDef(path="tracking.impression_event", type="string"),
    TokenDef(path="tracking.conversion_goal_id", type="string"),
    TokenDef(path="tracking.experiment_id", type="string"),

    # G) Data Binding
    TokenDef(path="data_binding.source", type="string"),
    TokenDef(path="data_binding.expr", type="string"),
    TokenDef(path="data_binding.fallback", type="string"),
    TokenDef(path="data_binding.merge_tags", type="object"),

    # H) Accessibility
    TokenDef(path="a11y.label", type="string"),
    TokenDef(path="a11y.aria_role", type="string"),
    TokenDef(path="a11y.level", type="number"),
    TokenDef(path="a11y.tab_index", type="number"),
    TokenDef(path="a11y.keyboard_nav", type="boolean"),

    # I) Components
    # Multi-21
    TokenDef(path="feed.mode", type="string", enum=["feed", "manual"]),
    TokenDef(path="feed.source.kind", type="string"), # enum list is large, kept open for now
    TokenDef(path="feed.source.feed_id", type="string"),
    TokenDef(path="feed.query.limit", type="number"),
    TokenDef(path="feed.query.sort", type="string", enum=["newest", "featured", "manual"]),
    
    TokenDef(path="grid.cols_mobile", type="number"),
    TokenDef(path="grid.cols_tablet", type="number"),
    TokenDef(path="grid.cols_desktop", type="number"),
    TokenDef(path="grid.gap_x", type="string"),
    TokenDef(path="grid.gap_y", type="string"),
    TokenDef(path="grid.tile_radius", type="string"),
    TokenDef(path="grid.aspect_ratio", type="string", enum=["1:1", "4:3", "16:9", "9:16"]),
    
    TokenDef(path="tile.variant", type="string", enum=["generic", "product", "kpi", "text", "video"]),
    TokenDef(path="tile.show_title", type="boolean"),
    TokenDef(path="tile.show_meta", type="boolean"),
    TokenDef(path="tile.show_badge", type="boolean"),
    TokenDef(path="tile.show_cta_label", type="boolean"),
    TokenDef(path="tile.show_cta_arrow", type="boolean"),
    TokenDef(path="tile.primary_href", type="string"),
    TokenDef(path="tile.secondary_href", type="string"),
    TokenDef(path="tile.secondary_label", type="string"),
    TokenDef(path="tile.utm.source", type="string"),
    TokenDef(path="tile.utm.medium", type="string"),
    TokenDef(path="tile.utm.campaign", type="string"),
    
    # Manual Items
    TokenDef(path="manual.items", type="object"), # Array

    # Button
    TokenDef(path="button.label", type="string"),
    TokenDef(path="button.href", type="string"),
    TokenDef(path="button.variant", type="string", enum=["primary", "secondary", "ghost"]),
    TokenDef(path="button.icon", type="string"),
    TokenDef(path="button.utm.source", type="string"),
    
    # J) Graph
    TokenDef(path="content.agent_name.*", type="string"),
    TokenDef(path="content.framework_name.*", type="string"),
    TokenDef(path="content.connector_name.*", type="string"),
    TokenDef(path="content.connector_version.*", type="string"),
]

def get_token_def(path: str) -> Optional[TokenDef]:
    # Optimization: Trie or Hash Map would be better, but list is okay for N < 1000
    for msg in TOKEN_DEFINITIONS:
        if msg.path == path:
            return msg
        # Handle wildcards
        if "*" in msg.path:
             regex = "^" + re.escape(msg.path).replace(r"\*", ".*") + "$"
             if re.match(regex, path):
                 return msg
    return None

def validate_token_value(path: str, value: Any) -> bool:
    defn = get_token_def(path)
    if not defn:
        return False # Unknown token
        
    # Python Generic Type Check
    if defn.type == "string" and not isinstance(value, str): return False
    if defn.type == "number" and not isinstance(value, (int, float)): return False
    if defn.type == "boolean" and not isinstance(value, bool): return False
    # Color is string in JSON
    if defn.type == "color" and not isinstance(value, str): return False
    
    # Enum check
    if defn.enum and value not in defn.enum:
        return False
        
    return True
