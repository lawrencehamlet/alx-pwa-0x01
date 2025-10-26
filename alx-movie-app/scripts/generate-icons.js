// Generate solid-color PNG placeholders at exact sizes using pngjs.
// Run: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const icons = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'apple-icon-152x152.png', size: 152 },
  { name: 'ms-icon-310x310.png', size: 310 },
];

icons.forEach(icon => {
  const png = new PNG({ width: icon.size, height: icon.size });
  // Fill with a simple solid color (movie-app blue) and a white diagonal to make it non-empty
  const color = { r: 0, g: 112, b: 243, a: 255 };
  for (let y = 0; y < icon.size; y++) {
    for (let x = 0; x < icon.size; x++) {
      const idx = (icon.size * y + x) << 2;
      // Draw a white diagonal stripe for visual distinction
      if (x === y || x === Math.floor(icon.size / 2) || y === Math.floor(icon.size / 2)) {
        png.data[idx] = 255;
        png.data[idx + 1] = 255;
        png.data[idx + 2] = 255;
        png.data[idx + 3] = 255;
      } else {
        png.data[idx] = color.r;
        png.data[idx + 1] = color.g;
        png.data[idx + 2] = color.b;
        png.data[idx + 3] = color.a;
      }
    }
  }

  const outPath = path.join(outDir, icon.name);
  const writeStream = fs.createWriteStream(outPath);
  png.pack().pipe(writeStream);
  writeStream.on('finish', () => console.log('Wrote', outPath));
});

console.log('Generating placeholder icons in public/icons...');
