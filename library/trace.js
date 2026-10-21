// Traces a picture of white lines on black, made with an image generator, into the lines of a figure of Home's night sky, so
// that heavens.js draws the figure in the sky's own style, as thin lines with a soft glow, and not as a pasted picture:
//   node library/trace.js
// For each figure in PICTURES, it reads the picture and finds the middle line of each white line in it. It also finds the areas
// that the lines close in, such as each bough and each root, and their outlines. It writes both, as SVG paths, into
// ui-ideas/figure-art.js, which Home loads before heavens.js. heavens.js draws the middle lines as the figure's emblem, and fills
// the areas with a faint glow.
// A path is in thousandths of the figure's box, which goes from -1 to 1 across and down around the middle of the constellation:
// a point at (0.25, -1.3) is written 250 -1300. The first point of each line is absolute, and each point after it is relative
// to the point before it, which keeps the file small.
// It uses no packages: the PNG is read with Node's zlib.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'ui-ideas', 'figure-art.js');

// at is the pixel of the picture that goes at the point to of the figure's box, and unit is how much of the box one pixel is.
// ground, when a picture has one, is the row of its ground line, which is left out, because heavens.js draws its own ground.
const PICTURES = {
  algorithms: { src: 'ui-ideas/art/algorithms.png', at: [566.5, 87], to: [0.02, -1.39], unit: 0.00265 },
};

// ---------- Reading a PNG ----------
// Returns its width, its height, and how light each pixel is, from 0 for black to 1 for white. A transparent pixel counts as black.
function readPng(file) {
  const buf = fs.readFileSync(file), parts = [];
  let pos = 8, width, height, depth, type, interlace;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), kind = buf.toString('ascii', pos + 4, pos + 8), data = buf.subarray(pos + 8, pos + 8 + len);
    if (kind === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); depth = data[8]; type = data[9]; interlace = data[12]; }
    else if (kind === 'IDAT') parts.push(data);
    else if (kind === 'IEND') break;
    pos += 12 + len;
  }
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[type];
  if (depth !== 8 || !ch || interlace) throw new Error(`${file}: only 8-bit PNGs that are not interlaced can be read.`);
  const raw = zlib.inflateSync(Buffer.concat(parts)), stride = width * ch, px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)], row = y * (stride + 1) + 1;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0, b = y ? px[(y - 1) * stride + x] : 0, c = x >= ch && y ? px[(y - 1) * stride + x - ch] : 0;
      let v = raw[row + x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[y * stride + x] = v & 255;
    }
  }
  const light = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const p = i * ch, alpha = ch === 2 ? px[p + 1] / 255 : ch === 4 ? px[p + 3] / 255 : 1;
    light[i] = (ch < 3 ? px[p] / 255 : (.2126 * px[p] + .7152 * px[p + 1] + .0722 * px[p + 2]) / 255) * alpha;
  }
  return { width, height, light };
}

// ---------- The middle lines ----------
// The picture is first made twice as large, so that the middle lines come out smooth.
function doubled({ width, height, light }) {
  const W = width * 2, H = height * 2, out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const sx = Math.min(width - 1, Math.max(0, (x + .5) / 2 - .5)), sy = Math.min(height - 1, Math.max(0, (y + .5) / 2 - .5));
    const x0 = Math.floor(sx), y0 = Math.floor(sy), x1 = Math.min(width - 1, x0 + 1), y1 = Math.min(height - 1, y0 + 1), fx = sx - x0, fy = sy - y0;
    out[y * W + x] = (light[y0 * width + x0] * (1 - fx) + light[y0 * width + x1] * fx) * (1 - fy) + (light[y1 * width + x0] * (1 - fx) + light[y1 * width + x1] * fx) * fy;
  }
  return { width: W, height: H, light: out };
}
// The eight neighbors of a pixel, in order around it: up, up right, right, down right, down, down left, left, up left.
const AROUND = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
// Thins every white line to one pixel wide, down its middle, by the method of Zhang and Suen (1984): it takes away pixels from the
// edges of each line, one layer at a time, but never one whose removal would cut a line in two or shorten its end.
function thin(on, W, H) {
  const at = (x, y) => x >= 0 && y >= 0 && x < W && y < H ? on[y * W + x] : 0;
  for (let changed = true; changed;) {
    changed = false;
    for (const pass of [0, 1]) {
      const gone = [];
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        if (!on[y * W + x]) continue;
        const n = AROUND.map(([dx, dy]) => at(x + dx, y + dy)), count = n.reduce((s, v) => s + v, 0);
        if (count < 2 || count > 6) continue;
        let turns = 0; for (let i = 0; i < 8; i++) if (!n[i] && n[(i + 1) % 8]) turns++;
        if (turns !== 1) continue;
        if (pass === 0 ? n[0] * n[2] * n[4] || n[2] * n[4] * n[6] : n[0] * n[2] * n[6] || n[0] * n[4] * n[6]) continue;
        gone.push(y * W + x);
      }
      gone.forEach(i => { on[i] = 0; });
      if (gone.length) changed = true;
    }
  }
  // Thinning leaves an extra pixel at some corners of a line, where it turns a right angle. A pixel with two or more neighbors
  // that all touch each other is not needed to join them, so it is taken away.
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    if (!on[y * W + x]) continue;
    const n = AROUND.map(([dx, dy]) => on[(y + dy) * W + x + dx]);
    if (n.reduce((s, v) => s + v, 0) >= 2 && groups(n) === 1) on[y * W + x] = 0;
  }
  return on;
}
// How many separate groups the set neighbors of a pixel make. Two neighbors are in one group when they touch: neighbors next to
// each other around the pixel always touch, and so do two side neighbors with a corner between them, such as up and right.
function groups(n) {
  const parent = [0, 1, 2, 3, 4, 5, 6, 7], find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const join = (a, b) => { if (n[a] && n[b]) parent[find(a)] = find(b); };
  for (let i = 0; i < 8; i++) { join(i, (i + 1) % 8); if (i % 2 === 0) join(i, (i + 2) % 8); }
  return new Set([0, 1, 2, 3, 4, 5, 6, 7].filter(i => n[i]).map(find)).size;
}

