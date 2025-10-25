



const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const strip = require('strip-comments');

const root = path.resolve(__dirname, '..');

const exts = new Set(['.ts','.tsx','.js','.mjs','.jsx','.css','.scss','.sql','.sh','.md','.html','.json','.py','.ps1','.psm1']);

const IGNORES = [
  '**/node_modules/**',
  '**/.git/**',
  '**/rotating-card-backup-remove-comments/**',
  '**/public/**',
  '**/*.png',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.gif',
  '**/*.svg',
  '**/*.wasm',
  '**/*.ico',
  '**/dist/**',
];

function isTextFile(file) {
  return exts.has(path.extname(file).toLowerCase());
}


(async () => {
  console.log('Scanning for files...');
  const files = glob.sync('**/*.*', { cwd: root, nodir: true, ignore: IGNORES });
  let changed = [];

  for (const rel of files) {
    try {
      if (!isTextFile(rel)) continue;
      const abs = path.join(root, rel);
      let src = await fs.readFile(abs, 'utf8');

      
      if (src.indexOf('\0') !== -1) continue;

      
      let stripped;
      const ext = path.extname(rel).toLowerCase();
      if (ext === '.md') {
        
        stripped = src.replace(/<!--([\s\S]*?)-->/g, '').replace(/(^\s*\n)+/g, '\n');
      } else if (ext === '.json') {
        
        stripped = strip.block(src);
        stripped = strip.line(stripped);
      } else {
        try {
          stripped = strip(src);
        } catch (e) {
          
          stripped = src
            .replace(/\/\*[\s\S]*?\*\//g, '') // block
            .replace(/(^|\n)\s*\/\/.*(?=\n|$)/g, '\n') 
            .replace(/(^|\n)\s*#\s?.*/g, '\n') 
            .replace(/(^|\n)\s*--\s?.*/g, '\n'); 
        }
      }

      
      if (stripped !== src) {
        await fs.writeFile(abs, stripped, 'utf8');
        changed.push(rel);
        console.log('Updated:', rel);
      }
    } catch (err) {
      console.error('Error processing', rel, err.message);
    }
  }

  console.log('\nSummary:');
  console.log('Files scanned:', files.length);
  console.log('Files changed:', changed.length);
  if (changed.length) {
    console.log('Sample changed files:');
    changed.slice(0, 50).forEach(f => console.log(' -', f));
  }

  console.log('\nDone. If anything looks wrong, you can restore from the backup at "rotating-card-backup-remove-comments".');
})();
