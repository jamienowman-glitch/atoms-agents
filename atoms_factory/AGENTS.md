# Agents Contract

This document serves as the authoritative contract for coding agents working on the Atoms Factory.

## Typography Contract
**Context**: All typography must support Variable Font capabilities (Roboto Flex) and specific scroll-based animations.

### Required Tokens
For every typography object (e.g., `heading`, `subheading`, `body`), the following tokens **MUST** be exposed:

1.  **Weight (`wght`)**
    *   **Type**: Slider
    *   **Range**: 100 - 900
    *   **Step**: 10
2.  **Slant (`slnt`)**
    *   **Type**: Slider
    *   **Range**: -10 to 0 (where -10 is slanted/italic, 0 is upright)
    *   **Step**: 1
3.  **Width (`wdth`)**
    *   **Type**: Slider
    *   **Range**: 25 - 151
    *   **Step**: 1
4.  **Size**
    *   **Type**: Smart Stepper / Dimension
    *   **Controls**: +/- buttons and Unit dropdown (px, rem, em, etc.)
5.  **Letter Spacing (`tracking` / `letter_spacing`)**
    *   **Type**: Slider
    *   **Range**: -100 to 250
    *   **Step**: 1 (or 0.1 depending on unit)
    *   **Note**: Must allow adjusting space between individual letters.

### Animation Contract
Every text element must offer "On Scroll" animation options.

*   **Mode**: `ON_SCROLL` | `OFF` (Default: OFF)
*   **Style** (Enum):
    *   `BREATHE_IN`: Loses font weight as you scroll (e.g., starts heavy, gets lighter).
    *   `BREATHE_OUT`: Gains font weight as you scroll (e.g., starts light, gets heavier).
    *   `LEAN_BACK`: Transitions from Upright (`slnt: 0`) to Slanted (`slnt: -10`) as you scroll.

### Variable Font Presets
Agents should refer to `fonts/roboto_flex_presets.tsv` for standard combinations of weight, width, and slant.
