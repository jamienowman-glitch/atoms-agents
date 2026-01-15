
// State
let state = {
    write_enabled: false,
    active_scopes: [],
    scope_locked: false,
    tunnel_status: "stopped"
};

const def_api_call = async (path, body = null) => {
    const opts = body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {};
    const res = await fetch(path, opts);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function syncState() {
    state = await def_api_call('/api/state');
    renderState();
}

function renderState() {
    // Mode
    document.getElementById('mode-toggle').checked = state.write_enabled;
    const timer = document.getElementById('mode-timer');
    if (state.write_enabled) {
        timer.style.display = 'block';
        document.getElementById('timer-val').textContent = Math.ceil(state.write_expires_in / 60);
    } else {
        timer.style.display = 'none';
    }

    // Lock
    document.getElementById('scope-lock').checked = state.scope_locked;
    document.getElementById('workspace-list').style.opacity = state.scope_locked ? '0.5' : '1';

    // Scopes (checkboxes)
    document.querySelectorAll('.scope-chk').forEach(chk => {
        chk.disabled = state.scope_locked;
        chk.checked = state.active_scopes.includes(chk.value);
    });

    // Tunnel
    const btn = document.getElementById('btn-tunnel');
    const status = document.getElementById('tunnel-status');
    const box = document.getElementById('tunnel-url-box');

    status.textContent = state.tunnel_status.toUpperCase();

    if (state.tunnel_status === 'running') {
        btn.textContent = "Stop Tunnel";
        btn.onclick = () => toggleTunnel('stop');
        btn.classList.add('btn-danger');
        btn.classList.remove('btn-primary');
        box.style.display = 'block';
        box.style.display = 'block';
        document.getElementById('tunnel-url').value = state.tunnel_url + "/mcp/sse";
    } else if (state.tunnel_status === 'starting') {
        btn.textContent = "Starting...";
        btn.disabled = true;
    } else {
        btn.textContent = "Start Tunnel";
        btn.onclick = () => toggleTunnel('start');
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
        btn.disabled = false;
        box.style.display = 'none';
    }
}

async function toggleMode() {
    const enabled = document.getElementById('mode-toggle').checked;
    if (enabled && !confirm("Enable write access? Warning: This allows the model to modify files.")) {
        document.getElementById('mode-toggle').checked = false;
        return;
    }
    await def_api_call('/api/control/mode', { enable_writes: enabled });
    await syncState();
}

async function toggleLock() {
    const locked = document.getElementById('scope-lock').checked;
    await def_api_call('/api/control/lock', { locked: locked });
    await syncState();
}

async function updateScopes() {
    if (state.scope_locked) return;
    const scopes = Array.from(document.querySelectorAll('.scope-chk:checked')).map(c => c.value);
    await def_api_call('/api/control/scope', { scopes: scopes });
    await syncState();
}

async function toggleTunnel(action) {
    console.log("toggleTunnel called with:", action);
    if (!action) {
        // Fallback or infer
        action = state.tunnel_status === 'running' ? 'stop' : 'start';
    }

    if (action === 'start') {
        await def_api_call('/api/tunnel', { action: 'start', provider: 'cloudflared' }); // default
    } else {
        await def_api_call('/api/tunnel', { action: 'stop' });
    }
    // Poll updates
    pollState();
}

async function refreshWorkspaces() {
    // Call MCP tool via generic endpoint for listing (or just use discovery logic if exposed)
    // We already have generic tool call logic, let's use it for workspace.refresh?
    // Actually, let's use the REST API logic or simple tool call.
    // Reusing the old `callTool` mechanism for workspace list.
    const container = document.getElementById('workspace-list');
    container.innerHTML = 'Loading...';

    try {
        const res = await fetch('/mcp/messages', {
            method: 'POST',
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'workspace_list' } })
        });
        const data = await res.json();
        // Parse result string
        const workspaces = JSON.parse(data.result.content[0].text);

        container.innerHTML = '';
        workspaces.sort((a, b) => (a.workspace_id === 'dev-root' ? -1 : a.workspace_id.localeCompare(b.workspace_id)));

        workspaces.forEach(ws => {
            const div = document.createElement('div');
            div.className = 'workspace-item';
            div.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; width:100%; cursor:pointer;">
                    <input type="checkbox" class="scope-chk" value="${ws.workspace_id}" onchange="updateScopes()">
                    <span>${ws.display_name}</span>
                    <span style="font-size:10px; color:#aaa;">${ws.kind}</span>
                </label>
            `;
            container.appendChild(div);
        });

        syncState(); // sync checks
    } catch (e) {
        container.textContent = 'Error loading workspaces.';
    }
}

async function runSelfTest() {
    const res = await def_api_call('/api/selftest');
    const results = Object.entries(res.results).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n');
    alert("Self-Test Results:\n\n" + results);
}

// Search & Preview (Simplified from previous)
async function search() {
    const query = document.getElementById('search-query').value;
    const glob = document.getElementById('glob').value;
    if (!query) return;

    document.getElementById('results-area').innerHTML = 'Searching...';

    // Use MCP tool
    const res = await fetch('/mcp/messages', {
        method: 'POST',
        body: JSON.stringify({
            jsonrpc: '2.0', id: 2, method: 'tools/call',
            params: {
                name: 'repo_search',
                arguments: { query: query, path_glob: glob || null }
            }
        })
    });
    const data = await res.json();
    const hits = JSON.parse(data.result.content[0].text);

    const div = document.getElementById('results-area');
    div.innerHTML = '';

    if (hits.length === 0) {
        div.innerHTML = "No results.";
        return;
    }

    hits.forEach(hit => {
        const d = document.createElement('div');
        d.className = 'result';
        d.onclick = () => fetchFile(hit.id);
        d.innerHTML = `<div><strong>${hit.path}</strong></div><div class="snippet">${escapeHtml(hit.snippet)}</div>`;
        div.appendChild(d);
    });
}

async function fetchFile(id) {
    const res = await fetch('/mcp/messages', {
        method: 'POST',
        body: JSON.stringify({
            jsonrpc: '2.0', id: 3, method: 'tools/call',
            params: { name: 'repo_fetch', arguments: { id: id } }
        })
    });
    const data = await res.json();
    const content = JSON.parse(data.result.content[0].text);

    document.getElementById('preview-code').textContent = content.content;
    document.getElementById('preview-title').textContent = `${content.path}`;
    document.getElementById('preview-modal').style.display = 'flex';
}

function closePreview() {
    document.getElementById('preview-modal').style.display = 'none';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Init
refreshWorkspaces();
setInterval(syncState, 2000); // Poll state
function pollState() { setTimeout(syncState, 500); }