// Follows the one-pixel lines into separate lines, each a list of points. A line starts and ends at the end of a white line or at
// a fork, where three or more lines meet. A white line that closes on itself, with no fork, is followed all the way around.
function follow(on, W, H) {
  const near = i => { const x = i % W, y = (i - x) / W, out = []; for (const [dx, dy] of AROUND) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && on[Y * W + X]) out.push(Y * W + X); } return out; };
  const degree = new Uint8Array(W * H), seen = new Uint8Array(W * H), lines = [];
  for (let i = 0; i < W * H; i++) if (on[i]) degree[i] = near(i).length;
  const node = i => degree[i] !== 2, xy = i => [i % W, Math.floor(i / W)];
  for (let i = 0; i < W * H; i++) {
    if (!on[i] || !node(i)) continue;
    for (const first of near(i)) {
      if (node(first)) { if (first > i) lines.push([xy(i), xy(first)]); continue; }
      if (seen[first]) continue;
      const line = [xy(i), xy(first)];
      seen[first] = 1;
      let prev = i, cur = first;
      for (;;) {
        const next = near(cur).find(j => j !== prev && (!seen[j] || node(j)));
        if (next === undefined) break;
        line.push(xy(next));
        if (node(next)) break;
        seen[next] = 1; prev = cur; cur = next;
      }
      lines.push(line);
    }
  }
  for (let i = 0; i < W * H; i++) {
    if (!on[i] || seen[i] || node(i)) continue;
    const line = [xy(i)]; seen[i] = 1;
    let cur = i;
    for (;;) { const next = near(cur).find(j => !seen[j]); if (next === undefined) break; seen[next] = 1; line.push(xy(next)); cur = next; }
    line.push(xy(i));
    lines.push(line);
  }
  return { lines, ends: new Set([...Array(W * H).keys()].filter(i => on[i] && degree[i] === 1).map(i => xy(i).join())) };
}

// The length of a line, and the line with every point dropped that is closer than eps to the straight line between the points
// kept around it, by the method of Ramer, Douglas, and Peucker.
const lengthOf = P => P.reduce((s, p, i) => i ? s + Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]) : 0, 0);
function simplify(P, eps) {
  if (P.length < 3) return P;
  const [ax, ay] = P[0], [bx, by] = P[P.length - 1], L = Math.hypot(bx - ax, by - ay);
  let far = 0, at = 0;
  for (let i = 1; i < P.length - 1; i++) {
    const d = L ? Math.abs((bx - ax) * (ay - P[i][1]) - (ax - P[i][0]) * (by - ay)) / L : Math.hypot(P[i][0] - ax, P[i][1] - ay);
    if (d > far) { far = d; at = i; }
  }
  return far <= eps ? [P[0], P[P.length - 1]] : [...simplify(P.slice(0, at + 1), eps).slice(0, -1), ...simplify(P.slice(at), eps)];
}

