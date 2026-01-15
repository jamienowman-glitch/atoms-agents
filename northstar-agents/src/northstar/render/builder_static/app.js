const API_BASE = "/api";

// --- State ---
const state = {
    flows: [],
    currentFlowId: null,
    currentFlowData: null, // {id, nodes: [], edges: [], layout: {nodeId: {x,y}}}
    registryNodes: [], // Needed for picker
    meta: {
        personas: [],
        tasks: [],
        providers: [],
        models: []
    },
    selectedNodeId: null,
    connectMode: false,
    connectSourceId: null,
    isDirty: false
};

// --- DOM Elements ---
const flowSelect = document.getElementById('flowSelect');
const nodesLayer = document.getElementById('nodes-layer');
const edgesLayer = document.getElementById('edges-layer');
const inspectorContent = document.getElementById('inspector-content');
const inspectorActions = document.getElementById('inspector-actions');
const connectBtn = document.getElementById('connectModeBtn');
const saveBtn = document.getElementById('saveBtn');
const statusBar = document.getElementById('statusBar');
const modal = document.getElementById('nodePickerModal');
const nodeSearch = document.getElementById('nodeSearch');
const nodeList = document.getElementById('nodeList');
const liveToggle = document.getElementById('liveToggle');

// --- Initialization ---
async function init() {
    await Promise.all([
        fetchFlows(),
        fetchMetadata()
    ]);
    renderFlowSelector();
}

// --- Fetching ---
async function fetchFlows() {
    try {
        const res = await fetch(`${API_BASE}/flows`);
        const json = await res.json();
        state.flows = json.data || [];
    } catch (e) { console.error("Flow fetch failed", e); }
}

async function fetchMetadata() {
    try {
        const [p, t, pr, m] = await Promise.all([
            fetch(`${API_BASE}/personas`).then(r => r.json()),
            fetch(`${API_BASE}/tasks`).then(r => r.json()),
            fetch(`${API_BASE}/providers`).then(r => r.json()),
            fetch(`${API_BASE}/models`).then(r => r.json())
        ]);
        state.meta.personas = p.data || [];
        state.meta.tasks = t.data || [];
        state.meta.providers = pr.data || [];
        state.meta.models = m.data || [];
    } catch (e) {
        console.error("Meta fetch failed", e);
    }
}

async function fetchFlowDetail(flowId) {
    const res = await fetch(`${API_BASE}/flow/${flowId}`);
    const json = await res.json();
    return json.data;
}

async function fetchRegistryNodes() {
    const res = await fetch(`${API_BASE}/nodes`);
    const json = await res.json();
    state.registryNodes = json.data;
}

// --- Logic: Flow Loading ---
async function loadFlow(flowId) {
    if (!flowId) return;
    statusBar.innerText = `Loading ${flowId}...`;
    state.currentFlowId = flowId;
    state.selectedNodeId = null;
    state.connectMode = false;
    state.connectSourceId = null;
    updateConnectButton();

    try {
        const rawFlow = await fetchFlowDetail(flowId);

        // Normalize Flow Data
        const nodes = [];
        const edges = [];
        const layout = rawFlow.ui_layout || {};

        // Handle list of strings (standard FlowCard) or older dict
        if (Array.isArray(rawFlow.nodes)) {
            rawFlow.nodes.forEach(nid => nodes.push({ id: nid }));
        }

        if (Array.isArray(rawFlow.edges)) {
            rawFlow.edges.forEach(e => edges.push({ source: e.from, target: e.to }));
        }

        // Auto-layout
        const keys = nodes.map(n => n.id);
        const missingLayout = keys.filter(k => !layout[k]);

        if (missingLayout.length > 0) {
            let x = 50, y = 50;
            missingLayout.forEach(k => {
                layout[k] = { x, y };
                y += 120;
                if (y > 600) { y = 50; x += 250; }
            });
        }

        state.currentFlowData = {
            id: rawFlow.flow_id || rawFlow.id, // Normalize ID
            nodes: nodes,
            edges: edges,
            layout: layout,
            raw: rawFlow
        };

        renderGraph();
        resetInspector();
        statusBar.innerText = `Loaded ${flowId}`;
    } catch (e) {
        statusBar.innerText = `Error loading flow: ${e.message}`;
        console.error(e);
    }
}

