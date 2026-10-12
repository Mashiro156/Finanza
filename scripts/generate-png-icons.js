import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal PNG encoder without external dependencies
function createPng(width, height, getPixelRgba) {
  // CRC table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw Scanlines: each row starts with filter byte 0
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // filter 0: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const idatCompressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', idatCompressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw Finanza icon programmatically with antialiased curves
function renderFinanzaIcon(width, height, isMaskable) {
  return createPng(width, height, (x, y, w, h) => {
    // Normalized coordinates (-1 to 1)
    const scale = isMaskable ? 0.72 : 0.88;
    const cx = w / 2;
    const cy = h / 2;
    const nx = (x - cx) / (w / 2);
    const ny = (y - cy) / (h / 2);

    // Gradient background: top-left #38bdf8 to bottom-right #0284c7 / #0369a1
    const t = Math.max(0, Math.min(1, (nx + 1 + (ny + 1)) / 4));
    let bgR = Math.round(56 * (1 - t) + 2 * t);
    let bgG = Math.round(189 * (1 - t) + 132 * t);
    let bgB = Math.round(248 * (1 - t) + 199 * t);

    if (t > 0.5) {
      const t2 = (t - 0.5) * 2;
      bgR = Math.round(2 * (1 - t2) + 3 * t2);
      bgG = Math.round(132 * (1 - t2) + 105 * t2);
      bgB = Math.round(199 * (1 - t2) + 161 * t2);
    }

    // Background shape:
    // If maskable, full bleed square (Android crops it); if standard, rounded squircle
    let bgAlpha = 255;
    if (!isMaskable) {
      // Rounded corner radius ~ 25% of size
      const r = 0.25;
      const qx = Math.abs(nx) - (1 - r);
      const qy = Math.abs(ny) - (1 - r);
      if (qx > 0 && qy > 0) {
        const dist = Math.hypot(qx, qy);
        if (dist > r) {
          const aa = Math.max(0, Math.min(1, (dist - r) / (2 / w)));
          bgAlpha = Math.round(255 * (1 - aa));
          if (bgAlpha === 0) return [0, 0, 0, 0];
        }
      } else if (Math.abs(nx) > 1 || Math.abs(ny) > 1) {
        return [0, 0, 0, 0];
      }
    }

    // Emblem space coordinates inside safe zone
    const ex = nx / scale;
    const ey = ny / scale;

    // 1. Vertical bar of "F": ex in [-0.55, -0.3], ey in [-0.55, 0.55] with rounded caps
    let inVerticalBar = false;
    const vx = ex - (-0.42);
    const vy = ey;
    const vHalfW = 0.12;
    const vHalfH = 0.52;
    const vdx = Math.abs(vx) - (vHalfW - 0.08);
    const vdy = Math.abs(vy) - (vHalfH - 0.08);
    if (vdx < 0.08 && vdy < 0.08) {
      if (vdx > 0 && vdy > 0) {
        if (Math.hypot(vdx, vdy) <= 0.08) inVerticalBar = true;
      } else {
        inVerticalBar = true;
      }
    }

    // 2. Top horizontal bar: ex in [-0.42, 0.42], ey in [-0.55, -0.31]
    let inTopBar = false;
    const tx = ex - 0.0;
    const ty = ey - (-0.43);
    const tHalfW = 0.42;
    const tHalfH = 0.12;
    const tdx = Math.abs(tx) - (tHalfW - 0.08);
    const tdy = Math.abs(ty) - (tHalfH - 0.08);
    if (tdx < 0.08 && tdy < 0.08) {
      if (tdx > 0 && tdy > 0) {
        if (Math.hypot(tdx, tdy) <= 0.08) inTopBar = true;
      } else {
        inTopBar = true;
      }
    }

    // 3. Middle bar: ex in [-0.42, 0.18], ey in [-0.15, 0.09]
    let inMidBar = false;
    const mx = ex - (-0.12);
    const my = ey - (-0.03);
    const mHalfW = 0.30;
    const mHalfH = 0.11;
    const mdx = Math.abs(mx) - (mHalfW - 0.07);
    const mdy = Math.abs(my) - (mHalfH - 0.07);
    if (mdx < 0.07 && mdy < 0.07) {
      if (mdx > 0 && mdy > 0) {
        if (Math.hypot(mdx, mdy) <= 0.07) inMidBar = true;
      } else {
        inMidBar = true;
      }
    }

    // 4. Accent Gold Coin / Dot at top right: center at (0.46, -0.43), radius 0.11
    const coinDist = Math.hypot(ex - 0.48, ey - (-0.43));
    const inCoin = coinDist <= 0.11;

    // 5. Finance curve swoosh
    let inSwoosh = false;
    if (ex >= -0.2 && ex <= 0.5 && ey >= -0.05 && ey <= 0.55) {
      // Quadratic/bezier approx curve y = 0.5 - 0.5 * ( (x - (-0.2))/0.7 )^1.5
      const prog = (ex - (-0.2)) / 0.7;
      const curveY = 0.5 - 0.45 * Math.pow(prog, 1.4);
      if (Math.abs(ey - curveY) < 0.07) {
        inSwoosh = true;
      }
    }

    if (inCoin) {
      // Warm golden yellow #facc15
      return [250, 204, 21, bgAlpha];
    }

    if (inVerticalBar || inTopBar || inMidBar || inSwoosh) {
      // Clean white #ffffff with slight gradient
      return [255, 255, 255, bgAlpha];
    }

    return [bgR, bgG, bgB, bgAlpha];
  });
}

// Generate all target sizes
const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating PWA icons...');

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), renderFinanzaIcon(192, 192, false));
console.log('✓ pwa-192x192.png');

fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), renderFinanzaIcon(512, 512, false));
console.log('✓ pwa-512x512.png');

fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), renderFinanzaIcon(512, 512, true));
console.log('✓ pwa-maskable-512x512.png');

fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), renderFinanzaIcon(180, 180, false));
console.log('✓ apple-touch-icon.png');

// Also write a 32x32 favicon.png
fs.writeFileSync(path.join(outDir, 'favicon-32x32.png'), renderFinanzaIcon(32, 32, false));
console.log('✓ favicon-32x32.png');

console.log('All PWA icons generated successfully!');
