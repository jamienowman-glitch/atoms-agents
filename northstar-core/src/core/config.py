"""Northstar Core Configuration Module"""
import os

# Environment
ENV = os.getenv("ENV", "dev")

# Tenant Identity
TENANT_ID = os.getenv("TENANT_ID")
if TENANT_ID is None:
    raise RuntimeError("TENANT_ID is not set; configure it in your environment.")

# Cloud Regions
AWS_REGION = os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
GCP_REGION = os.getenv("GCP_REGION")
