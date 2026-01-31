import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, category, description } = body;

        if (!name || !category) {
            return NextResponse.json(
                { error: 'Missing name or category' },
                { status: 400 }
            );
        }

        // Sanitize inputs roughly to prevent injection (though internal tool)
        const cleanName = name.replace(/[^a-zA-Z0-9_]/g, '');
        const cleanCategory = category.replace(/[^a-zA-Z0-9_]/g, '');
        const cleanDesc = (description || '').replace(/"/g, '\\"');

        // Assume atoms-muscle is a sibling of atoms-app, OR rely on a relative path from the build
        // For local dev, we are in /Users/jaynowman/dev/atoms-app
        // Script is in /Users/jaynowman/dev/atoms-muscle/scripts/scaffold_muscle.py

        // We can use absolute path for stability in local "productizing" context
        const scriptPath = '/Users/jaynowman/dev/atoms-muscle/scripts/scaffold_muscle.py';

        const command = `python3 ${scriptPath} --name ${cleanName} --category ${cleanCategory} --description "${cleanDesc}"`;

        console.log(`[ScaffoldAPI] Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stdout) {
            // Some warnings might be in stderr, check logic
            console.warn(`[ScaffoldAPI] Stderr: ${stderr}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Muscle scaffolded successfully',
            output: stdout
        });

    } catch (error: any) {
        console.error('[ScaffoldAPI] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
