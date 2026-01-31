import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// FORCE STATIC: This route reads from the filesystem, so it must be dynamic at runtime
export const dynamic = 'force-dynamic';

const ALLOWED_ROOT = '/Users/jaynowman/sites/';

export async function GET(request: NextRequest) {
    try {
        const xAtomsPath = request.headers.get('x-atoms-path');

        if (!xAtomsPath) {
            return NextResponse.json(
                { error: 'Missing x-atoms-path header' },
                { status: 400 }
            );
        }

        // Security Check: Must start with allowed root
        if (!xAtomsPath.startsWith(ALLOWED_ROOT)) {
            return NextResponse.json(
                { error: 'Forbidden: Access denied to this path' },
                { status: 403 }
            );
        }

        // Check if file exists
        if (!fs.existsSync(xAtomsPath)) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // Check if it is a file (not directory)
        const stats = fs.statSync(xAtomsPath);
        if (!stats.isFile()) {
            return NextResponse.json(
                { error: 'Path is not a file' },
                { status: 400 }
            );
        }

        const content = fs.readFileSync(xAtomsPath, 'utf-8');
        return NextResponse.json({ content });

    } catch (error) {
        console.error('[Bridge API] GET Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const xAtomsPath = request.headers.get('x-atoms-path');

        if (!xAtomsPath) {
            return NextResponse.json(
                { error: 'Missing x-atoms-path header' },
                { status: 400 }
            );
        }

        // Security Check: Must start with allowed root
        if (!xAtomsPath.startsWith(ALLOWED_ROOT)) {
            return NextResponse.json(
                { error: 'Forbidden: Access denied to this path' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (content === undefined || content === null) {
            return NextResponse.json(
                { error: 'Missing content in body' },
                { status: 400 }
            );
        }

        // Ensure directory exists (optional, but good for safety if creating new files is allowed)
        // For now, we assume we are editing existing files or creating files in existing dirs.
        const dir = path.dirname(xAtomsPath);
        if (!fs.existsSync(dir)) {
            // Strict mode: fail if dir doesn't exist? Or recursive create?
            // Let's recursive create to be helpful.
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(xAtomsPath, content, 'utf-8');

        return NextResponse.json({ success: true, path: xAtomsPath });

    } catch (error) {
        console.error('[Bridge API] POST Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
