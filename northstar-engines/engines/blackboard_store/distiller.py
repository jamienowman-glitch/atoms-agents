import logging
import asyncio
from typing import List, Tuple, Dict, Any, Optional
from engines.chat.service.llm_client import stream_chat
from engines.blackboard_store.models import BlackboardState

logger = logging.getLogger(__name__)

class BoardDistiller:
    def __init__(self):
        pass

    async def distill(self, old_state: Optional[BlackboardState], new_raw_data: Dict[str, Any]) -> Tuple[str, List[str]]:
        """
        Compare the old state and the new data. Summarize what changed.
        List 3 key takeaways for the next agent.
        """
        return await asyncio.to_thread(self._distill_sync, old_state, new_raw_data)

    def _distill_sync(self, old_state: Optional[BlackboardState], new_raw_data: Dict[str, Any]) -> Tuple[str, List[str]]:
        old_context = old_state.distilled_context if old_state else "No previous context."
        old_takeaways = "\n".join([f"- {t}" for t in old_state.takeaways]) if old_state and old_state.takeaways else "None"

        prompt_content = f"""
You are a memory distiller for a multi-agent system.

Old Context:
{old_context}

Old Takeaways:
{old_takeaways}

New Raw Data (Updates):
{new_raw_data}

Task:
1. Compare the old state and the new data.
2. Summarize what changed and the current situation (Distilled Context).
3. List 3 key takeaways for the next agent.

Format your response exactly as follows:

Distilled Context:
[Your summary here]

Takeaways:
- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]
"""

        messages = [{"role": "user", "content": prompt_content}]

        full_response = ""
        try:
            # Using a system tenant/thread for distillation
            for chunk in stream_chat(messages, tenant_id="t_system", thread_id="distiller", scope={}):
                full_response += chunk
        except Exception as e:
            logger.error(f"Distillation failed: {e}")
            # Return old state if failure
            return old_context, old_state.takeaways if old_state else []

        return self._parse_response(full_response, old_state)

    def _parse_response(self, response: str, old_state: Optional[BlackboardState]) -> Tuple[str, List[str]]:
        distilled_context = ""
        takeaways = []

        lines = response.split('\n')
        mode = None

        current_context_lines = []

        for line in lines:
            line = line.strip()
            if "Distilled Context:" in line:
                mode = "context"
                continue
            elif "Takeaways:" in line:
                mode = "takeaways"
                continue

            if mode == "context":
                if line:
                    current_context_lines.append(line)
            elif mode == "takeaways":
                if line.startswith("-"):
                    takeaways.append(line[1:].strip())

        distilled_context = "\n".join(current_context_lines).strip()

        # Fallback if parsing fails
        if not distilled_context:
            distilled_context = old_state.distilled_context if old_state else "Context update failed."
        if not takeaways:
             takeaways = old_state.takeaways if old_state else []

        return distilled_context, takeaways
