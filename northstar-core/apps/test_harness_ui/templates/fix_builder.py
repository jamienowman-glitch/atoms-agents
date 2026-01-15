
import os

file_path = '/Users/jaynowman/dev/northstar-core/apps/test_harness_ui/templates/builder.html'

with open(file_path, 'r') as f:
    lines = f.readlines()

# Find the marker
marker_index = -1
for i, line in enumerate(lines):
    if '// --- Chat Rail Logic ---' in line:
        marker_index = i
        break

if marker_index == -1:
    print("Marker not found!")
    exit(1)

# Keep everything up to the marker
new_content = lines[:marker_index]

# Append clean JS
new_js = """    // --- Chat Rail Logic ---
    let chatMode = 'planning'; // 'planning' | 'building'

    // Init Drag - Ensure elements exist before accessing
    const rail = document.getElementById('chat-rail');
    if (rail) {
        dragElement(rail);
        
        // Init Mobile State
        if (window.innerWidth <= 768) {
            rail.classList.add('mobile-half');
            const header = document.getElementById('chat-header');
            if (header) {
                header.addEventListener('click', (e) => {
                    if (e.target.closest('.mode-switch')) return;
                    if (window.innerWidth > 768) return;

                    if (rail.classList.contains('mobile-min')) {
                        rail.classList.remove('mobile-min');
                        rail.classList.add('mobile-half');
                    } else if (rail.classList.contains('mobile-half')) {
                        rail.classList.remove('mobile-half');
                        rail.classList.add('mobile-full');
                    } else {
                        rail.classList.remove('mobile-full');
                        rail.classList.add('mobile-min');
                    }
                });
            }
        }
    }

    function dragElement(elmnt) {
        if (!elmnt) return;
        if (window.innerWidth <= 768) return; 

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("chat-header");
        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            if (['INPUT', 'BUTTON', 'DIV'].includes(e.target.tagName) && e.target.closest('.mode-switch')) return;
            
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.bottom = "auto";
            elmnt.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function toggleMode() {
        const sw = document.querySelector('.mode-switch');
        const header = document.getElementById('chat-header');
        const input = document.getElementById('chat-input');

        if (!sw || !header || !input) return;

        if (chatMode === 'planning') {
            chatMode = 'building';
            sw.classList.remove('planning');
            sw.classList.add('building');
            header.style.borderBottom = "2px solid #28a745";
            input.placeholder = "Command the Builder...";
        } else {
            chatMode = 'planning';
            sw.classList.remove('building');
            sw.classList.add('planning');
            header.style.borderBottom = "2px solid #007bff";
            input.placeholder = "Discuss the plan...";
        }
    }

    async function sendChat() {
        const input = document.getElementById('chat-input');
        const history = document.getElementById('chat-history');
        if (!input || !history) return;

        const msg = input.value.trim();
        if (!msg) return;

        // User Msg
        const userDiv = document.createElement('div');
        userDiv.className = 'msg user';
        userDiv.innerText = msg;
        history.appendChild(userDiv);
        input.value = "";
        history.scrollTop = history.scrollHeight;

        // Loading
        const loadDiv = document.createElement('div');
        loadDiv.className = 'msg bot';
        loadDiv.innerText = "...";
        history.appendChild(loadDiv);

        try {
            // Gather Context
            const currentSteps = Array.from(document.querySelectorAll('.flow-step')).map(s => {
                const slotted = Array.from(s.querySelectorAll('.slotted-agent')).map(a => a.dataset.agentId);
                return {
                    id: s.dataset.stepId, 
                    framework: s.dataset.framework, 
                    agents: slotted
                };
            });

            const res = await fetch('/api/builder/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    mode: chatMode,
                    current_flow: currentSteps
                })
            });

            const data = await res.json();
            loadDiv.innerText = data.thought || "Done.";

            if (data.actions) {
                await executeActions(data.actions);
            }

        } catch (e) {
            console.error(e);
            loadDiv.innerText = "Error: " + e.message;
        }
    }

    async function executeActions(actions) {
        const history = document.getElementById('chat-history');

        for (const act of actions) {
            console.log("Executing:", act);
            await new Promise(r => setTimeout(r, 600));

            try {
                if (act.cmd === 'add_step') {
                    if (typeof createStep === 'function') {
                        const step = createStep(act.framework);
                        step.dataset.stepId = act.id;
                        step.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (act.cmd === 'add_agent') {
                    const step = document.querySelector(`.flow-step[data-step-id="${act.step_id}"]`);
                    if (step) {
                        const slot = step.querySelector('.agent-slot');
                        if (typeof addAgentToSlot === 'function') {
                            addAgentToSlot(slot, act.agent_id);
                        }
                        const pill = slot.lastElementChild;
                        if (pill) {
                            pill.style.border = "2px solid #fff";
                            setTimeout(() => pill.style.border = "1px solid #0f0", 500);
                        }
                    }
                } else if (act.cmd === 'create_agent') {
                    const payload = {
                        filename: act.filename,
                        display_name: act.role,
                        role: act.role,
                        manifest: act.goal,
                        persona: act.backstory,
                        framework: "crewai"
                    };

                    const res = await fetch('/api/registry/agents', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        if (typeof loadAgents === 'function') await loadAgents();
                        const div = document.createElement('div');
                        div.className = 'msg bot';
                        div.style.color = '#0f0';
                        div.innerText = `✅ Created New Agent: ${act.filename}`;
                        history.appendChild(div);
                    }
                } else if (act.cmd === 'set_io') {
                    const step = document.querySelector(`.flow-step[data-step-id="${act.step_id}"]`);
                    if (step) {
                        const slot = step.querySelector(`.io-slot[data-slot-type="${act.type}"]`);
                        const name = act.block === 'user_input' ? 'User Input' :
                            act.block === 'html_page' ? 'HTML Page' : act.block === 'report' ? 'Text Report' : act.block;
                        if (typeof setSlotValue === 'function') {
                            setSlotValue(slot, act.block, name);
                        }
                    }
                }
            } catch (e) {
                console.error("Action Failed:", act, e);
                const errDiv = document.createElement('div');
                errDiv.className = 'msg bot';
                errDiv.style.color = '#f44';
                errDiv.innerText = `❌ Action Failed: ${e.message}`;
                history.appendChild(errDiv);
            }
        }
    }
    </script>
</body>
</html>
"""

# Write combined content
with open(file_path, 'w') as f:
    f.writelines(new_content)
    f.write(new_js)

print("Successfully rewrote builder.html end section.")