// --- Rendering ---
function renderFlowSelector() {
    flowSelect.innerHTML = '<option value="" disabled selected>Select a Flow...</option>';
    state.flows.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.innerText = f.name || f.id;
        flowSelect.appendChild(opt);
    });
}

function renderGraph() {
    nodesLayer.innerHTML = '';
    edgesLayer.innerHTML = '';

    if (!state.currentFlowData) return;

    const { nodes, edges, layout } = state.currentFlowData;

    // Render Nodes
    nodes.forEach(n => {
        const pos = layout[n.id] || { x: 50, y: 50 };
        const el = document.createElement('div');
        el.className = `node-card ${state.selectedNodeId === n.id ? 'selected' : ''} ${state.connectSourceId === n.id ? 'source-active' : ''}`;
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
        el.dataset.id = n.id;

        el.innerHTML = `
            <div class="node-header">
                <span>NODE</span>
                ${state.connectMode && state.connectSourceId === n.id ? '<span>(Source)</span>' : ''}
            </div>
            <div class="node-title">${n.id}</div>
        `;

        el.onclick = (e) => onNodeClick(e, n.id);
        nodesLayer.appendChild(el);
    });

    // Render Edges
    const NODE_W = 180;
    const NODE_H = 60;

    edges.forEach(edge => {
        const srcPos = layout[edge.source];
        const tgtPos = layout[edge.target];
        if (!srcPos || !tgtPos) return;

        const x1 = srcPos.x + NODE_W / 2;
        const y1 = srcPos.y + NODE_H;
        const x2 = tgtPos.x + NODE_W / 2;
        const y2 = tgtPos.y;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`;
        path.setAttribute('d', d);
        path.setAttribute('class', 'edge');
        edgesLayer.appendChild(path);
    });
}

function updateConnectButton() {
    if (state.connectMode) {
        connectBtn.classList.add('active');
        statusBar.innerText = "Connect: Select Source";
    } else {
        connectBtn.classList.remove('active');
        statusBar.innerText = "Ready";
    }
}

// --- Interactions ---
function onNodeClick(e, nodeId) {
    e.stopPropagation();

    if (state.connectMode) {
        if (!state.connectSourceId) {
            state.connectSourceId = nodeId;
            renderGraph();
            statusBar.innerText = `Connect: Select Target for ${nodeId}`;
        } else {
            if (state.connectSourceId !== nodeId) {
                toggleEdge(state.connectSourceId, nodeId);
                state.connectSourceId = null;
                renderGraph();
                statusBar.innerText = "Connection Toggled";
            } else {
                state.connectSourceId = null;
                renderGraph();
                statusBar.innerText = "Connect: Select Source";
            }
        }
        return;
    }

    state.selectedNodeId = nodeId;
    renderGraph();
    loadInspector(nodeId);
}

function toggleEdge(source, target) {
    const idx = state.currentFlowData.edges.findIndex(e => e.source === source && e.target === target);
    if (idx >= 0) {
        // Remove
        state.currentFlowData.edges.splice(idx, 1);
    } else {
        // Add
        state.currentFlowData.edges.push({ source, target });
    }
    markDirty();
}

// --- Inspector ---
async function loadInspector(nodeId) {
    inspectorContent.innerHTML = '<p>Loading...</p>';
    inspectorActions.classList.remove('hidden');

    try {
        const res = await fetch(`${API_BASE}/node/${nodeId}`);
        const json = await res.json();
        if (json.status === 'ok') {
            renderInspectorFields(json.data);
        } else {
            inspectorContent.innerText = json.message;
        }
    } catch (e) {
        inspectorContent.innerText = "Error loading details.";
    }
}

function renderInspectorFields(data) {
    inspectorContent.innerHTML = '';
    // Normalize ID: API returns 'node_id', 'flow_id', etc.
    const id = data.node_id || data.id || data.flow_id;
    data.id = id; // Ensure consistent ID for saving

    const createSelect = (label, key, options, currentVal) => {
        const div = document.createElement('div');
        div.className = 'form-group';

        let optsHtml = '<option value="">(None)</option>';
        options.forEach(o => {
            const selected = o.id === currentVal ? 'selected' : '';
            optsHtml += `<option value="${o.id}" ${selected}>${o.name || o.id}</option>`;
        });

        div.innerHTML = `
            <label>${label}</label>
            <select id="field_${key}" data-key="${key}" onchange="onFieldChange()">${optsHtml}</select>
        `;
        return div;
    };

    const idGroup = document.createElement('div');
    idGroup.className = 'form-group';
    idGroup.innerHTML = `<label>ID</label><input type="text" value="${id}" disabled>`;
    inspectorContent.appendChild(idGroup);

    inspectorContent.appendChild(createSelect("Persona", "persona_ref", state.meta.personas, data.persona_ref));
    inspectorContent.appendChild(createSelect("Task", "task_ref", state.meta.tasks, data.task_ref));
    inspectorContent.appendChild(createSelect("Provider", "provider_ref", state.meta.providers, data.provider_ref));
    inspectorContent.appendChild(createSelect("Model", "model_ref", state.meta.models, data.model_ref));

    state.currentNodeData = data;
}

function onFieldChange() {
    markDirty();
}

function resetInspector() {
    inspectorContent.innerHTML = '<p class="placeholder">Select a node to edit.</p>';
    inspectorActions.classList.add('hidden');
}

function markDirty() {
    state.isDirty = true;
    saveBtn.innerText = "Save Changes *";
}

// --- Actions ---
saveBtn.onclick = async () => {
    if (state.selectedNodeId) await saveCurrentNode();
    if (state.currentFlowId) await saveCurrentFlow();

    state.isDirty = false;
    saveBtn.innerText = "Save Changes";
};

async function saveCurrentNode() {
    if (!state.currentNodeData) return;
    const selects = inspectorContent.querySelectorAll('select');
    selects.forEach(sel => {
        state.currentNodeData[sel.dataset.key] = sel.value;
    });

    // Ensure all required fields are present for NodeCard (e.g. node_id)
    if (!state.currentNodeData.node_id) state.currentNodeData.node_id = state.currentNodeData.id;

    await fetch(`${API_BASE}/node/${state.currentNodeData.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.currentNodeData)
    });
}

