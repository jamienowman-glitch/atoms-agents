import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Force dynamic to allow execution at runtime
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // Script is in /Users/jaynowman/dev/atoms-muscle/scripts/sync_muscles.py
        const scriptPath = '/Users/jaynowman/dev/atoms-muscle/scripts/sync_muscles.py';

        // Command to run the sync script
        // We assume python3 is available in the environment
        const command = `python3 ${scriptPath}`;

        console.log(`[SyncAPI] Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stdout) {
            console.warn(`[SyncAPI] Stderr: ${stderr}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Registry synced successfully',
            output: stdout
        });

    } catch (error: any) {
        console.error('[SyncAPI] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
