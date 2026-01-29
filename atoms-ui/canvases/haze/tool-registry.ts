export const HAZE_TOOL_REGISTRY = {
    "nav.forward": {
        id: "nav.forward",
        type: "float",
        default: 0,
        min: -1000,
        max: 1000,
        label: "Forward"
    },
    "nav.turn": {
        id: "nav.turn",
        type: "float",
        default: 0,
        min: -360,
        max: 360,
        label: "Turn"
    },
    "nav.speed": {
        id: "nav.speed",
        type: "float",
        default: 1,
        min: 0.1,
        max: 5,
        label: "Speed"
    },
    "nav.zoom": {
        id: "nav.zoom",
        type: "float",
        default: 1,
        min: 0.1,
        max: 3,
        label: "Zoom"
    }
};

