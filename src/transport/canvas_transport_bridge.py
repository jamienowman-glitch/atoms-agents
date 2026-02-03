"""Canvas Transport Bridge for Atoms Agents

This module bridges agents running in atoms-agents to the CanvasTransport
infrastructure in atoms-ui through atoms-core realtime layer.

Architecture:
- SSE: Canvas state changes (authoritative truth) - for all visual updates
- WS: Chat rail messages (fast ephemeral) - agent chat + user chat, fast like WhatsApp
- Wide bandwidth for video/audio/image media (via MediaSidecars with URIs only)
- POST: Commands from canvas to agents

DO NOT modify any UI components or surfaces - only handle transport wiring.
"""

import asyncio
import json
import logging
from typing import Any, Callable, Dict, List, Optional
from urllib.parse import urljoin

import aiohttp

logger = logging.getLogger("CanvasTransportBridge")


# ============================================
# AGENT-SIDE TRANSPORT CLIENT
# ============================================


class AgentCanvasTransport:
    """Client-side transport for agents to communicate with canvas.
    
    Agents use this to:
    - Emit SSE events (canvas state truth)
    - Emit WS events (chat rail - fast)
    - Receive POST commands from canvas
    - Stream video/audio/image via MediaSidecars
    """
    
    def __init__(
        self,
        canvas_endpoint: str = "http://localhost:3000",
        realtime_endpoint: str = "http://localhost:8000",
        api_key: Optional[str] = None,
    ):
        """Initialize transport bridge.
        
        Args:
            canvas_endpoint: Canvas UI endpoint (atoms-ui)
            realtime_endpoint: Realtime server endpoint (atoms-core)
            api_key: Optional API key for authentication
        """
        self.canvas_endpoint = canvas_endpoint
        self.realtime_endpoint = realtime_endpoint
        self.api_key = api_key
        self.session: Optional[aiohttp.ClientSession] = None
        self.sse_clients: Dict[str, asyncio.Queue] = {}  # canvas_id -> event queue
        self.ws_connections: Dict[str, Any] = {}  # thread_id -> ws connection
    
    async def connect(self) -> None:
        """Initialize HTTP session."""
        self.session = aiohttp.ClientSession()
    
    async def disconnect(self) -> None:
        """Close HTTP session and WS connections."""
        # Close all WS connections
        for ws in self.ws_connections.values():
            await ws.close()
        
        # Close HTTP session
        if self.session:
            await self.session.close()
    
    # ========================================
    # SSE METHODS (Canvas State Truth)
    # ========================================
    
    async def emit_sse_event(
        self,
        canvas_id: str,
        event_data: Dict[str, Any],
        thread_id: Optional[str] = None,
    ) -> None:
        """Emit SSE event for canvas state change (truth).
        
        This sends a real-time state update to the canvas. All agents watching
        this canvas will see the update via SSE.
        
        Args:
            canvas_id: Canvas ID
            event_data: EventV2 envelope data
            thread_id: Optional thread ID for chat context
        """
        if not self.session:
            raise RuntimeError("Transport not connected. Call connect() first.")
        
        url = urljoin(
            self.realtime_endpoint,
            f"/sse/canvas/{canvas_id}"
        )
        
        headers = self._get_headers()
        
        payload = {
            "canvas_id": canvas_id,
            "thread_id": thread_id,
            "event": event_data,
        }
        
        try:
            async with self.session.post(url, json=payload, headers=headers) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    logger.error(
                        f"Failed to emit SSE event: {resp.status} - {error_text}"
                    )
        except Exception as e:
            logger.error(f"Error emitting SSE event: {e}")
    
    async def subscribe_sse(
        self,
        canvas_id: str,
        callback: Callable[[Dict[str, Any]], None],
    ) -> None:
        """Subscribe to SSE events for a canvas (listen for state changes).
        
        This keeps a persistent connection open to receive canvas state updates.
        
        Args:
            canvas_id: Canvas ID to watch
            callback: Async callback function for events
        """
        if not self.session:
            raise RuntimeError("Transport not connected. Call connect() first.")
        
        url = urljoin(
            self.realtime_endpoint,
            f"/sse/subscribe/{canvas_id}"
        )
        
        headers = self._get_headers()
        
        try:
            async with self.session.get(url, headers=headers) as resp:
                if resp.status != 200:
                    logger.error(f"Failed to subscribe to SSE: {resp.status}")
                    return
                
                async for line in resp.content:
                    if line.startswith(b"data: "):
                        event_json = line[6:].decode("utf-8")
                        try:
                            event_data = json.loads(event_json)
                            await callback(event_data)
                        except json.JSONDecodeError:
                            logger.warning(f"Invalid SSE data: {event_json}")
        except Exception as e:
            logger.error(f"Error subscribing to SSE: {e}")
    
    # ========================================
    # WS METHODS (Chat Rail - Fast Like WhatsApp)
    # ========================================
    
    async def emit_ws_message(
        self,
        thread_id: str,
        message_data: Dict[str, Any],
    ) -> None:
        """Emit WebSocket message for chat rail (fast ephemeral).
        
        This sends a message to the chat rail via WebSocket for agent-user
        communication. WS is used because chat needs low latency (like WhatsApp).
        
        Args:
            thread_id: Thread/conversation ID
            message_data: Message payload (usually EventV2 with type='chat_message')
        """
        url = urljoin(
            self.realtime_endpoint,
            f"/ws/chat/{thread_id}"
        )
        
        # Convert http(s) to ws(s)
        ws_url = url.replace("http://", "ws://").replace("https://", "wss://")
        
        try:
            # Ensure session exists
            if not self.session:
                raise RuntimeError("Transport not connected. Call connect() first.")
            
            # Get or create WS connection
            if thread_id not in self.ws_connections:
                ws = await self.session.ws_connect(ws_url)
                self.ws_connections[thread_id] = ws
            else:
                ws = self.ws_connections[thread_id]
            
            # Send message
            await ws.send_json(message_data)
        
        except Exception as e:
            logger.error(f"Error emitting WS message: {e}")
            # Remove broken connection
            if thread_id in self.ws_connections:
                del self.ws_connections[thread_id]
    
    async def subscribe_ws_messages(
        self,
        thread_id: str,
        callback: Callable[[Dict[str, Any]], None],
    ) -> None:
        """Subscribe to WebSocket messages for chat rail.
        
        Listen for messages from canvas/users on this thread.
        
        Args:
            thread_id: Thread/conversation ID
            callback: Async callback for incoming messages
        """
        url = urljoin(
            self.realtime_endpoint,
            f"/ws/chat/{thread_id}"
        )
        
        ws_url = url.replace("http://", "ws://").replace("https://", "wss://")
        
        try:
            if not self.session:
                raise RuntimeError("Transport not connected. Call connect() first.")
            
            async with self.session.ws_connect(ws_url) as ws:
                self.ws_connections[thread_id] = ws
                async for msg in ws:
                    if msg.type == aiohttp.WSMsgType.TEXT:
                        try:
                            data = json.loads(msg.data)
                            await callback(data)
                        except json.JSONDecodeError:
                            logger.warning(f"Invalid WS data: {msg.data}")
                    elif msg.type == aiohttp.WSMsgType.ERROR:
                        logger.error(f"WS error: {ws.exception()}")
                        break
        
        except Exception as e:
            logger.error(f"Error subscribing to WS messages: {e}")
        
        finally:
            if thread_id in self.ws_connections:
                del self.ws_connections[thread_id]
    
    # ========================================
    # MEDIA STREAMING (Wide Bandwidth)
    # ========================================
    
    async def upload_media(
        self,
        media_bytes: bytes,
        mime_type: str,
        filename: str,
    ) -> str:
        """Upload media and get URI reference (for MediaSidecars).
        
        Args:
            media_bytes: Raw media data
            mime_type: MIME type (video/mp4, audio/wav, image/png, etc)
            filename: Filename for storage
        
        Returns:
            URI reference to media (s3://..., artifact://..., etc)
        """
        if not self.session:
            raise RuntimeError("Transport not connected. Call connect() first.")
        
        url = urljoin(self.realtime_endpoint, "/media/upload")
        
        headers = self._get_headers()
        
        data = aiohttp.FormData()
        data.add_field("file", media_bytes, filename=filename, content_type=mime_type)
        
        try:
            async with self.session.post(url, data=data, headers=headers) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    return result.get("uri", "")
                else:
                    logger.error(f"Failed to upload media: {resp.status}")
                    return ""
        except Exception as e:
            logger.error(f"Error uploading media: {e}")
            return ""
    
    # ========================================
    # COMMAND POLLING (POST from Canvas)
    # ========================================
    
    async def poll_commands(
        self,
        agent_id: str,
        callback: Callable[[Dict[str, Any]], None],
    ) -> None:
        """Poll for commands sent from canvas to this agent.
        
        Args:
            agent_id: Agent ID
            callback: Async callback for commands
        """
        if not self.session:
            raise RuntimeError("Transport not connected. Call connect() first.")
        
        url = urljoin(self.realtime_endpoint, f"/commands/poll/{agent_id}")
        
        headers = self._get_headers()
        
        try:
            while True:
                async with self.session.get(url, headers=headers) as resp:
                    if resp.status == 200:
                        commands = await resp.json()
                        for cmd in commands:
                            await callback(cmd)
                    else:
                        logger.warning(f"Command poll failed: {resp.status}")
                
                # Poll every 100ms
                await asyncio.sleep(0.1)
        
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Error polling commands: {e}")
    
    # ========================================
    # UTILITIES
    # ========================================
    
    def _get_headers(self) -> Dict[str, str]:
        """Get HTTP headers with optional API key."""
        headers = {
            "Content-Type": "application/json",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers


# ============================================
# SINGLETON INSTANCE
# ============================================


_transport_instance: Optional[AgentCanvasTransport] = None


def get_transport() -> AgentCanvasTransport:
    """Get or create singleton transport instance."""
    global _transport_instance
    if _transport_instance is None:
        _transport_instance = AgentCanvasTransport()
    return _transport_instance


async def init_transport(
    canvas_endpoint: str = "http://localhost:3000",
    realtime_endpoint: str = "http://localhost:8000",
    api_key: Optional[str] = None,
) -> AgentCanvasTransport:
    """Initialize transport and connect."""
    global _transport_instance
    _transport_instance = AgentCanvasTransport(
        canvas_endpoint=canvas_endpoint,
        realtime_endpoint=realtime_endpoint,
        api_key=api_key,
    )
    await _transport_instance.connect()
    return _transport_instance


# ============================================
# INTEGRATION EXAMPLE
# ============================================

if __name__ == "__main__":
    import sys
    
    async def example():
        """Example of how agents use transport."""
        
        # 1. Initialize transport
        transport = await init_transport()
        
        # 2. Emit a chat message (WS - fast)
        await transport.emit_ws_message(
            thread_id="thread_001",
            message_data={
                "type": "chat_message",
                "sender_id": "agent_editor_001",
                "message": "Hello from agent!",
            },
        )
        
        # 3. Subscribe to canvas state (SSE - truth)
        async def handle_canvas_event(event):
            print(f"Canvas event: {event['type']}")
        
        await transport.subscribe_sse(
            canvas_id="canvas_001",
            callback=handle_canvas_event,
        )
        
        # 4. Cleanup
        await transport.disconnect()
    
    # Run example
    asyncio.run(example())
