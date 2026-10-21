// The sky behind the skill tree inside a constellation of Home: the Milky Way, as a person on the ground sees it on a clear
// night, rising from behind the mountains at the bottom left and crossing the sky to the top right.
// It is drawn the way a photograph of the Milky Way looks:
// - a band of glow, the light of stars too faint and too many to see one by one, brightest and widest at the galaxy's core;
// - star clouds, where the glow is brighter in patches;
// - lanes of dust along the middle of the band, which hide the light behind them and are brown at their edges, because dust
//   lets red light through more than blue;
// - a few clouds of glowing gas near the core, pink where hydrogen glows and blue where dust reflects starlight;
// - many stars, more of them inside the band, each with the color of a real star: blue-white, white, yellow, or orange;
// - a darker sky the higher it is, and a faint glow of the air low over the horizon.
// A WebGL program draws all of that once for each size of the window, onto a canvas taller and wider than the window. A second
// canvas over it draws the brightest stars, which twinkle slowly. As the tree scrolls up, toward its complex ideas, the whole sky
// moves down a quarter as far, as the sky does when a person tilts their head up. It does not move with the pointer.
// Without WebGL, Galaxy.ok is false, and the page keeps its older sky.
// index.html loads it, and calls Galaxy.show, Galaxy.size, and Galaxy.view.

