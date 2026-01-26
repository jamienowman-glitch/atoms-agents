import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POINTING TO THE 'atoms-core' REPO ON THE SAME FL
const CONFIG_PATH = path.join(process.cwd(), '../atoms-core/config/domain.yaml');

export async function GET() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            return NextResponse.json({ error: 'Config file not found' }, { status: 404 });
        }
        const fileContent = fs.readFileSync(CONFIG_PATH, 'utf8');
        return NextResponse.json({ content: fileContent });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Write back to the file
        fs.writeFileSync(CONFIG_PATH, content, 'utf8');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }
}
