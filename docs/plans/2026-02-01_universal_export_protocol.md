# 🌍 Universal Export Protocol (v1.0)

> **Objective**: Standardize how *any* Export Muscle (PDF, PPTX, MP4, PNG) communicates with the Atoms UI.
> **Philosophy**: The UI is "Dumb". The Muscle is "Smart". The Protocol is "Strict".

## 1. The Core Concept

The UI does not know how to generate a PDF. It only knows how to send a **Universal Export Job**.
Every Export Muscle MUST accept this exact JSON structure and return the exact Result structure.

## 2. The Input Handshake (`ExportJob`)

The Muscle MUST accept a generic JSON payload.

```json
{
  "job_id": "uuid-v4",
  "canvas_state": { ... },     // The RAW JSON of the Canvas (Atoms, Props)
  "target_format": "pdf",      // The requested format extension
  "output_params": {           // Optional tuning
    "width": 1920,
    "height": 1080,
    "quality": "high",
    "include_background": true
  },
  "auth_context": {            // Tenant/Env context
    "tenant_id": "...",
    "env": "prod"
  }
}
```

### The Rules:
1.  **`canvas_state` is Truth**: The muscle must parse the Atoms JSON. It does NOT receive a pre-rendered image (unless specifically an Image-to-Format muscle).
2.  **`output_params` is Flat**: Do not nest deeply. Keep params simple.

## 3. The Output Handshake (`ExportResult`)

The Muscle MUST return a JSON object pointing to the hosted artifact. It NEVER returns bytes.

```json
{
  "job_id": "uuid-v4",
  "status": "success",
  "artifact": {
    "uri": "s3://tenants/.../export.pdf", // The Source of Truth
    "mime_type": "application/pdf",
    "size_bytes": 102400,
    "filename": "project_export.pdf"
  },
  "nexus_metadata": {          // Auto-indexing tags
    "type": "document",
    "generated_by": "muscle_export_pdf",
    "page_count": 5
  }
}
```

## 4. Discovery (The Registry)

To be "Pluggable", the Muscle MUST advertise itself in `atoms-agents/registry/capabilities/exports.yaml` (or its own `SKILL.md` frontmatter).

**Manifest Entry:**
```yaml
capability: "export"
formats: ["pdf", "docx"]
muscle_id: "muscle_export_documents"
cost_snax: 5
```

## 5. Implementation Strategy (The "Muscle Agent" Prompt)

(See `export_muscle_kickoff_prompt.md`)
