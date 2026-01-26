export const GOD_ALLOWLIST = [
    'jamienowman@gmail.com',
    'aissistant@squared-agents.app', // For Automated Agents
    'system@atoms-fam.app'           // Future Proofing
];

export function isGodUser(email: string | undefined | null): boolean {
    if (!email) return false;
    return GOD_ALLOWLIST.includes(email);
}
