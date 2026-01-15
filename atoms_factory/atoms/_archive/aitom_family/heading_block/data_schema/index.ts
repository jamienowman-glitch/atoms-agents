/**
 * Golden Prototype: Data Schema
 * Defines the functional interface (props) of the heading atom.
 */

export interface HeadingBlockProps {
    /**
     * The text content of the heading.
     */
    text: string;

    /**
     * HTML tag to render (h1-h6).
     */
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    /**
     * Font family.
     */
    fontFamily?: string;

    /**
     * Font size (e.g. 32px).
     */
    fontSize?: string;

    /**
     * Line height.
     */
    lineHeight?: string;

    /**
     * Font weight (100-1000).
     */
    weight?: string | number;

    /**
     * Font width (25-151).
     */
    width?: string | number;

    /**
     * Text color.
     */
    color?: string;

    /**
     * Bottom margin.
     */
    marginBottom?: string;
}
