/**
 * Golden Prototype: CTA Button
 * "Generic, black-and-white, Roboto Flex font"
 */

import React from 'react';
import { tokens } from '../exposed_tokens';
import { CTAButtonProps } from '../data_schema';

// Internal style construction using exposed tokens
const styles = {
    button: {
        backgroundColor: tokens.backgroundColor,
        color: tokens.textColor,
        border: `${tokens.borderWidth} solid ${tokens.borderColor}`,
        borderRadius: tokens.borderRadius,
        fontFamily: tokens.fontFamily,
        fontSize: tokens.fontSize,
        padding: tokens.padding,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        // Base "block" behaviour
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none', // For anchor tag
    }
};

export const CTAButton: React.FC<CTAButtonProps> = ({ label, href, utm_source, onClick, disabled }) => {
    if (href) {
        const fullUrl = utm_source ? `${href}?utm_source=${utm_source}` : href;
        return (
            <a
                href={fullUrl}
                style={styles.button}
                onClick={onClick}
            >
                {label}
            </a>
        );
    }

    return (
        <button
            style={styles.button}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default CTAButton;
