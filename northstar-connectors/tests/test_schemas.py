import pytest
import os
import yaml
from connectors.models import ConnectorTemplate, ConnectorInstance, TemplateRef
from connectors.registry import Registry

# Paths
REGISTRY_ROOT = os.path.join(os.path.dirname(__file__), "../registry")

def test_shopify_template_schema():
    """Verify registry/shopify/1.0.0.yaml is valid against ConnectorTemplate."""
    reg = Registry(REGISTRY_ROOT)
    template = reg.get_template("shopify", "1.0.0")
    assert template is not None
    assert template.id == "shopify"
    assert "get_products" in template.operations
    assert template.operations["get_products"].strategy_lock_action == "shopify:read_products"

def test_secret_safety_validation():
    """Verify ConnectorInstance rejects plain text secrets."""
    reg = Registry(REGISTRY_ROOT)
    template = reg.get_template("shopify", "1.0.0")
    assert template is not None
    
    # Valid config (secret:: prefix)
    valid_instance = ConnectorInstance(
        id="inst_1",
        tenant_id="t_valid",
        env="dev",
        template_ref=TemplateRef(id="shopify", version="1.0.0"),
        config={
            "auth": {
                "shop_url": "foo.myshopify.com",
                "access_token": "secret::gsm_path_123" # OK
            }
        }
    )
    # Validation method
    ConnectorInstance.validate_config_secrets(valid_instance.config, template)

    # Invalid config (plain text secret)
    invalid_instance = ConnectorInstance(
        id="inst_2",
        tenant_id="t_valid",
        env="dev",
        template_ref=TemplateRef(id="shopify", version="1.0.0"),
        config={
            "auth": {
                "shop_url": "foo.myshopify.com",
                "access_token": "shpat_123456" # FAIL: No secret:: prefix
            }
        }
    )
    
    with pytest.raises(ValueError, match="MUST start with 'secret::'"):
        ConnectorInstance.validate_config_secrets(invalid_instance.config, template)
