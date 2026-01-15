/**
 * Token: Typography Global
 * Category: Typography
 */
export const fontFamily = {
    defaultValue: "'Roboto Flex', sans-serif",
    type: "text", // Could be enum later
    description: "Font Family"
};

export const fontSize = {
    defaultValue: "16px",
    type: "text",
    description: "Font Size"
};

// Variable Axis Defaults
export const weight = {
    defaultValue: "400",
    type: "number",
    min: 100,
    max: 1000,
    description: "Font Weight (wght)"
};

export const width = {
    defaultValue: "100",
    type: "number",
    min: 25,
    max: 151,
    description: "Font Width (wdth)"
};
