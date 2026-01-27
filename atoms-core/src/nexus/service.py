
from .store import get_nexus_store, NexusEmbedding
from .embedding_free import FreeEmbeddingAdapter
from .muscle_client import MuscleClient
from typing import List, Dict, Any
import os
import numpy as np

class NexusService:
    def __init__(self, tenant_id: str):
        self.tenant_id = tenant_id
        self.embed = FreeEmbeddingAdapter()
        self.muscle = MuscleClient()

    def ingest(self, domain: str, surface: str, text: str, vector: List[float] = None, metadata: Dict[str, Any] = None):
        """Ingest a simple text memory."""
        if not vector:
            vector = self.embed.embed_text(text)
            
        item = NexusEmbedding(
            id=f"{domain}-{surface}-{hash(text)}",
            tenant_id=self.tenant_id,
            domain=domain,
            surface=surface,
            modality="text",
            text=text,
            vector=vector,
            metadata=metadata or {}
        )
        store = get_nexus_store()
        store.add([item])
        return item.id

    def ingest_video(self, domain: str, surface: str, file_path: str):
        """
        Multimodal Ingest (Remote Muscle):
        1. Call atoms-muscle with S3 Bucket/Key.
        2. Receive { transcript, visual_vector }.
        3. Embed Transcript (Mistral) locally.
        4. Store.
        """
        print(f"🎬 Processing Video (Remote): {file_path}")
        
        # Parse Bucket/Key from path or assume standard bucket
        # Current path from uploader is "key" e.g. "tenant/raw/file.mp4"
        # Bucket is hardcoded in Architecture for now or fetched from Registry
        bucket = "northstar-media-dev" 
        key = file_path 
        
        # 1. Call Muscle
        data = self.muscle.ingest_video(bucket, key)
        transcript = data.get("transcript", "")
        visual_vector = data.get("visual_vector", [])
        
        print(f"✅ Muscle returned: {len(transcript)} chars, {len(visual_vector)} dim visual.")
        
        # 2. Semantic Embed (Mistral)
        semantic_vector = self.embed.embed_text(transcript)

        # 3. Store
        item_id = f"{domain}-{surface}-vid-{os.path.basename(key)}"
        
        # Fix: ensure visual_vector matches 512 dim schema or None
        if not visual_vector or len(visual_vector) != 512:
            print(f"⚠️ Warning: Visual Vector dim {len(visual_vector)} != 512")
            # visual_vector = None # Or handle error. OpenCLIP is 512.
        
        item = NexusEmbedding(
            id=item_id,
            tenant_id=self.tenant_id,
            domain=domain,
            surface=surface,
            modality="video",
            text=transcript,
            vector=semantic_vector,
            vector_visual=visual_vector, 
            metadata={
                "source": f"s3://{bucket}/{key}",
                "processed_by": "atoms-muscle"
            }
        )
        
        store = get_nexus_store()
        store.add([item])
        print(f"✅ Ingested Video: {item_id}")
        return item.id

    def recall(self, domain: str, query_vector: List[float], limit: int = 5):
        """Recall memories from a specific domain (Isolation enforced)."""
        store = get_nexus_store()
        return store.search(query_vector, domain=domain, limit=limit)

    def many_worlds_recall(self, domains: List[str], query_vector: List[float], limit: int = 5):
        """God View Recall: Search across multiple domains and merge."""
        results = []
        store = get_nexus_store()
        for dom in domains:
            hits = store.search(query_vector, domain=dom, limit=limit)
            results.extend(hits)
        # TODO: Re-rank results
        return sorted(results, key=lambda x: x['_distance'])[:limit]