// ---------- The areas the lines close in ----------
// Every pixel that cannot be reached from the edge of the picture without crossing a line is inside an area. The lines are
// first made two pixels wider, so that a small gap in a line does not let the outside in.
function areas({ width: W, height: H, light }) {
  const line = new Uint8Array(W * H), wide = new Uint8Array(W * H), out = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) line[i] = light[i] > .25 ? 1 : 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!line[y * W + x]) continue;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && dx * dx + dy * dy <= 5) wide[Y * W + X] = 1; }
  }
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const i = stack.pop();
    if (out[i] || wide[i]) continue;
    out[i] = 1;
    const x = i % W, y = (i - x) / W;
    if (x > 0) stack.push(i - 1); if (x < W - 1) stack.push(i + 1); if (y > 0) stack.push(i - W); if (y < H - 1) stack.push(i + W);
  }
  // Inside is everything that is not outside and not part of the widened lines' outer rim.
  const inside = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) inside[i] = out[i] ? 0 : 1;
  return outlines(inside, W, H);
}
// The outlines of the inside areas, by marching squares: each square between four pixel centers adds a short segment where the
// edge of an area crosses it, and the segments are joined into closed loops. Points are in pixels.
function outlines(inside, W, H) {
  const v = (x, y) => x >= 0 && y >= 0 && x < W && y < H ? inside[y * W + x] : 0;
  const next = new Map(), key = (x, y) => `${x},${y}`;
  // Each segment goes so that the inside is on its right, which joins segments head to tail.
  const SEG = { 1: [['l', 'b']], 2: [['b', 'r']], 3: [['l', 'r']], 4: [['r', 't']], 5: [['l', 't'], ['r', 'b']], 6: [['b', 't']], 7: [['l', 't']],
    8: [['t', 'l']], 9: [['t', 'b']], 10: [['t', 'r'], ['b', 'l']], 11: [['t', 'r']], 12: [['r', 'l']], 13: [['r', 'b']], 14: [['b', 'l']] };
  for (let y = -1; y < H; y++) for (let x = -1; x < W; x++) {
    const c = v(x, y) * 8 + v(x + 1, y) * 4 + v(x + 1, y + 1) * 2 + v(x, y + 1);
    for (const [a, b] of SEG[c] || []) {
      const p = { t: [2 * x + 1, 2 * y], r: [2 * x + 2, 2 * y + 1], b: [2 * x + 1, 2 * y + 2], l: [2 * x, 2 * y + 1] };
      next.set(key(...p[a]), p[b]);
    }
  }
  const loops = [];
  for (const [start] of next) {
    if (!next.has(start)) continue;
    const loop = []; let k = start;
    while (next.has(k)) { const p = next.get(k); next.delete(k); loop.push([p[0] / 2 + .5, p[1] / 2 + .5]); k = key(...p); }
    if (loop.length > 8) loops.push(loop);
  }
  return loops;
}
// The area that a closed loop of points encloses, in square pixels.
const areaOf = P => Math.abs(P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;

// ---------- Writing ----------
function pathOf(lines, toBox, closed) {
  return lines.map(P => {
    const pts = P.map(toBox).map(([x, y]) => [Math.round(x * 1000), Math.round(y * 1000)]);
    let d = `M${pts[0][0]} ${pts[0][1]}`, last = pts[0], rel = [];
    for (const p of pts.slice(1)) { const dx = p[0] - last[0], dy = p[1] - last[1]; if (dx || dy) rel.push(`${dx} ${dy}`.replace(/ -/g, '-')); last = p; }
    return d + (rel.length ? 'l' + rel.join(' ').replace(/ -/g, '-') : '') + (closed ? 'z' : '');
  }).join('');
}

const art = {};
for (const [id, P] of Object.entries(PICTURES)) {
  const picture = readPng(path.join(ROOT, P.src));
  const toBox = ([x, y]) => [P.to[0] + (x - P.at[0]) * P.unit, P.to[1] + (y - P.at[1]) * P.unit];

  // The middle lines, found in the picture made twice as large, and given back in the picture's own pixels.
  const big = doubled(picture), on = new Uint8Array(big.width * big.height);
  for (let i = 0; i < on.length; i++) on[i] = big.light[i] > .32 ? 1 : 0;
  const { lines: found, ends } = follow(thin(on, big.width, big.height), big.width, big.height);
  // A short line with a free end is a whisker that thinning left on the side of a line, so it is left out, and so is any line
  // shorter than two pixels. So is the ground line, which heavens.js draws itself.
  const kept = found.filter(L => {
    const len = lengthOf(L) / 2, free = ends.has(L[0].join()) || ends.has(L[L.length - 1].join());
    if (len < 2 || (free && len < 3.5)) return false;
    if (P.ground && L.every(([, y]) => Math.abs(y / 2 - P.ground) < 3.5) && Math.abs(L[0][0] - L[L.length - 1][0]) / 2 > 12) return false;
    return true;
  }).map(L => simplify(L.map(([x, y]) => [x / 2, y / 2]), .45));

  // The areas, left out when they are smaller than a few pixels, or when they are a thin strip along the ground line.
  const loops = areas(picture).filter(L => areaOf(L) > 30).map(L => simplify(L, .8));

  art[id] = { lines: pathOf(kept, toBox, false), fill: pathOf(loops, toBox, true) };
  console.log(`${id}: ${kept.length} lines, ${loops.length} areas, ${((art[id].lines.length + art[id].fill.length) / 1024).toFixed(1)} KB`);
}

fs.writeFileSync(OUT, `// Written by node library/trace.js from the pictures it names. Do not change it by hand: change the picture, or trace.js, and run it again.
// For each figure: lines, the middle lines of the white lines of its picture, and fill, the outlines of the areas they close in, as
// SVG paths in thousandths of the figure's box.
const FIGURE_ART = ${JSON.stringify(art, null, 1)};
`);
console.log(`Wrote ${path.relative(ROOT, OUT)}.`);