const Galaxy = (() => {
  const box = document.getElementById('galaxy'), glowC = document.getElementById('mwGlow'), starC = document.getElementById('mwStars');
  const sctx = starC.getContext('2d');
  // RATIO is how far the sky moves for each pixel the tree scrolls.
  const RATIO = .25;
  let W = 0, H = 0, TX = 0, TY = 0, dpr = 1, on = false, raf = 0, last = 0, built = '', brights = [], band = null;
  const look = { x: 0, y: 0 };
  const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const SHADER = `
    precision highp float;
    uniform vec2 uSize; uniform float uDpr; uniform float uU; uniform vec2 uSeed;
    uniform vec2 uP0; uniform vec2 uDir; uniform float uBend; uniform float uCore;
    uniform vec4 uNeb[5]; uniform vec3 uNebC[5];
    float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
      return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float s = 0., a = .5;
      for (int i = 0; i < 6; i++) { s += a * noise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + vec2(3.1, 1.7); a *= .5; }
      return s;
    }
    float fbm4(vec2 p) {
      float s = 0., a = .5;
      for (int i = 0; i < 4; i++) { s += a * noise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + vec2(3.1, 1.7); a *= .5; }
      return s / .9375;
    }
    // Where a point is across the band: u along its middle line, v from that line, in pixels. The middle line bends a little.
    vec2 across(vec2 c) {
      vec2 d = c - uP0;
      float u = dot(d, uDir);
      return vec2(u, dot(d, vec2(-uDir.y, uDir.x)) - uBend * u * u / uU);
    }
    float bulgeAt(float u) { float k = (u - uCore) / uU; return exp(-k * k / .06); }
    float widthAt(float b) { return uU * mix(.085, .13, b); }
    // How many more stars there are at a point, from the band's shape alone, without its noise.
    float crowd(vec2 c) { vec2 a = across(c); float b = bulgeAt(a.x), s = widthAt(b); return exp(-a.y * a.y / (s * s * 3.)) * (.45 + .55 * b); }
    // One layer of stars: a grid of cells, each with at most one star, at a random place in it. A star is in a cell more often
    // where the band crowds them. Most stars are faint, and a few are bright.
    vec3 layer(vec2 c, float cell, float base, float boost, float seed, float grow, float lift) {
      vec2 g = floor(c / cell);
      vec3 acc = vec3(0.);
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 id = g + vec2(float(i), float(j));
        if (hash(id + seed) > base + boost * crowd((id + .5) * cell)) continue;
        vec2 at = (id + vec2(hash(id + seed + 1.7), hash(id + seed + 3.1))) * cell, o = c - at;
        float b = pow(hash(id + seed + 7.7), 5.), r = .42 + grow * b;
        float t = hash(id + seed + 9.9);
        vec3 col = t < .13 ? vec3(.66, .78, 1.) : t < .6 ? vec3(.96, .97, 1.) : t < .87 ? vec3(1., .9, .74) : vec3(1., .72, .52);
        acc += col * exp(-dot(o, o) / (r * r)) * (lift + 1.6 * b);
      }
      return acc;
    }
    void main() {
      vec2 c = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y) / uDpr, p = c / uU + uSeed;
      vec2 a = across(c);
      float u = a.x, bulge = bulgeAt(u), sig = widthAt(bulge);
      // The edges and the middle of the band wander, as the real band's do.
      vec2 w = vec2(fbm4(p * 2.3), fbm4(p * 2.3 + vec2(5.2, 1.3))) - .5;
      float v = a.y + (fbm4(vec2(u / uU * 2.4, 3.7) + uSeed) - .5) * .14 * uU + w.x * .09 * uU;
      float band = exp(-v * v / (2. * sig * sig)), wide = exp(-v * v / (2. * sig * sig * 7.));
      // Star clouds: the glow is brighter in patches, and grainy inside them.
      float cl = fbm(p * 4.4 + w * 1.6), cl2 = fbm(p * 11. + w * 2.5 + vec2(3.3, 8.1));
      float clouds = pow(smoothstep(.28, .8, cl), 1.5) * (.45 + .85 * cl2);
      // The glow stays dim, so that the ideas, their lines, and the aurora are always brighter than it.
      float glow = (band * (.62 + .38 * bulge) * (.32 + 1.15 * clouds) + wide * (.09 + .08 * bulge)) * .3;
      // Dust: a long rift down the band, a little off its middle, which splits it and breaks in a few places; a thinner lane
      // beside it; thin dark threads; and small dark clumps.
      float dn = fbm(p * 3.2 + w * 1.8 + vec2(17.1, 3.4));
      float edge = (fbm4(p * 9. + w * 3. + vec2(2.2, 7.7)) - .5) * .9;
      float rv = (v - sig * (.1 + .22 * sin(u / uU * 2.7 + 1.2))) / (sig * mix(.26, .42, bulge)) + edge;
      float rift = exp(-rv * rv * rv * rv) * smoothstep(.2, .45, fbm4(vec2(u / uU * 3.3, 8.1) + uSeed));
      float rv2 = (v + sig * (.42 + .1 * sin(u / uU * 4.3))) / (sig * .13) + edge * 1.4;
      float lane = exp(-rv2 * rv2) * smoothstep(.45, .65, fbm4(vec2(u / uU * 5.1, 2.3) + uSeed)) * .7;
      float fil = 1. - abs(2. * fbm(p * 6.5 + w * 2.6 + vec2(3.7, 11.2)) - 1.);
      float dust = max(rift * (.62 + .38 * smoothstep(.35, .6, dn)), lane);
      dust = max(dust, band * smoothstep(.88, .99, fil) * smoothstep(.42, .58, dn) * .55);
      dust = max(dust, band * smoothstep(.72, .86, fbm(p * 14. + w * 4. + vec2(9.2, 1.4))) * .4);
      // Dust is never evenly dark: thinner and thicker patches let some light through.
      dust *= .7 + .3 * smoothstep(.3, .7, fbm(p * 13. + w * 3.5 + vec2(4.4, 6.6)));
      dust = clamp(dust, 0., 1.);
      // The arms of the band are blue-white, and the core is cream, then warm yellow where it is densest.
      vec3 tint = mix(vec3(.68, .77, 1.), vec3(1., .95, .86), smoothstep(0., .55, bulge));
      tint = mix(tint, vec3(1., .82, .58), smoothstep(.35, .95, bulge * band));
      vec3 col = tint * glow;
      col *= vec3(1.) - dust * vec3(.8, .88, .96);
      // Glowing gas near the core.
      for (int i = 0; i < 5; i++) {
        vec2 o = (c - uNeb[i].xy) / uNeb[i].z;
        float shape = smoothstep(.36, .82, fbm(p * 8.5 + float(i) * 7.13 + w * 2.));
        col += uNebC[i] * exp(-dot(o, o)) * shape * uNeb[i].w * (1. - dust * .75);
      }
      // Stars too faint to see one by one make the glow grainy.
      col += tint * pow(hash(floor(gl_FragCoord.xy) + uSeed * 91.), 22.) * band * (.35 + .65 * bulge) * (.4 + clouds) * .45 * (1. - dust);
      // The sky: darker the higher it is, with a faint green glow of the air low over the horizon, and a warmer glow under it.
      float h = (uSize.y / uDpr - c.y) / uU;
      vec3 sky = mix(vec3(.02, .027, .062), vec3(.008, .011, .03), smoothstep(0., 1.3, h));
      sky += vec3(.012, .03, .024) * exp(-pow((h - .2) / .13, 2.)) + vec3(.03, .02, .028) * exp(-h / .1);
      // Few stars: about one in eight of what a long photograph shows, most of them inside the band, so that the sky feels deep
      // without filling every gap between the ideas.
      vec3 st = layer(c, 4.5, .004, .2, 11., .5, .22) + layer(c, 10., .012, .17, 23., .8, .26)
              + layer(c, 24., .035, .13, 37., 1.1, .34) + layer(c, 58., .1, .1, 53., 1.4, .45);
      // Dust hides the stars behind it too.
      st *= 1. - dust * .7;
      float clear = smoothstep(.0, .35, h);
      gl_FragColor = vec4(sky + col * mix(.6, 1., clear) + st * mix(.45, 1., clear), 1.);
    }`;

  const gl = glowC.getContext('webgl', { antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
  let prog = null;
  if (gl) {
    try {
      prog = gl.createProgram();
      [[gl.VERTEX_SHADER, 'attribute vec2 a; void main() { gl_Position = vec4(a, 0., 1.); }'], [gl.FRAGMENT_SHADER, SHADER]].forEach(([type, src]) => {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        gl.attachShader(prog, s);
      });
      gl.bindAttribLocation(prog, 0, 'a'); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    } catch (e) { console.warn('The Milky Way needs WebGL:', e.message); prog = null; }
  }
  const ok = !!prog;

  // ---------- Where the band is ----------
  // The band rises from below the bottom left corner of the canvas to past its top right corner, and bends a little toward the
  // top left. Its core is two thirds of the way along, in the upper right, where the tree has fewer ideas, and the reader sees
  // more of it as the tree scrolls up.
  function shape(cw, ch) {
    const U = Math.max(720, Math.min(1150, ch * .95));
    const p0 = [cw * .02, ch + U * .1], top = [cw * 1.02, -U * .12];
    const L = Math.hypot(top[0] - p0[0], top[1] - p0[1]), dir = [(top[0] - p0[0]) / L, (top[1] - p0[1]) / L];
    const core = L * .68, at = (u, v) => [p0[0] + dir[0] * u - dir[1] * v, p0[1] + dir[1] * u + dir[0] * v];
    // Five clouds of glowing gas: four pink, where hydrogen glows, near the core, and one pale blue, where dust reflects light.
    const neb = [[-.05, -.07, .05, .2], [.07, .06, .035, .17], [-.18, .1, .03, .13], [.16, -.12, .04, .12], [.1, .2, .045, .1]]
      .map(([du, dv, r, s]) => [...at(core + du * U, dv * U), r * U, s]);
    const nebC = [[1, .32, .48], [1, .38, .5], [.95, .3, .45], [1, .45, .55], [.45, .62, 1]];
    return { U, p0, dir, core, bend: -.03, neb, nebC };
  }
  // The same band, without its noise, for placing the bright stars.
  function crowd(c, B) {
    const d = [c[0] - B.p0[0], c[1] - B.p0[1]], u = d[0] * B.dir[0] + d[1] * B.dir[1];
    const v = -d[0] * B.dir[1] + d[1] * B.dir[0] - B.bend * u * u / B.U, k = (u - B.core) / B.U, b = Math.exp(-k * k / .06);
    const s = B.U * (.085 + .045 * b);
    return Math.exp(-v * v / (s * s * 3)) * (.45 + .55 * b);
  }

  // ---------- Drawing ----------
  function build() {
    const cw = W + TX, ch = H + TY, key = [cw, ch, dpr].join('x');
    box.style.width = cw + 'px'; box.style.height = ch + 'px';
    if (key === built) return;
    built = key;
    band = shape(cw, ch);
    [glowC, starC].forEach(c => { c.width = Math.round(cw * dpr); c.height = Math.round(ch * dpr); c.style.width = cw + 'px'; c.style.height = ch + 'px'; });
    gl.viewport(0, 0, glowC.width, glowC.height);
    gl.useProgram(prog);
    const u = n => gl.getUniformLocation(prog, n);
    gl.uniform2f(u('uSize'), glowC.width, glowC.height);
    gl.uniform1f(u('uDpr'), dpr);
    gl.uniform1f(u('uU'), band.U);
    gl.uniform2f(u('uSeed'), 7.3, 2.9);
    gl.uniform2f(u('uP0'), ...band.p0);
    gl.uniform2f(u('uDir'), ...band.dir);
    gl.uniform1f(u('uBend'), band.bend);
    gl.uniform1f(u('uCore'), band.core);
    gl.uniform4fv(u('uNeb'), band.neb.flat());
    gl.uniform3fv(u('uNebC'), band.nebC.flat());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    brights = brightStars(cw, ch);
  }
  // The brightest stars: about twenty, more of them near the band, each with a soft glow, and the four brightest with four short rays.
  const sprites = {};
  function sprite(rgb) {
    if (sprites[rgb]) return sprites[rgb];
    const N = 64, c = document.createElement('canvas'), g = c.getContext('2d'), m = N / 2;
    c.width = c.height = N;
    let gr = g.createRadialGradient(m, m, 0, m, m, m);
    gr.addColorStop(0, `rgba(${rgb},.55)`); gr.addColorStop(.12, `rgba(${rgb},.22)`); gr.addColorStop(.4, `rgba(${rgb},.05)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, N, N);
    gr = g.createRadialGradient(m, m, 0, m, m, 4.5);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, `rgba(${rgb},.9)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(m - 5, m - 5, 10, 10);
    return (sprites[rgb] = c);
  }
  function rays(rgb) {
    const key = 'r' + rgb;
    if (sprites[key]) return sprites[key];
    const N = 128, c = document.createElement('canvas'), g = c.getContext('2d'), m = N / 2;
    c.width = c.height = N;
    [[1, 0], [0, 1]].forEach(([x, y]) => {
      const gr = g.createLinearGradient(m - x * m, m - y * m, m + x * m, m + y * m);
      gr.addColorStop(0, `rgba(${rgb},0)`); gr.addColorStop(.5, `rgba(${rgb},.55)`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr;
      if (x) g.fillRect(0, m - .6, N, 1.2); else g.fillRect(m - .6, 0, 1.2, N);
    });
    return (sprites[key] = c);
  }
  function brightStars(cw, ch) {
    const r = rnd(4441), out = [];
    const colors = ['196,214,255', '236,240,255', '255,244,224', '255,226,184', '255,200,160'];
    for (let k = 0; out.length < Math.round(cw * ch / 80000) && k < 4000; k++) {
      const x = r() * cw, y = r() * ch * .94;
      if (r() > .25 + .75 * crowd([x, y], band)) continue;
      const m = Math.pow(r(), 2.6), t = r();
      out.push({ x, y, size: 9 + m * 26, a: .35 + m * .55, p: r() * 6.3, v: .25 + r() * .9, rgb: colors[t < .15 ? 0 : t < .55 ? 1 : t < .8 ? 2 : t < .93 ? 3 : 4], m });
    }
    out.sort((a, b) => b.m - a.m).slice(0, 4).forEach(s => { s.rays = true; s.size *= 1.2; });
    return out;
  }
  // The canvases move only with the tree's scroll.
  function place() { box.style.transform = `translate3d(${look.x.toFixed(2)}px,${(look.y - TY).toFixed(2)}px,0)`; }
  // Each frame, the bright stars twinkle. Stars low over the horizon twinkle more, because their light crosses more air.
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < 33) return;
    last = t;
    const ch = H + TY;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.clearRect(0, 0, starC.width / dpr, starC.height / dpr);
    for (const s of brights) {
      const low = Math.max(0, s.y / ch - .55) * 1.6;
      const a = s.a * (1 - (.18 + low * .3) * (.5 + .5 * Math.sin(s.p + t * .001 * s.v * (1 + low * 3))));
      sctx.globalAlpha = a;
      sctx.drawImage(sprite(s.rgb), s.x - s.size, s.y - s.size, s.size * 2, s.size * 2);
      if (s.rays) { const L = s.size * 1.7; sctx.globalAlpha = a * .55; sctx.drawImage(rays(s.rgb), s.x - L, s.y - L, L * 2, L * 2); }
    }
    sctx.globalAlpha = 1;
  }

  return {
    ok,
    // Shows the sky, or hides it. Its fade is in index.html's CSS.
    show(yes) {
      if (!ok) return;
      on = yes; box.classList.toggle('on', yes);
      cancelAnimationFrame(raf);
      if (yes) raf = requestAnimationFrame(frame);
    },
    // The size of the window, and how far the tree can scroll across and up. The canvases are drawn again only when a size changes.
    size(maxX, maxY) {
      if (!ok) return;
      W = innerWidth; H = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
      TX = Math.round(Math.min(W * .3, maxX * RATIO)); TY = Math.round(Math.min(H * .35, maxY * RATIO));
      build();
    },
    // Where the tree is scrolled to. At the bottom of the tree, the sky shows its lowest part, over the horizon.
    view(left, top, maxY) {
      look.x = -Math.min(TX, left * RATIO); look.y = Math.min(TY, Math.max(0, maxY - top) * RATIO);
      place();
    },
  };
})();
