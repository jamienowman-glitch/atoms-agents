/**
 * Golden Prototype: Data Schema
 * Defines the functional interface (props) of the atom.
 */

export interface CTAButtonProps {
    /**
     * The text label to display inside the button.
     */
    label: string;

    /**
     * Optional URL to link to. If provided, renders an anchor tag.
     */
    href?: string;

    /**
     * Optional UTM Source tag for tracking.
     */
    utm_source?: string;

    /**
     * Optional click handler.
     */
    onClick?: () => void;

    /**
     * Whether the button is disabled.
     */
    disabled?: boolean;
}
