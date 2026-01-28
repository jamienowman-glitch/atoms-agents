"use client";

import React, { useState, useEffect, useRef } from 'react';

interface ChatWindowProps {
  apiUrl: string;
  config: {
    providerId: string;
    modelId: string;
    personaId: string;
    manifestId: string;
    reasoningId: string;
    licenseId: string;
  };
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function ChatWindow({ apiUrl, config }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"disconnected" | "connected" | "streaming">("disconnected");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert HTTP to WS
  const wsUrl = apiUrl.replace(/^http/, 'ws') + '/workbench/ws';

  useEffect(() => {
    // Initialize WebSocket
    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      setStatus("connected");
      console.log("Connected to Workbench API");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setMessages(prev => [...prev, { role: 'system', content: `Error: ${data.error}` }]);
        setStatus("connected");
      } else if (data.token) {
        // Stream token: append to last assistant message or create new one
        setStatus("streaming");
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, content: last.content + data.token }];
          } else {
            return [...prev, { role: 'assistant', content: data.token }];
          }
        });
      } else if (data.done) {
        setStatus("connected");
      }
    };

    socket.onclose = () => {
      setStatus("disconnected");
    };

    return () => {
      socket.close();
    };
  }, [wsUrl]);

  const sendMessage = () => {
    if (!input.trim() || !ws.current) return;

    if (ws.current.readyState !== WebSocket.OPEN) {
        setMessages(prev => [...prev, { role: 'system', content: 'Error: WebSocket is not connected.' }]);
        return;
    }

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    // Send Payload
    const payload = {
        ...config,
        messages: messages.concat(userMsg) // sending full history? or just last? API handles full history
    };

    ws.current.send(JSON.stringify(payload));
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="font-semibold">Chat Session</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'connected' ? 'bg-green-100 text-green-800' :
            status === 'streaming' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
        }`}>
            {status}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl rounded-lg p-3 ${
                m.role === 'user' ? 'bg-blue-600 text-white' :
                m.role === 'system' ? 'bg-red-50 text-red-600 border border-red-200' :
                'bg-white border border-gray-200'
            }`}>
              <pre className="whitespace-pre-wrap font-sans text-sm">{m.content}</pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
            <input
                type="text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
                onClick={sendMessage}
                disabled={status !== 'connected'}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                Send
            </button>
        </div>
      </div>
    </div>
  );
}
