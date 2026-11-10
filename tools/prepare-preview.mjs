import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = path.join(root, 'content');
const outputRoot = path.join(root, '.preview');
const head = await readFile(path.join(root, 'head.html'), 'utf8');

async function prepare(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const sourcePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return prepare(sourcePath);
    if (!entry.name.endsWith('.html')) return undefined;
    const source = await readFile(sourcePath, 'utf8');
    let main = source.match(/<main>([\s\S]*?)<\/main>/)?.[1];
    if (!main) throw new Error(`Missing main in ${sourcePath}`);
    const metadata = [];
    let title = source.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || 'Author guide';
    // The starter content uses canonical two-cell metadata rows, not arbitrary HTML.
    main = main.replace(
      /<div>\s*<div class="metadata">([\s\S]*?)<\/div>\s*<\/div>\s*(?=$)/,
      (match, rows) => {
        rows.replace(/<div><div>([^<]+)<\/div><div>([^<]*)<\/div><\/div>/g, (_, key, value) => {
          if (key.trim().toLowerCase() === 'title') title = value.trim();
          metadata.push(`<meta name="${key.trim().toLowerCase()}" content="${value.trim()}">`);
          return '';
        });
        return '';
      },
    );
    const relative = path.relative(sourceRoot, sourcePath);
    const destination = path.join(outputRoot, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    const page = `<!doctype html><html lang="en"><head><title>${title}</title>${head}
${metadata.join('\n')}</head><body><header></header><main>${main}</main>
<footer></footer></body></html>`;
    await Promise.all([
      writeFile(destination, page),
      writeFile(destination.replace(/\.html$/, '.plain.html'), main),
    ]);
    return undefined;
  }));
}

await prepare(sourceRoot);
console.log('Prepared local preview from content/. DA has not been changed.');
