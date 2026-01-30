export const HAZE_TOOL_REGISTRY = {
    "nav.forward": {
        id: "nav.forward",
        type: "slider" as const,
        default: 0,
        min: -100,
        max: 100,
        label: "Forward/Backward"
    },
    "nav.turn": {
        id: "nav.turn",
        type: "slider" as const,
        default: 0,
        min: -180,
        max: 180,
        label: "Left/Right Turn"
    }
};

