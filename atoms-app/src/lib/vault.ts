/**
 * THE VAULT LAW:
 * We do not use process.env for secrets.
 * We fetch them from the atoms-core Vault API.
 */

const CORE_URL = "http://localhost:8000"; // Internal Docker/Local URL

export async function getSecret(keyName: string): Promise<string> {
    try {
        // Authenticate as System (This token would ideally come from a secure source or mTLS)
        // For Development Localhost, we might need a workaround or assume Core allows localhost.
        // But per spec, we call the API.
        
        const res = await fetch(`${CORE_URL}/vault/${keyName}`, {
            headers: {
                "x-system-key": "sys_god_mode_v1" // We need the system key to read the vault.
                // Wait, if we don't have env vars, where do we get the system key? 
                // Catch-22? 
                // Solution: The System Key is the ONE valid env var or file mount in the container.
                // OR: We read it from a local mount if we are server-side.
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`Vault Error ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        return data.value;
    } catch (e) {
        console.error("Vault Access Failed:", e);
        throw e;
    }
}
