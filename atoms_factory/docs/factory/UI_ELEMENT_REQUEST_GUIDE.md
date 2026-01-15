# UI Element Request Guide

## Purpose
This guide explains how to fill out the `UI_ELEMENT_REQUEST_TEMPLATE.tsv` to request new atoms.

## Columns

1.  **element_name**: Descriptive name (e.g., "Review Card").
2.  **category**: Where it runs (web, email, dm, freeform, or comma-separated).
3.  **base_atom_type**: Start from a core primitive (text, button, image, container, video).
4.  **required_groups**: Token groups that *must* be active (e.g., `content`, `typography`).
5.  **optional_groups**: Token groups that are available but optional.
6.  **allowed_children**: Comma-separated list of atom types allowed inside (or "None").
7.  **tracking_needs**: CTA click, impression, conversion goal, etc.
8.  **accessibility_notes**: specific aria roles or requirements.
9.  **na_fields**: Token groups that are definitely NOT applicable (must provide reason in notes if complex).
10. **sample_use_cases**: Where is this used?
11. **mapping_notes**: Equivalent in Shopify, Klaviyo, Figma, etc.

## Rules
*   Never leave a cell blank if "None" or "NA" applies.
*   Consult `UI_ATOM_TOKEN_CONTRACT.md` for group definitions.
