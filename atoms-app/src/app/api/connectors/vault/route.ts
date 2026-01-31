import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Force dynamic execution
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tenant, provider, field, value } = body;

        if (!provider || !field || !value) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const scriptPath = '/Users/jaynowman/dev/atoms-muscle/src/system/vault_writer/write_cli.py';

        // Sanitize inputs for shell safety
        // For "God Mode" internal tool we can be slightly lenient but should still quote
        const safeTenant = (tenant || 'default').replace(/"/g, '\\"');
        const safeProvider = provider.replace(/"/g, '\\"');
        const safeField = field.replace(/"/g, '\\"');
        const safeValue = value.replace(/"/g, '\\"');

        const command = `python3 ${scriptPath} --tenant "${safeTenant}" --provider "${safeProvider}" --field "${safeField}" --value "${safeValue}"`;

        console.log(`[VaultAPI] Writing secret for ${safeProvider}.${safeField}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr && stderr.includes("ERROR")) {
            throw new Error(stderr);
        }

        // Parse output to find success key
        // Output: SUCCESS: Wrote DEFAULT_SHOPIFY_API_KEY
        const successMatch = stdout.match(/SUCCESS: Wrote (.+)/);
        const keyName = successMatch ? successMatch[1] : 'Unknown';

        return NextResponse.json({
            success: true,
            key: keyName
        });

    } catch (error: any) {
        console.error('[VaultAPI] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
