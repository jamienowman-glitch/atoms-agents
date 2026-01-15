import React from 'react';

// Types aligning with Token Schema
interface ControlProps {
    type: 'string' | 'number' | 'boolean' | 'object' | 'color';
    format?: string;
    enum?: string[];
    min?: number;
    max?: number;
    value: any;
    onChange: (val: any) => void;
    label: string;
}

// 1. Widgets
const Toggle: React.FC<ControlProps> = ({ value, onChange, label }) => (
    <div className="control-row">
        <label>{label}</label>
        <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
        />
    </div>
);

const Slider: React.FC<ControlProps> = ({ value, onChange, min = 0, max = 100, label }) => (
    <div className="control-row">
        <label>{label} ({value})</label>
        <input
            type="range"
            min={min}
            max={max}
            value={value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
        />
    </div>
);

const Select: React.FC<ControlProps> = ({ value, onChange, enum: options, label }) => (
    <div className="control-row">
        <label>{label}</label>
        <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select...</option>
            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const ColorPicker: React.FC<ControlProps> = ({ value, onChange, label }) => (
    <div className="control-row">
        <label>{label}</label>
        <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const TextInput: React.FC<ControlProps> = ({ value, onChange, label }) => (
    <div className="control-row">
        <label>{label}</label>
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

// 2. Factory
export const ControlFactory: React.FC<ControlProps> = (props) => {
    const { type, format, enum: options } = props;

    // STRICT MAPPING RULES
    if (type === 'boolean') {
        return <Toggle {...props} />;
    }

    if (type === 'number') {
        // Could check description or format for "slider" vs "input", but defaults to slider for tokens
        return <Slider {...props} />;
    }

    if (type === 'color' || format === 'color') {
        return <ColorPicker {...props} />;
    }

    if (options && options.length > 0) {
        return <Select {...props} />;
    }

    // Specific 'content.text' handled via Inline Edit on Canvas mostly, 
    // but if it appears in inspector, show input.
    if (type === 'string') {
        return <TextInput {...props} />;
    }

    return <div className="unknown-control">Unknown Control: {props.label}</div>;
};
