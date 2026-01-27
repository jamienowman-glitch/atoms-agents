"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Film, FileAudio, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase'; // Authentication context might be needed if API assumes auth

export default function NexusUploader() {
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'uploading' | 'ingesting' | 'complete'>('idle');
    const [frames, setFrames] = useState<string[]>([]);
    const [log, setLog] = useState<string[]>([]);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const logMsg = (msg: string) => setLog(prev => [...prev, msg]);

    const extractFrames = async (file: File) => {
        setStatus('analyzing');
        setFrames([]);
        setLog([]);
        setFileToUpload(file);
        logMsg(`Client CPU: Decoding ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);

        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = url;
        video.muted = true;
        video.playsInline = true;

        await new Promise((resolve) => {
            video.onloadedmetadata = () => resolve(true);
        });

        logMsg(`Duration: ${video.duration.toFixed(1)}s`);

        const canvas = document.createElement('canvas');
        canvas.width = 512; // Resize for CLIP
        canvas.height = 512; // Roughly square/contain
        const ctx = canvas.getContext('2d');

        const seekPoints = [0.1, video.duration / 2, video.duration - 1]; // Start, Mid, End
        const extracted: string[] = [];

        for (const time of seekPoints) {
            video.currentTime = time;
            await new Promise(r => video.onseeked = r);

            if (ctx) {
                // Draw resized
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                extracted.push(dataUrl);
            }
        }

        setFrames(extracted);
        logMsg("✅ Edge Compute: Extracted 3 Semantic Keyframes.");
        setStatus('idle');
        URL.revokeObjectURL(url);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file?.type.startsWith('video/')) {
            extractFrames(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'video/*': [], 'image/*': [] } });

    const handleIngest = async () => {
        if (!fileToUpload) return;
        setStatus('uploading');
        logMsg("🚀 Requesting S3 Presigned URL...");

        try {
            // 1. Get Presigned URL
            // Note: In real setup, we need auth headers. For now relying on browser session if cookies set, or simple fetch.
            // Assuming API is at localhost:8000 (atoms-core) or proxied.
            // Adjust fetch URL as needed. Assuming Next.js rewrites or direct call.
            const API_BASE = "http://localhost:8000"; // Dev default

            // TODO: Add Auth Header from Supabase Session
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const presignRes = await fetch(`${API_BASE}/api/v1/nexus/upload-url`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    filename: fileToUpload.name,
                    content_type: fileToUpload.type
                })
            });

            if (!presignRes.ok) throw new Error("Failed to get upload URL");
            const { url, fields, key } = await presignRes.json();

            logMsg(`✅ Got S3 Access: ${key}`);
            logMsg("🚀 Uploading to northstar-media-dev...");

            // 2. Upload to S3
            const formData = new FormData();
            Object.entries(fields).forEach(([k, v]) => {
                formData.append(k, v as string);
            });
            formData.append("file", fileToUpload);

            const uploadRes = await fetch(url, {
                method: "POST",
                body: formData
            });

            if (!uploadRes.ok) throw new Error("S3 Upload Failed");
            logMsg("✅ Upload Complete.");

            // 3. Trigger Ingest
            setStatus('ingesting');
            logMsg("📡 Triggering Hybrid Embed (Server)...");

            const ingestRes = await fetch(`${API_BASE}/api/v1/nexus/ingest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    domain: "general", // Default or select
                    surface: "dashboard",
                    modality: "video",
                    file_path: key // Send the S3 Key
                })
            });

            if (!ingestRes.ok) throw new Error("Ingest Failed");
            const ingestData = await ingestRes.json();

            logMsg(`🧠 Nexus: Ingested (ID: ${ingestData.id}).`);
            logMsg("✨ DONE. Memory Created.");
            setStatus('complete');

        } catch (e: any) {
            logMsg(`❌ Error: ${e.message}`);
            setStatus('idle');
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 relative">
            <h3 className="font-bold uppercase text-lg mb-4 flex items-center gap-2">
                <Upload size={20} />
                Nexus Ingest
            </h3>

            {/* DROPZONE */}
            <div {...getRootProps()} className={`
                border-4 border-dashed border-neutral-300 p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-black bg-blue-50' : 'hover:border-black'}
            `}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center opacity-60">
                    <Film size={48} className="mb-4" />
                    <p className="font-bold uppercase">Drop Video Here</p>
                    <p className="font-mono text-xs">Edge Processing Enabled</p>
                </div>
            </div>

            {/* LOG */}
            {log.length > 0 && (
                <div className="mt-4 bg-black text-green-400 p-4 font-mono text-xs h-32 overflow-y-auto">
                    {log.map((l, i) => <div key={i}>{l}</div>)}
                </div>
            )}

            {/* FRAMES PREVIEW */}
            {frames.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold uppercase text-xs opacity-60">Visual Signal (Client Extracted)</span>
                        <span className="font-mono text-xs bg-neutral-200 px-2">3 FRAMES</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {frames.map((src, i) => (
                            <img key={i} src={src} className="w-full h-24 object-cover border-2 border-black" />
                        ))}
                    </div>

                    <button
                        onClick={handleIngest}
                        disabled={status === 'uploading' || status === 'ingesting' || status === 'complete'}
                        className="w-full mt-4 bg-black text-white py-3 font-bold uppercase hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {(status === 'uploading' || status === 'ingesting') ? <Loader2 className="animate-spin" /> : <Upload size={16} />}
                        {status === 'complete' ? 'Ingested' : 'Upload & Embed'}
                    </button>
                    <div className="text-center mt-2 text-xs opacity-50 font-mono">
                        Target: s3://northstar-media-dev
                    </div>
                </div>
            )}
        </div>
    );
}