async function saveCurrentFlow() {
    if (!state.currentFlowData) return;

    const edgesList = state.currentFlowData.edges.map(e => ({ from: e.source, to: e.target }));
    const nodesList = state.currentFlowData.nodes.map(n => n.id);

    const payload = {
        ...state.currentFlowData.raw,
        nodes: nodesList,
        edges: edgesList, // YAML format
        ui_layout: state.currentFlowData.layout // UI persistent data
    };

    // Ensure flow_id
    if (!payload.flow_id) payload.flow_id = state.currentFlowData.id;

    await fetch(`${API_BASE}/flow/${state.currentFlowData.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

// --- Connect Mode ---
connectBtn.onclick = () => {
    state.connectMode = !state.connectMode;
    state.connectSourceId = null;
    updateConnectButton();
};

// --- Add Node ---
document.getElementById('addNodeBtn').onclick = async () => {
    if (!state.currentFlowId) {
        alert("Select a flow first.");
        return;
    }
    await fetchRegistryNodes();
    renderNodeList();
    modal.classList.remove('hidden');
    nodeSearch.focus();
};

document.querySelector('.close').onclick = () => modal.classList.add('hidden');

function renderNodeList() {
    const term = nodeSearch.value.toLowerCase();
    nodeList.innerHTML = '';
    state.registryNodes
        .filter(n => n.id.toLowerCase().includes(term) || (n.name && n.name.toLowerCase().includes(term)))
        .forEach(n => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${n.name || n.id}</strong> <span>${n.id}</span>`;
            li.onclick = () => addNodeToGraph(n.id);
            nodeList.appendChild(li);
        });
}

nodeSearch.oninput = renderNodeList;

function addNodeToGraph(nodeId) {
    if (state.currentFlowData.nodes.some(n => n.id === nodeId)) {
        alert("Node already in flow.");
        return;
    }

    state.currentFlowData.nodes.push({ id: nodeId });
    const count = state.currentFlowData.nodes.length;
    state.currentFlowData.layout[nodeId] = { x: 50 + (count * 20), y: 50 + (count * 20) };

    markDirty();
    modal.classList.add('hidden');
    renderGraph();
}

// --- Wire Events ---
flowSelect.onchange = (e) => loadFlow(e.target.value);
document.getElementById('refreshBtn').onclick = () => loadFlow(state.currentFlowId);
window.onFieldChange = onFieldChange;

// Init
init();
