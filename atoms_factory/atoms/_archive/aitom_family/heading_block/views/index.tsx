import React from 'react';
import { HeadingBlockProps } from '../data_schema';

/**
 * Heading Block Atom
 * A flexible heading component supporting variable fonts.
 */
export const HeadingBlock: React.FC<HeadingBlockProps> = ({
    text = "Heading Text",
    tag = 'h2',
    fontFamily = "'Roboto Flex', sans-serif",
    fontSize = "32px",
    lineHeight = "1.2",
    weight = "700",
    width = "100",
    color = "#111111",
    marginBottom = "16px"
}) => {
    const Tag = tag as keyof JSX.IntrinsicElements;

    const style: React.CSSProperties = {
        fontFamily: fontFamily,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: color,
        marginBottom: marginBottom,
        margin: `0 0 ${marginBottom} 0`,
        fontVariationSettings: `"wght" ${weight}, "wdth" ${width}`
    };

    return (
        <Tag style={style}>
            {text}
        </Tag>
    );
};
