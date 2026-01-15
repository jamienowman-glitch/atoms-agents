
import { MouseEventHandler } from 'react';

export interface Props {
    label: string;
    href?: string;
    utm_source?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    disabled?: boolean;
}
