import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { site_name, url_prefix, template_id, domain_id } = body;

    if (!site_name || !template_id || !domain_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Absolute path as requested
    const scriptPath = '/Users/jaynowman/dev/atoms-site-templates/dev-tools/spawn_site.py';

    const args = [
      scriptPath,
      '--site-name', site_name,
      '--template-id', template_id,
      '--domain-id', domain_id
    ];

    if (url_prefix) {
      args.push('--url-prefix', url_prefix);
    }

    console.log(`Spawning: python3 ${args.join(' ')}`);

    return new Promise((resolve) => {
        const child = spawn('python3', args);
        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0) {
                console.error(`Spawn failed with code ${code}`);
                console.error('Stderr:', stderr);
                resolve(NextResponse.json({
                    success: false,
                    error: stderr || `Process exited with code ${code}`,
                    output: stdout
                }, { status: 500 }));
            } else {
                resolve(NextResponse.json({
                    success: true,
                    message: 'Site spawned successfully',
                    output: stdout
                }));
            }
        });

        child.on('error', (err) => {
             console.error('Spawn process error:', err);
             resolve(NextResponse.json({
                    success: false,
                    error: err.message
                }, { status: 500 }));
        });
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
