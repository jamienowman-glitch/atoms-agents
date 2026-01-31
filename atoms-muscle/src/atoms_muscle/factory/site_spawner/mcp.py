
"""
ATOM SPAWNER: MCP Wrapper.
Path: atoms-muscle/src/atoms_muscle/factory/site_spawner/mcp.py
"""
try:
    from mcp.server.fastmcp import FastMCP
    from .service import SiteSpawnerService
except ImportError as e:
    # Fallback for when running in dev/test without installed package
    from fastmcp import FastMCP
    try:
        from service import SiteSpawnerService
    except ImportError:
         from .service import SiteSpawnerService

mcp = FastMCP("Muscle Site Spawner")
service = SiteSpawnerService()

@mcp.tool()
def check_domain_availability(domain: str) -> dict:
    """Check if a domain is available to buy."""
    return service.check_domain(domain)

@mcp.tool()
def buy_and_deploy_site(muscle_key: str, domain: str, provider: str = "cloudflare") -> dict:
    """Orchestrates the purchase of a domain and deployment of a muscle microsite."""
    # 1. Buy
    purchase = service.purchase_domain(domain, provider)
    if purchase.get("status") != "success":
        return {"error": "Domain purchase failed"}
    
    # 2. Deploy
    deployment = service.deploy_microsite(muscle_key, domain)
    
    return {
        "purchase": purchase,
        "deployment": deployment
    }

if __name__ == "__main__":
    mcp.run()
