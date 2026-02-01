---
name: muscle-export-universal
description: Universal Export Muscle capable of converting Atoms Canvas JSON into PDF, PNG, PPTX, MP4, and 12+ other formats.
metadata:
  mcp-endpoint: https://connect.atoms.fam/mcp/export-universal
  short-description: Universal Format Converter (PDF, PNG, MP4, PPTX)
  version: 1.0.0
  capability: export
  formats: [png, pdf, jpg, jpeg, mp4, pptx, xlsx, csv, docx, xml, txt, md, html, tsx, css, json, svg]
  cost-snax: 5
---

# Universal Export Muscle

## Capability
Converts a raw Atoms Canvas State (JSON) into a downloadable file in the requested format (PDF, PNG, PPTX, etc.).

## When to use
*   User clicks "Export" in the UI.
*   User wants to download their work as a file.
*   Another agent needs a rendered asset (e.g. "Send a PDF of this board to Slack").

## Schema

### Input (`ExportJob`)
```json
{
  "job_id": "uuid",
  "canvas_state": { ... },
  "target_format": "pdf",
  "output_params": {
    "width": 1920,
    "quality": "high"
  },
  "auth_context": {
    "tenant_id": "T-123",
    "env": "prod"
  }
}
```

### Output (`ExportResult`)
```json
{
  "job_id": "uuid",
  "status": "success",
  "artifact": {
    "uri": "s3://...",
    "mime_type": "application/pdf",
    "size_bytes": 1024,
    "filename": "export.pdf"
  },
  "nexus_metadata": {
      "type": "document",
      "page_count": 5
  }
}
```

## Brain/Brawn
*   **Brawn**: This is a GPU/CPU intensive muscle. It runs on the `atoms-muscle` cluster.
*   **Brain**: No local execution required. The Agent just sends the JSON.
