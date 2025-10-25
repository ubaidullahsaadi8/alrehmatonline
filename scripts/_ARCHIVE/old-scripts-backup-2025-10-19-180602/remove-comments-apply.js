
const fs = require('fs').promises;
const path = require('path');
const strip = require('strip-comments');

async function process(file) {
  try {
    let src = await fs.readFile(file, 'utf8');
    let stripped = strip(src);
    if (stripped !== src) {
      await fs.writeFile(file, stripped, 'utf8');
      console.log('Updated:', file);
    } else {
      console.log('No change:', file);
    }
  } catch (e) {
    console.error('Error', file, e.message);
  }
}

(async () => {
  const files = [
    'components/currency-selector.tsx',
    'middleware.ts'
  ].map(f => path.resolve(__dirname, '..', f));

  for (const f of files) await process(f);
})();
