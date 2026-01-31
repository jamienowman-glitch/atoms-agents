import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const scriptPath = '/Users/jaynowman/dev/atoms-connectors/scripts/scan_manifests.py';

        // We need PyYAML installed in the environment.
        // If running in the agent environment it should be there.
        const command = `python3 ${scriptPath}`;

        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stdout) {
            console.warn(`[ConnectorsAPI] Stderr: ${stderr}`);
        }

        // Parse stdout JSON
        let data = [];
        try {
            data = JSON.parse(stdout);
        } catch (e) {
            console.error("Failed to parse JSON output from script:", stdout);
            throw new Error("Invalid output from scan script");
        }

        return NextResponse.json({
            success: true,
            connectors: data
        });

    } catch (error: any) {
        console.error('[ConnectorsAPI] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
