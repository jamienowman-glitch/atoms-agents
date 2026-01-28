export const HAZE_TOOL_REGISTRY = {
    "haze:nav.forward": {
        id: "haze:nav.forward",
        type: "float",
        default: 0,
        min: -1000,
        max: 1000,
        label: "Forward"
    },
    "haze:nav.turn": {
        id: "haze:nav.turn",
        type: "float",
        default: 0,
        min: -360,
        max: 360,
        label: "Turn"
    },
    "haze:nav.speed": {
        id: "haze:nav.speed",
        type: "float",
        default: 1,
        min: 0.1,
        max: 5,
        label: "Speed"
    },
    "haze:nav.zoom": {
        id: "haze:nav.zoom",
        type: "float",
        default: 1,
        min: 0.1,
        max: 3,
        label: "Zoom"
    }
};
