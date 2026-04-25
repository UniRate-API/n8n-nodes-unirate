// Copies non-TypeScript assets (SVG icons, .node.json metadata) into dist/
// so that the n8n loader can find them next to the compiled .node.js files.
const fs = require('fs');
const path = require('path');

const ROOTS = ['credentials', 'nodes', 'icons'];
const EXTENSIONS = ['.svg', '.png', '.json'];

function walk(dir, relBase) {
	if (!fs.existsSync(dir)) return;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const abs = path.join(dir, entry.name);
		const rel = path.join(relBase, entry.name);
		if (entry.isDirectory()) {
			walk(abs, rel);
			continue;
		}
		const ext = path.extname(entry.name).toLowerCase();
		if (!EXTENSIONS.includes(ext)) continue;
		// Skip tsconfig / package.json copies — only node-level metadata wanted.
		if (ext === '.json' && !entry.name.endsWith('.node.json')) continue;
		const target = path.join('dist', rel);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.copyFileSync(abs, target);
	}
}

for (const root of ROOTS) walk(root, root);

// TS build cache — useful locally, never wanted in the published tarball.
const buildInfo = path.join('dist', 'tsconfig.tsbuildinfo');
if (fs.existsSync(buildInfo)) fs.unlinkSync(buildInfo);

console.log('Assets copied to dist/');
