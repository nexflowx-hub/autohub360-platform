#!/usr/bin/env node
/**
 * Generates PWA/favicon PNG icons by rasterizing the AutoHub360 orbital mark
 * (ellipse ring on deep navy rounded square) — no external image dependencies.
 * Usage: node scripts/generate-icons.mjs [appDir]...
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const apps = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['apps/store', 'apps/tech'];

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** Renders the icon at `size` px. Ring = rotated ellipse band; background rounded square. */
function renderIcon(size) {
  const S = size;
  const px = Buffer.alloc(S * S * 4); // RGBA
  const bgTop = [10, 22, 40]; // #0a1628
  const bgBot = [16, 30, 51]; // #101e33
  const blue = [77, 144, 255]; // #4d90ff
  const deepBlue = [22, 89, 196]; // #1559c4
  const radius = S * 0.22;

  // rotated ellipse params (matches LogoIcon: rotate -28deg)
  const rot = (-28 * Math.PI) / 180;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  const A = S * 0.354, B = S * 0.219; // ring radii
  const band = S * 0.0677; // half ring thickness
  const cx = S / 2, cy = S / 2;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      // rounded-square mask
      const dx = Math.min(x, S - 1 - x), dy = Math.min(y, S - 1 - y);
      let inside = true;
      if (dx < radius && dy < radius) {
        const ddx = dx - radius, ddy = dy - radius;
        inside = ddx * ddx + ddy * ddy <= radius * radius;
      }
      if (!inside) {
        px[i + 3] = 0;
        continue;
      }
      // vertical gradient bg
      const t = y / S;
      let r = bgTop[0] + (bgBot[0] - bgTop[0]) * t;
      let g = bgTop[1] + (bgBot[1] - bgTop[1]) * t;
      let b = bgTop[2] + (bgBot[2] - bgTop[2]) * t;

      // inverse-rotate point into ellipse space
      const ox = x - cx, oy = y - cy;
      const ex = ox * cos - oy * sin;
      const ey = ox * sin + oy * cos;
      const norm = Math.sqrt((ex / A) ** 2 + (ey / B) ** 2);
      const dist = Math.abs(norm - 1) * Math.min(A, B); // approx distance to ring
      if (dist <= band) {
        const ringT = Math.min(1, Math.max(0, (ex / A + 1) / 2)); // gradient along major axis
        r = deepBlue[0] + (blue[0] - deepBlue[0]) * ringT;
        g = deepBlue[1] + (blue[1] - deepBlue[1]) * ringT;
        b = deepBlue[2] + (blue[2] - deepBlue[2]) * ringT;
      }
      px[i] = Math.round(r);
      px[i + 1] = Math.round(g);
      px[i + 2] = Math.round(b);
      px[i + 3] = 255;
    }
  }
  return pngEncode(px, S, S);
}

function pngEncode(px, w, h) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // scanlines with filter byte 0
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

for (const app of apps) {
  const dir = join(root, app, 'public/icons');
  mkdirSync(dir, { recursive: true });
  for (const size of [192, 512, 180]) {
    writeFileSync(join(dir, `icon-${size}.png`), renderIcon(size));
  }
  writeFileSync(join(dir, 'favicon-32.png'), renderIcon(32));
  console.log(`icons written to ${app}/public/icons`);
}
