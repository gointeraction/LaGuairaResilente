import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure app/public and app/public/icons directories exist
const publicDir = path.join(__dirname, 'app', 'public');
const iconsDir = path.join(publicDir, 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

// 1. Create favicon.svg
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#1e40af"/>
  <path d="M140 340 L256 140 L372 340 Z" fill="#ffffff"/>
  <circle cx="256" cy="240" r="40" fill="#fbbf24"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
console.log('✅ Created app/public/favicon.svg');

// 2. Helper to create a valid solid color PNG using zlib
function createSolidPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(2, 9); // color type 2 (RGB)
  ihdrData.writeUInt8(0, 10); // compression method
  ihdrData.writeUInt8(0, 11); // filter method
  ihdrData.writeUInt8(0, 12); // interlace method

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type, 'ascii');
    const payload = Buffer.concat([typeBuffer, data]);
    const crc = zlib.crc32(payload);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    return Buffer.concat([len, payload, crcBuffer]);
  }

  // IDAT data (raw RGB scanlines with filter byte 0)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const offset = y * rowSize;
    rawData[offset] = 0; // filter 0 (None)
    for (let x = 0; x < width; x++) {
      rawData[offset + 1 + x * 3] = r;
      rawData[offset + 1 + x * 3 + 1] = g;
      rawData[offset + 1 + x * 3 + 2] = b;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Create PNG icons (#1e40af -> RGB: 30, 64, 175)
const png192 = createSolidPNG(192, 192, 30, 64, 175);
const png512 = createSolidPNG(512, 512, 30, 64, 175);

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), png192);
console.log('✅ Created app/public/icons/icon-192x192.png');

fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), png512);
console.log('✅ Created app/public/icons/icon-512x512.png');

fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), png192);
console.log('✅ Created app/public/icons/apple-touch-icon.png');
