// The night sky of Home: the three constellations of the library, Architecture, Language, and Algorithms, from left to right.
// Its design follows the skill menu of Skyrim. A nebula fills the sky: clouds of colored gas whose edges are lit by the light at
// the middle of each constellation, with dark dust in front of them. Around each constellation the gas has that constellation's
// colors, and more dust lies between two constellations, so each one is its own region of the sky. Each constellation has a
// figure of bright stars joined by curved lines, a drawing of its emblem behind the figure, its name with the number of its
// ideas the reader knows, a bar of how many of its ideas they know, and its areas. Nothing joins one constellation to another.
// Pointing at a constellation, or choosing it with the left and right arrow keys, lights its emblem, makes it a little larger,
// moves the sky a little toward the middle of the window, and shows what it is about at the bottom of the window. Clicking it,
// or pressing Enter, calls Heavens.onEnter with its id.
// index.html loads it after sky.js, and gives it what to draw with Heavens.draw.

const Heavens = (() => {
  const { el } = Sky;
  const box = document.getElementById('heavens');
  const canvas = document.getElementById('nebulae'), ctx = canvas.getContext('2d');
  // Two layers of SVG draw the figures. figures holds what stays still: the emblems, the lines between the stars, and the names.
  // twinkles holds what moves: the stars, which twinkle, the rings, which turn, and the lights that travel along the lines. A
  // browser draws an SVG again in full whenever anything in it moves, so the still layer, with its many blurred lines, is drawn
  // again only while a constellation is being pointed at or left, and the light layer is the only one drawn every frame.
  const svg = document.getElementById('figures'), twinkles = document.getElementById('twinkles'), hits = document.getElementById('hits');
  const about = document.getElementById('about'), title = document.getElementById('title');
  let W = 0, H = 0, dpr = 1, info = [], spots = {}, hot = null, running = false, intro = false, brights = [], defs = null, lightDefs = null, still = false;
  const state = {}, clouds = {};
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  // How far the sky has moved toward the constellation that is pointed at, in pixels.
  const pan = { x: 0, target: 0 };
  const delay = (e, ms) => { e.style.animationDelay = ms + 'ms'; return e; };
  function rnd(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  // ---------- The figures ----------
  // Each figure is drawn in a box from -1 to 1, across and down, around the middle of its constellation.
  // A star is [x, y, size], where size 1 is the brightest and 4 the faintest. An edge joins two stars, by their places in the list.
  // An edge is a straight line from one star to the other, as the lines of a star chart are, which the user chose on 2026-10-21.
  // light and second are the two colors of the constellation's gas, and rim is the color of the lit edges of the gas. gas is
  // how bright the gas is. Architecture's gas, at 1, is pale and dim, as a sky lit by the moon is, and the gas of the other two
  // is made as dim as it, because their colors are brighter and their gas is denser. look, when a figure has it, sets how
  // bright and how thick its emblem is drawn, and in what color: the opacity of its haze, its fine line, the width of that line,
  // the glow and line that show while it is pointed at, and the color of all of them.
  // A figure's emblem can be traced from a picture by library/trace.js, which writes figure-art.js; look.fill is then the opacity
  // of the glow in the areas its lines close in. place.js places the stars of a figure, and writes its stars and edges.
  const ARCH = (a, r) => [Math.cos(a * Math.PI / 180) * r, -0.12 + Math.sin(a * Math.PI / 180) * r];
  const FIGURES = {
    // A portal: two columns on two steps, an arch with a keystone, and a pediment over it. The stars are an asterism, the pattern
    // a group of real stars makes, so they are not the same on both sides: five stars go up the left column and arch, from the end
    // of the steps, and three come down the right, from a capital higher than the left one to the lower part of the column. The
    // stars differ in brightness, are unevenly spaced, and only come near the drawing. The keystone, the brightest, is a little to
    // the right of the middle, and the right end of the pediment is lower and further out than the left.
    // The colors of the stars follow two findings. A real star is only ever red, orange, yellow, white, or blue-white, the colors of
    // a hot body, and never green, violet, or pink, so stars of those colors look false. And a color next to its opposite at the
    // same strength seems to flicker at their edge, so each figure's stars are a pale color near its gas, and stand out from it by
    // being much lighter. Architecture's stars are blue-white over blue gas, as the hot blue stars of the Pleiades are inside the
    // blue dust that they light.
    architecture: {
      star: '#c2dbff', light: [44, 92, 236], second: [48, 214, 212], rim: [255, 214, 140], gas: 1, seed: 7,
      stars: [[-0.82, 1.01, 4], [-0.46, 0.9, 3], [-0.6, 0.47, 4], [-0.5, -0.06, 2], [-0.43, -0.42, 3], [0.05, -0.67, 1],
        [0.33, -0.55, 2], [0.57, -0.24, 3], [0.5, 0.74, 4],
        [-0.03, -1.12, 2], [-0.76, -0.97, 4], [0.9, -0.84, 3], [0.14, 0.3, 3]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [9, 11]],
      emblem(u) {
        // Two steps under the portal.
        u.rect(-0.96, 0.92, 0.96, 0.975); u.rect(-1.04, 0.975, 1.04, 1.03);
        // Two columns, each with a base, a shaft with two flutes, and a capital.
        [-1, 1].forEach(m => {
          u.rect(m * 0.36, 0.86, m * 0.68, 0.92);
          u.rect(m * 0.42, -0.04, m * 0.62, 0.86);
          u.line(m * 0.487, 0.02, m * 0.487, 0.8, 'fine'); u.line(m * 0.553, 0.02, m * 0.553, 0.8, 'fine');
          u.rect(m * 0.36, -0.12, m * 0.68, -0.04);
        });
        // The arch: its two curves, the stones between them, and the keystone at the top.
        u.arc(0, -0.12, 0.62, 180, 360); u.arc(0, -0.12, 0.42, 180, 360);
        for (let a = 195; a < 360; a += 15) if (a !== 270) u.line(...ARCH(a, .42), ...ARCH(a, .62), 'fine');
        u.poly([ARCH(264, .40), ARCH(261, .71), ARCH(279, .71), ARCH(276, .40)], true);
        // The entablature, and the pediment over it.
        u.rect(-0.8, -0.92, 0.8, -0.84);
        u.poly([[-0.88, -0.92], [0, -1.16], [0.88, -0.92]], true);
      },
    },
    // A pair of braces, with a bright star between them. The braces are drawn, and the stars only come near them, as the stars
    // of a sign of the zodiac come near its picture: six stars on the left and three on the right, none of them exactly on a
    // brace, unevenly spaced, joined by straight lines. look draws the braces as a wide, soft, pale band, so that they are
    // easy to see and still look different from the thin, bright, gold lines of the stars, and fainter than them. The stars are
    // gold, the color of a star like the Sun, near the gold of the gas and opposite its violet.
    language: {
      star: '#f3d58e', light: [118, 84, 250], second: [255, 196, 128], rim: [255, 236, 196], gas: .5, seed: 3,
      look: { haze: .16, fine: .2, width: 3, glow: .2, lit: .62, color: '#efe4cc' },
      stars: [[-0.44, -0.95, 3], [-0.75, -0.66, 2], [-0.64, -0.24, 4], [-0.95, 0.05, 1], [-0.66, 0.44, 3], [-0.56, 0.9, 2],
        [0.6, -0.9, 2], [0.86, -0.03, 2], [0.48, 0.95, 3],
        [0.04, -0.07, 1], [-0.24, 0.34, 4], [0.27, -0.42, 4], [0.13, 0.52, 4]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
        [6, 7], [7, 8]],
      emblem(u) {
        // The two braces.
        [1, -1].forEach(m => u.path([['M', -0.5 * m, -0.92], ['C', -0.7 * m, -0.92, -0.7 * m, -0.86, -0.7 * m, -0.7], ['L', -0.7 * m, -0.2],
          ['C', -0.7 * m, -0.06, -0.78 * m, 0, -0.9 * m, 0], ['C', -0.78 * m, 0, -0.7 * m, 0.06, -0.7 * m, 0.2], ['L', -0.7 * m, 0.7],
          ['C', -0.7 * m, 0.86, -0.7 * m, 0.92, -0.5 * m, 0.92]]));
      },
    },
    // A narrow Norway spruce, and its roots, which spread wide. The drawing is traced from a picture made with an image generator,
    // ui-ideas/art/algorithms.png, by library/trace.js, which writes it into figure-art.js: the middle lines of the picture's white
    // lines, drawn here as the emblem's lines, and the areas they close in, the boughs, the trunk, and the roots, drawn as a faint
    // glow. The picture has no ground line and no curls, which the user chose.
    // The stars are only on the roots and the trunk: the user chose that the crown has no stars. The roots are a binary tree, the
    // tree of computer science: its root, star 0, is where the trunk widens into the roots. It splits into 2 roots, then 4. The
    // outer one on the left splits again into two, and two on the right each go on to one more. Each star is near a fork or an end
    // of a root in the drawing. Star 11 is halfway up the trunk, between the roots and the lowest boughs, and joins the root. No
    // two stars are level or mirror each other.
    // The gas is green, which the user chose, and the stars, their lines, and the drawing are silver-white, as the stars are in a
    // photograph of a green aurora. Pink and then violet stars over the green were rejected.
    algorithms: {
      star: '#edf3ea', light: [52, 140, 70], second: [150, 226, 96], rim: [224, 255, 204], gas: .38, seed: 19,
      look: { haze: .05, fine: .36, width: .85, glow: .18, lit: .95, color: '#f1f5ee', fill: .1 },
      stars: [[0.019, 0.314, 1], [-0.241, 0.372, 2], [0.31, 0.415, 2], [-0.559, 0.449, 3], [-0.26, 0.595, 3], [0.247, 0.515, 3], [0.814, 0.648, 3],
        [-0.957, 0.547, 4], [-0.511, 1.093, 4], [0.228, 1.151, 4], [1.02, 0.791, 4], [0.032, 0.192, 3]],
      edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
        [3, 7], [3, 8], [5, 9], [6, 10],
        [0, 11]],
      emblem(u) {
        const A = typeof FIGURE_ART !== 'undefined' && FIGURE_ART.algorithms;
        if (!A) return;
        u.traced(A.fill, 'haze', { fill: this.look.color, 'fill-opacity': this.look.fill, stroke: 'none' });
        u.traced(A.lines);
      },
    },
  };

  // ---------- Where each constellation goes ----------
  // A figure of size S reaches 1.24 S above its middle, and its name and the lines under it end 1.4 S + 130 pixels below it.
  // Every figure starts at TOP, under the title, which is at the top of the sky. Without the title, TOP is 100 pixels from
  // the top of the window, a little below the top bar.
  // The last 84 pixels of the window are for what the pointed-at constellation is about.
  // In a wide window, the constellations are side by side in thirds of the window, each as large as its third and the height
  // allow. In a tall, narrow window, they are one above the other.
  // G is that size. The figure is drawn at S, 85% of G, around the same middle, because the user found the figures too large at
  // G. The gas and the small stars around a figure keep the size G, and so do the letters of the name and the width of the bar under it.
  let TOP = 100;
  const UNDER = 130, ABOUT = 84, SIGN = .85;
  const wide = () => W >= H * .95;
  function place() {
    const ids = info.map(c => c.id);
    if (wide()) {
      const third = W / 3, room = H - TOP - UNDER - ABOUT;
      // Height that the figures do not need is shared: 60% above them and 40% below, so they sit a little low, as the user
      // asked on 2026-10-21, when everything had looked weighted toward the top of the window.
      const G = Math.max(70, Math.min(third * .385, room / 2.64)), slack = Math.max(0, room - 2.64 * G);
      return ids.map((id, i) => ({ id, i, x: third * (i + .5), y: TOP + 1.24 * G + slack * .6, S: G * SIGN, G }));
    }
    const row = (H - TOP) / ids.length, G = Math.max(50, Math.min(W * .28, (row - UNDER) / 2.64));
    return ids.map((id, i) => ({ id, i, x: W / 2, y: TOP + row * i + 1.24 * G, S: G * SIGN, G }));
  }

  // ---------- The nebula, drawn with WebGL ----------
  // Two programs draw it. The first runs once for each size of the window. For each pixel of the sky, it works out four numbers
  // and keeps them in a texture: how dense the gas is, how brightly the edge of the gas is lit, how much dust is in front of it,
  // and which of the constellation's two colors it has. The gas is fractal noise whose input is moved by more fractal noise,
  // twice, which bends it into folds and wisps. An edge is lit where the gas gets thinner toward the middle of the nearest
  // constellation, where the light is. The second program runs every frame: it colors each pixel from those four numbers, with
  // the colors of the constellations near it, and how bright each constellation is at that moment.
  // Without WebGL, gas is null, and each constellation has a cloud drawn on the 2D canvas instead.
  const NOISE = `
    precision highp float;
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
    }`;
  // The texture keeps, for each pixel: how dense the folds of gas are, how brightly their edges are lit, how much dust is in
  // front of them, and how bright the smooth glow of gas behind the folds is.
  const FIELD = NOISE + `
    uniform vec2 uSize; uniform vec4 uBox; uniform vec3 uCon[3]; uniform float uUnit; uniform vec2 uSeed;
    float gas(vec2 p, out vec2 r) {
      vec2 q = vec2(fbm4(p), fbm4(p + vec2(5.2, 1.3)));
      r = vec2(fbm4(p + 1.5 * q + vec2(1.7, 9.2)), fbm4(p + 1.5 * q + vec2(8.3, 2.8)));
      return fbm(p + 1.7 * r);
    }
    void main() {
      vec2 c = vec2(uBox.x + gl_FragCoord.x / uSize.x * uBox.z, uBox.y + (1. - gl_FragCoord.y / uSize.y) * uBox.w);
      vec2 p = c / uUnit + uSeed, r, r2;
      // The light comes from the middle of the nearest constellation, and a little from above. near is 1 at the middle of a
      // constellation and falls to 0 away from it, so that there is always gas around each figure.
      vec2 L = vec2(0., -.3);
      float near = 0.;
      for (int i = 0; i < 3; i++) {
        vec2 o = uCon[i].xy - c, e = o / (uCon[i].z * vec2(1.25, 1.7));
        L += o / (length(o) + 1.) * exp(-dot(o, o) / (uCon[i].z * uCon[i].z * 6.));
        near = max(near, exp(-dot(e, e)));
      }
      L = normalize(L + vec2(1e-4, 0.));
      float glow = clamp(fbm4(p * .42 + vec2(7.3, 2.1)) * .8 + near * .4, 0., 1.), mask = smoothstep(.24, .66, glow);
      float d = smoothstep(.32, .78, gas(p, r)) * mask;
      float d2 = smoothstep(.32, .78, gas(p + L * .09, r2)) * mask;
      float rim = clamp((d - d2) * 3.2, 0., 1.) * smoothstep(.04, .3, d);
      float dust = smoothstep(.56, .76, fbm(p * 1.2 + r * 1.3 + vec2(11.3, 4.1))) * smoothstep(.32, .62, glow);
      gl_FragColor = vec4(d, rim, dust, glow);
    }`;
  const PAINT = `
    precision highp float;
    uniform sampler2D uField; uniform vec2 uSize; uniform vec2 uView; uniform vec2 uShift; uniform vec4 uBox;
    uniform vec4 uCon[3]; uniform vec3 uA[3]; uniform vec3 uB[3]; uniform vec3 uRim[3];
    void main() {
      vec2 c = vec2(gl_FragCoord.x / uSize.x * uView.x, (1. - gl_FragCoord.y / uSize.y) * uView.y) - uShift;
      vec4 f = texture2D(uField, vec2((c.x - uBox.x) / uBox.z, 1. - (c.y - uBox.y) / uBox.w));
      vec3 col = vec3(0.);
      float near = 0., wmax = 0., wsum = 0.;
      for (int i = 0; i < 3; i++) {
        vec2 o = (c - uCon[i].xy) / (uCon[i].z * vec2(1.4, 2.1));
        float q = dot(o, o), w = exp(-q), b = uCon[i].w;
        // The thin gas has the constellation's first color, and the dense gas its second.
        vec3 tint = mix(uA[i], uB[i], smoothstep(.2, .85, f.r * .8 + f.a * .4));
        vec3 e = tint * (smoothstep(.15, .9, f.a) * .38 + pow(f.r, 1.2) * 1.1) + uRim[i] * f.g * .65 + uB[i] * exp(-q * 3.) * (.14 + f.r * .5);
        col += e * w * b; near += w * b; wsum += w; wmax = max(wmax, w);
      }
      // Between two constellations, more dust.
      float between = clamp((1. - wmax / (wsum + 1e-4)) * 2., 0., 1.);
      float dust = clamp(f.b + between * between * (.3 + f.r * .5), 0., 1.);
      col *= 1. - dust * .82;
      float a = clamp(max(col.r, max(col.g, col.b)) + dust * min(near, 1.) * .5, 0., 1.);
      gl_FragColor = vec4(col, a);
    }`;
  const gas = (() => {
    const c = document.getElementById('gas');
    const gl = c && c.getContext('webgl', { premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) return null;
    function program(frag) {
      const p = gl.createProgram();
      [[gl.VERTEX_SHADER, 'attribute vec2 a; void main() { gl_Position = vec4(a, 0., 1.); }'], [gl.FRAGMENT_SHADER, frag]].forEach(([type, src]) => {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        gl.attachShader(p, s);
      });
      gl.bindAttribLocation(p, 0, 'a'); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      const at = {};
      return { p, u: name => name in at ? at[name] : (at[name] = gl.getUniformLocation(p, name)) };
    }
    let field, paint;
    try { field = program(FIELD); paint = program(PAINT); } catch (e) { console.warn('The nebula needs WebGL:', e.message); return null; }
    // One triangle that covers the whole canvas.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture(), fb = gl.createFramebuffer();
    // The texture covers the window and 80 pixels around it, so the sky can move without showing an edge.
    const M = 80;
    let boxCss = null, view = null, cons = null, lost = false;
    c.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; });
    const rgb = v => v.map(n => n / 255);
    return {
      get lost() { return lost; },
      // Works out the texture for a window of w by h pixels, with the constellations at list.
      build(w, h, list) {
        c.width = w; c.height = h; view = [w, h];
        boxCss = [-M, -M, w + 2 * M, h + 2 * M];
        const tw = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), w + 2 * M), th = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), h + 2 * M);
        cons = [0, 1, 2].map(i => list[i] || { x: -1e5, y: -1e5, S: 1, F: FIGURES.language });
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.viewport(0, 0, tw, th);
        gl.useProgram(field.p);
        gl.uniform2f(field.u('uSize'), tw, th);
        gl.uniform4f(field.u('uBox'), ...boxCss);
        gl.uniform3fv(field.u('uCon'), cons.flatMap(s => [s.x, s.y, s.S]));
        gl.uniform1f(field.u('uUnit'), Math.max(150, Math.min(420, (list[0] ? list[0].S : 160) * 1.5)));
        gl.uniform2f(field.u('uSeed'), 13.7, 4.2);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      },
      // Colors the sky. bright is how bright each constellation is, and shift is how far the gas has moved, in pixels.
      paint(bright, shift) {
        if (!view || lost) return;
        gl.viewport(0, 0, view[0], view[1]);
        gl.useProgram(paint.p);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(paint.u('uField'), 0);
        gl.uniform2f(paint.u('uSize'), view[0], view[1]);
        gl.uniform2f(paint.u('uView'), view[0], view[1]);
        gl.uniform2f(paint.u('uShift'), shift[0], shift[1]);
        gl.uniform4f(paint.u('uBox'), ...boxCss);
        gl.uniform4fv(paint.u('uCon'), cons.flatMap((s, i) => [s.x, s.y, s.S, (bright[i] || 0) * s.F.gas]));
        gl.uniform3fv(paint.u('uA'), cons.flatMap(s => rgb(s.F.light)));
        gl.uniform3fv(paint.u('uB'), cons.flatMap(s => rgb(s.F.second)));
        gl.uniform3fv(paint.u('uRim'), cons.flatMap(s => rgb(s.F.rim)));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      clear() { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); },
    };
  })();

  // ---------- The clouds of light, when there is no WebGL ----------
  // Each cloud is made once, as a small picture, and drawn large: light of two colors, shaped by noise, with dark lanes of dust.
  function noise(seed) {
    const N = 64, r = rnd(seed * 7919 + 1), grid = Array.from({ length: N * N }, r);
    const at = (i, j) => grid[(((j % N) + N) % N) * N + (((i % N) + N) % N)];
    const smooth = t => t * t * (3 - 2 * t);
    const value = (x, y) => {
      const i = Math.floor(x), j = Math.floor(y), fx = smooth(x - i), fy = smooth(y - j);
      const a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
      return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
    };
    return (x, y) => { let s = 0, amp = .5, f = 1; for (let o = 0; o < 5; o++) { s += value(x * f + o * 17.3, y * f) * amp; amp *= .5; f *= 2.03; } return s; };
  }
  function cloud(F) {
    const N = 220, c = document.createElement('canvas'); c.width = c.height = N;
    const g = c.getContext('2d'), img = g.createImageData(N, N);
    const shape = noise(F.seed), warpX = noise(F.seed + 11), warpY = noise(F.seed + 23), dust = noise(F.seed + 31), tint = noise(F.seed + 41);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const u = i / N * 2 - 1, v = j / N * 2 - 1;
      const x = u + (warpX(u * 1.7 + 4, v * 1.7) - .5) * .6, y = v + (warpY(u * 1.7, v * 1.7 + 8) - .5) * .6;
      const r2 = x * x + y * y;
      const fall = Math.pow(Math.max(0, 1 - r2), 1.7);
      let d = fall * Math.pow(shape(x * 2.4 + 3, y * 2.4 + 7) * 1.32, 3);
      // The noise moves the light outward too, so the light also fades to nothing between 72% and 100% of the way from the
      // middle of the picture to its edge. No light reaches an edge, so the picture never shows as a square.
      const edge = Math.min(1, Math.max(0, (1 - Math.sqrt(u * u + v * v)) / .28));
      d *= edge * edge * (3 - 2 * edge);
      d *= 1 - .78 * Math.pow(1 - Math.abs(dust(x * 3.2, y * 3.2) - .5) * 2, 9);
      const mix = Math.min(1, Math.max(0, tint(x * 2 + 1, y * 2) * 1.7 - .45 + (1 - Math.sqrt(r2)) * .35));
      const k = (j * N + i) * 4;
      for (let ch = 0; ch < 3; ch++) img.data[k + ch] = F.light[ch] + (F.second[ch] - F.light[ch]) * mix;
      img.data[k + 3] = Math.min(255, d * 290);
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  // The small stars of each constellation, more of them near its middle.
  function dustOf(F) {
    const r = rnd(F.seed * 31 + 5), gauss = () => Math.sqrt(-2 * Math.log(r() || 1e-6)) * Math.cos(2 * Math.PI * r());
    const tinted = F.light.map(v => Math.round((v + 2 * 255) / 3)).join(',');
    // The stars are sorted by color, so that each frame sets the color of the canvas only twice for a constellation.
    return Array.from({ length: 620 }, () => ({ x: gauss() * .72, y: gauss() * .86, s: .5 + r() * r() * 1.6, a: .2 + r() * .7, p: r() * 6.3, v: .4 + r() * 1.6, c: r() < .4 ? tinted : '236,236,255' }))
      .map(q => ({ ...q, fill: `rgb(${q.c})` })).sort((a, b) => a.fill < b.fill ? -1 : a.fill > b.fill ? 1 : 0);
  }
  // A picture of one bright star, made once for each color: a wide glow, a white middle, and four long rays that fade at their ends.
  const sprites = {};
  function sprite(rgb) {
    if (sprites[rgb]) return sprites[rgb];
    const N = 256, m = N / 2, c = document.createElement('canvas'); c.width = c.height = N;
    const g = c.getContext('2d');
    let gr = g.createRadialGradient(m, m, 0, m, m, m * .42);
    gr.addColorStop(0, `rgba(${rgb},.6)`); gr.addColorStop(.18, `rgba(${rgb},.2)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, N, N);
    [0, 1].forEach(across => {
      const lg = across ? g.createLinearGradient(0, m, N, m) : g.createLinearGradient(m, 0, m, N);
      lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.42, `rgba(${rgb},.5)`); lg.addColorStop(.5, 'rgba(255,255,255,1)'); lg.addColorStop(.58, `rgba(${rgb},.5)`); lg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = lg; g.beginPath();
      if (across) { g.moveTo(0, m); g.lineTo(m, m - 1.4); g.lineTo(N, m); g.lineTo(m, m + 1.4); }
      else { g.moveTo(m, 0); g.lineTo(m + 1.4, m); g.lineTo(m, N); g.lineTo(m - 1.4, m); }
      g.fill();
    });
    gr = g.createRadialGradient(m, m, 0, m, m, 9);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(m - 9, m - 9, 18, 18);
    return (sprites[rgb] = c);
  }
  // A few bright stars around the constellations, where no figure or name is.
  function brightStars() {
    const r = rnd(4111), out = [], free = (x, y) => y > 70 && y < H - ABOUT &&
      Object.values(spots).every(s => Math.abs(x - s.x) > s.S * 1.15 || y < s.y - s.S * 1.5 || y > s.y + s.S * 1.5 + 110);
    for (let k = 0; out.length < (wide() ? 11 : 6) && k < 400; k++) {
      const x = r() * W, y = r() * H, h = r();
      if (!free(x, y)) continue;
      out.push({ x, y, size: 34 + r() * r() * 90, a: .45 + r() * .5, p: r() * 6.3, v: .3 + r() * .7, c: h < .35 ? '160,200,255' : h < .55 ? '255,222,170' : '226,232,255' });
    }
    return out;
  }

  // ---------- Drawing ----------
  // info is one item for each constellation: { id, name, sub, about, ideas, known, studying }. With first, the sky lights up
  // in order: the gas, then the stars of each figure, its lines, its emblem, and its name, from left to right.
  function draw(list, first) {
    info = list; intro = !!first;
    W = innerWidth; H = innerHeight; dpr = devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    [svg, twinkles, hits].forEach(s => { s.setAttribute('viewBox', `0 0 ${W} ${H}`); s.innerHTML = ''; });
    const d = defs = Sky.defsFor(svg);
    lightDefs = Sky.defsFor(twinkles);
    const haze = el('filter', { id: 'haze', x: '-20%', y: '-20%', width: '140%', height: '140%' }, d.defs);
    el('feGaussianBlur', { stdDeviation: 4.5 }, haze);
    const bloom = el('filter', { id: 'bloom', x: '-30%', y: '-30%', width: '160%', height: '160%' }, d.defs);
    el('feGaussianBlur', { stdDeviation: 7 }, bloom);
    titled();
    spots = Object.fromEntries(place().map(s => [s.id, s]));
    const now = performance.now();
    info.forEach((c, i) => {
      const F = FIGURES[c.id];
      if (!gas && !clouds[c.id]) clouds[c.id] = cloud(F);
      state[c.id] = { glow: state[c.id] ? state[c.id].glow : 1, target: 1, t0: first ? now + 150 + i * 380 : null, dust: state[c.id] ? state[c.id].dust : dustOf(F) };
    });
    if (gas) gas.build(W, H, info.map(c => ({ ...spots[c.id], S: spots[c.id].G, F: FIGURES[c.id] })));
    brights = brightStars();
    meridians(d);
    info.forEach(c => figure(c, spots[c.id], d, lightDefs));
    // Each constellation answers the pointer anywhere in its third of the window under the title. The title answers nothing,
    // because the user did not want it to lead anywhere. The places a constellation answers in do not move with the sky, so the
    // sky moving toward a constellation never moves another one under the pointer.
    info.forEach(c => {
      const s = spots[c.id], n = info.length;
      const r = wide() ? { x: W / n * s.i, y: TOP, width: W / n, height: Math.max(0, H - TOP) } : { x: 0, y: TOP + (H - TOP) / n * s.i, width: W, height: Math.max(0, (H - TOP) / n) };
      el('rect', { ...r, fill: 'transparent', class: 'hitcon', 'data-id': c.id }, hits);
    });
    // The first time, the sky comes down into place from above, as when a person looks up at it.
    if (first) { box.classList.add('rise'); box.addEventListener('animationend', () => box.classList.remove('rise'), { once: true }); }
    setHot(hot);
    if (api.afterDraw) api.afterDraw();
  }
  // The title, Wardens of the Swift, from title.js, centered at the top of the sky, under the top bar by 3% of the window's
  // height, at least 20 pixels, because 6 pixels pressed it against the top bar. Its height is
  // 10.5% of the window's, from 60 to 115 pixels, because the user found it too large at 14%. In a wide window it is no wider
  // than 22% of the window, so the meridians beside it never reach its letters, and in a narrow one it is no wider than the
  // window less 32 pixels. The figures start under it. The header shows no title on the night sky, so the title is here once.
  // It has an SVG of its own, because a band of light crosses its letters every ten seconds, and a browser draws an SVG again in
  // full whenever anything in it moves. The first time, it fades in as the sky comes down.
  function titled() {
    if (!title || typeof Title === 'undefined') { TOP = 100; return; }
    const [, , bw, bh] = Title.box;
    const h = Math.max(60, Math.min(115, H * .105, (wide() ? W * .22 : W - 32) * bh / bw)), w = h * bw / bh;
    const top = 58 + Math.max(20, H * .03);
    Object.assign(title.style, { width: w.toFixed(1) + 'px', height: h.toFixed(1) + 'px', left: ((W - w) / 2).toFixed(1) + 'px', top: top.toFixed(1) + 'px' });
    if (!title.firstChild) { title.setAttribute('viewBox', Title.box.join(' ')); title.innerHTML = `<g class="wt">${Title.svg()}</g>`; }
    title.classList.toggle('arrive', intro);
    TOP = top + h;
  }
  // Two lines between the three constellations, from the top of the sky to the bottom, leaning toward the middle as they rise,
  // like the meridians of a star atlas, with small marks across them. They fade in from under the title, and fade out above the
  // names, so they never cross either.
  function meridians(d) {
    if (!wide()) return;
    const g = delay(el('g', { class: intro ? 'fade' : '' }, svg), intro ? 300 : 0);
    const s = Object.values(spots)[0], end = s ? s.y + s.S * 1.3 : H;
    const grad = el('linearGradient', { id: 'meridian', gradientUnits: 'userSpaceOnUse', x1: 0, y1: Math.max(64, TOP - 40), x2: 0, y2: end }, d.defs);
    [[0, 0], [.3, .11], [.75, .11], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#e6c477', 'stop-opacity': a }, grad));
    [1, 2].forEach(i => {
      const x = W * i / 3, lean = (i === 1 ? 1 : -1) * W * .02;
      const p0 = [x + lean, 64], p1 = [x - lean * .35, H * .55], p2 = [x - lean * .5, H];
      el('path', { d: `M${p0}Q${p1} ${p2}`, fill: 'none', stroke: 'url(#meridian)', 'stroke-width': .8 }, g);
      let ticks = '';
      for (let k = 1; k < 44; k++) {
        const t = k / 44, u = 1 - t;
        const qx = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], qy = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
        const tx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), ty = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]), L = Math.hypot(tx, ty) || 1;
        const nx = -ty / L, ny = tx / L, len = k % 5 ? 2.5 : 6;
        ticks += `M${(qx - nx * len).toFixed(1)} ${(qy - ny * len).toFixed(1)}L${(qx + nx * len).toFixed(1)} ${(qy + ny * len).toFixed(1)}`;
      }
      el('path', { d: ticks, stroke: 'url(#meridian)', 'stroke-width': .7 }, g);
    });
  }
  function figure(c, s, d, ld) {
    const F = FIGURES[c.id], k = Math.max(.7, s.S / 240), wait = ms => intro ? ms + s.i * 380 : 0;
    // A constellation grows and shrinks around its own middle. It has a group in each layer, and both grow and shrink together.
    const at = { class: 'con', 'data-id': c.id, style: `transform-origin:${s.x}px ${s.y}px` };
    const g = el('g', at, svg), tg = el('g', at, twinkles);
    const name = el('linearGradient', { id: 'name-' + c.id, x1: 0, y1: 0, x2: 0, y2: 1 }, d.defs);
    el('stop', { offset: 0, 'stop-color': '#fff6dc' }, name); el('stop', { offset: 1, 'stop-color': F.star }, name);
    const rule = el('linearGradient', { id: 'rule-' + c.id }, d.defs);
    [[0, .15], [.5, .9], [1, .15]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': F.star, 'stop-opacity': a }, rule));
    ring(tg, s, F);
    // The emblem, in three layers: a wide haze, a fine line, and a glowing line that shows only while the constellation is pointed
    // at. At rest, the emblem is fainter than the lines between the stars. While the constellation is pointed at, the glowing line
    // makes the emblem the brightest thing in it, and index.html fades the lines between the stars, as the user chose on 2026-10-21.
    const em = delay(el('g', { class: 'emblem' + (intro ? ' fade' : '') }, g), wait(1500));
    const E = { haze: .1, fine: .2, width: 1, glow: .3, lit: .85, color: F.star, ...F.look };
    const soft = el('g', { fill: 'none', stroke: E.color, 'stroke-opacity': E.haze, 'stroke-width': 7 * k, filter: 'url(#haze)', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, em);
    const fine = el('g', { fill: 'none', stroke: E.color, 'stroke-opacity': E.fine, 'stroke-width': E.width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, em);
    const lit = el('g', { class: 'lit' }, em);
    const litGlow = el('g', { fill: 'none', stroke: E.color, 'stroke-opacity': E.glow, 'stroke-width': (2.4 + E.width) * k, filter: 'url(#glow)', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, lit);
    const litLine = el('g', { fill: 'none', stroke: E.color, 'stroke-opacity': E.lit, 'stroke-width': E.width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, lit);
    F.emblem(painter([[soft, 'haze'], [fine, 'fine'], [litGlow, 'haze'], [litLine, 'fine']], s));
    // The lines of the figure, then its stars. Each kind of line is blurred once for the whole figure, not once for each line: a
    // faint dark line under each line keeps it clear over bright gas, then a wide bloom, a glow, and the sharp line itself.
    const stars = F.stars.map(([x, y, m]) => ({ p: [s.x + x * s.S, s.y + y * s.S], m, r: [0, 7.2, 5.2, 4, 3][m] * k }));
    const shade = el('g', { filter: 'url(#glow)' }, g), bloom = el('g', { filter: 'url(#bloom)' }, g), glow = el('g', { filter: 'url(#glow)' }, g), sharp = el('g', {}, g);
    F.edges.forEach(([a, b], j) => {
      const dd = between(stars[a], stars[b]), draw = intro ? ' draw' : '', when = wait(950 + j * 110);
      delay(el('path', { d: dd, pathLength: 1, fill: 'none', stroke: '#02030a', 'stroke-width': 6 * k, class: 'eshade' + draw }, shade), when);
      delay(el('path', { d: dd, pathLength: 1, fill: 'none', stroke: F.star, 'stroke-width': 9 * k, class: 'ebloom' + draw }, bloom), when);
      delay(el('path', { d: dd, pathLength: 1, fill: 'none', stroke: F.star, 'stroke-width': 4.5 * k, class: 'eglow' + draw }, glow), when);
      delay(el('path', { d: dd, pathLength: 1, fill: 'none', stroke: F.star, 'stroke-width': 1.5, class: 'eline' + draw }, sharp), when);
      el('path', { d: dd, fill: 'none', stroke: '#fffbe8', 'stroke-width': 1.8, 'stroke-linecap': 'round', class: 'travel' }, tg);
    });
    stars.forEach((st, j) => {
      const sg = el('g', { class: 'star', transform: `translate(${st.p[0].toFixed(1)},${st.p[1].toFixed(1)})` }, tg);
      const o = flare(sg, ld, st, F.star, c.id + j, s.S);
      if (intro) { o.classList.add('ignite'); delay(o, wait(600 + j * 85)); }
    });
    label(g, c, s, F, wait);
  }
  // A star of a figure: a wide halo of its constellation's color, a smaller white glow, and four long thin rays across it. The
  // brightest stars also have four short rays between those. The rays grow and shrink slowly, each star at its own pace. A ray
  // is never longer than 45% of the figure's size S, so the rays of a small figure stay inside it.
  function flare(g, d, st, color, key, S) {
    const { r, m } = st, o = el('g', { class: 'ig' }, g), when = -hash(key) * 6;
    el('circle', { r: r * [0, 8.5, 6.5, 5.2, 4.2][m], fill: d.halo(color, [0, 1.3, 1.1, .9, .65][m]), class: 'halo', style: `animation-delay:${when.toFixed(2)}s` }, o);
    const L = Math.min(r * [0, 15, 9.5, 6, 3.2][m], S * [0, .45, .28, .18, .1][m]);
    const rays = el('g', { class: 'rays', style: `animation-delay:${when.toFixed(2)}s;animation-duration:${(4 + hash(key + 'd') * 4).toFixed(2)}s` }, o);
    const ray = (len, w, a, turn, soft) => el('path', { d: `M${-len} 0L0 ${-w}L${len} 0L0 ${w}Z`, fill: soft ? color : '#fffdf4', opacity: a, transform: `rotate(${turn})`, ...(soft ? { filter: 'url(#soft)' } : {}) }, rays);
    [0, 90].forEach(turn => { ray(L * .8, r * .45, .35, turn, true); ray(L, r * .11, m < 4 ? .95 : .6, turn); });
    if (m === 1) [45, 135].forEach(turn => ray(L * .38, r * .08, .6, turn));
    el('circle', { r: r * 1.9, fill: d.halo('#ffffff', m < 3 ? 1.3 : .9) }, o);
    el('circle', { r, fill: 'none', stroke: color, 'stroke-width': .8, opacity: .8 }, o);
    el('circle', { r: r * .55, fill: '#fff' }, o);
    return o;
  }
  // A number from 0 to 1 that is always the same for the same text.
  function hash(text) { let h = 2166136261; for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return ((h >>> 0) % 10000) / 10000; }
  // A straight line from star A to star B, trimmed so that it starts and ends a little outside each star.
  function between(A, B) {
    const [x1, y1] = A.p, [x2, y2] = B.p, L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const a = A.r * 2.1, b = B.r * 2.1;
    return `M${(x1 + ux * a).toFixed(1)} ${(y1 + uy * a).toFixed(1)}L${(x2 - ux * b).toFixed(1)} ${(y2 - uy * b).toFixed(1)}`;
  }
  // Draws an emblem's shapes into each layer. A layer is [group, kind], and kind is 'haze' or 'fine'. A shape with only 'haze'
  // or only 'fine' is drawn only into the layers of that kind.
  function painter(layers, s) {
    const X = x => (s.x + x * s.S).toFixed(1), Y = y => (s.y + y * s.S).toFixed(1), pt = ([x, y]) => `${X(x)} ${Y(y)}`;
    const put = (tag, a, only) => layers.forEach(([g, kind]) => { if (!only || only === kind) el(tag, a, g); });
    return {
      line: (x1, y1, x2, y2, only) => put('path', { d: `M${X(x1)} ${Y(y1)}L${X(x2)} ${Y(y2)}` }, only),
      rect: (x1, y1, x2, y2, only) => put('rect', { x: X(Math.min(x1, x2)), y: Y(Math.min(y1, y2)), width: (Math.abs(x2 - x1) * s.S).toFixed(1), height: (Math.abs(y2 - y1) * s.S).toFixed(1) }, only),
      circle: (x, y, r, only) => put('circle', { cx: X(x), cy: Y(y), r: (r * s.S).toFixed(1) }, only),
      arc: (x, y, r, a0, a1, only) => {
        const p = a => [x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r];
        put('path', { d: `M${pt(p(a0))}A${(r * s.S).toFixed(1)} ${(r * s.S).toFixed(1)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(p(a1))}` }, only);
      },
      poly: (points, closed, only) => put('path', { d: 'M' + points.map(pt).join('L') + (closed ? 'Z' : '') }, only),
      path: (cmds, only) => put('path', { d: cmds.map(([c, ...v]) => c + v.map((n, i) => i % 2 ? Y(n) : X(n)).join(' ')).join('') }, only),
      // An SVG path traced by library/trace.js, in thousandths of the box. It is scaled into place, and its lines keep the width
      // of the layer's lines however much it is scaled.
      traced: (d, only, a = {}) => put('path', { d, transform: `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) scale(${(s.S / 1000).toFixed(5)})`, 'vector-effect': 'non-scaling-stroke', ...a }, only),
    };
  }
  // The ring of fine marks that turns slowly around a constellation while the pointer is on it.
  function ring(g, s, F) {
    const R = s.S * 1.32, spin = el('g', { class: 'ringspin', style: `transform-origin:${s.x}px ${s.y}px` }, el('g', { class: 'ring' }, g));
    el('circle', { cx: s.x, cy: s.y, r: R, fill: 'none', stroke: F.star, 'stroke-opacity': .3 }, spin);
    el('circle', { cx: s.x, cy: s.y, r: R + 16, fill: 'none', stroke: F.star, 'stroke-opacity': .1 }, spin);
    let ticks = '';
    for (let i = 0; i < 180; i++) {
      const a = i / 180 * Math.PI * 2, l = i % 15 ? 5 : 11;
      ticks += `M${(s.x + Math.cos(a) * R).toFixed(1)} ${(s.y + Math.sin(a) * R).toFixed(1)}L${(s.x + Math.cos(a) * (R + l)).toFixed(1)} ${(s.y + Math.sin(a) * (R + l)).toFixed(1)}`;
    }
    el('path', { d: ticks, stroke: F.star, 'stroke-opacity': .4, 'stroke-width': .7 }, spin);
    [0, 1, 2, 3].forEach(q => {
      const a = q * Math.PI / 2;
      el('text', { x: s.x + Math.cos(a) * (R + 16), y: s.y + Math.sin(a) * (R + 16) + 3.5, 'text-anchor': 'middle', fill: F.star, class: 'ring-star' }, spin).textContent = '✦';
    });
  }
  // Under the figure, as Skyrim shows a skill: the name, and after it how many of the constellation's ideas the reader knows; a
  // bar in a frame with slanted ends, filled as far as the share of its ideas they know; the areas it is made of; how many
  // ideas it has; and the study in progress, when it is in this constellation.
  function label(g, c, s, F, wait) {
    const size = Math.max(17, Math.min(30, s.G * .13)), y = s.y + s.S * 1.4 + size;
    const t = delay(el('g', { class: 'label' + (intro ? ' fade' : '') }, g), wait(1900));
    const name = el('text', { x: s.x, y, 'text-anchor': 'middle', class: 'con-name', style: `font-size:${size}px` }, t);
    el('tspan', { fill: `url(#name-${c.id})` }, name).textContent = c.name.toUpperCase();
    el('tspan', { class: 'con-skill', dx: size * .5, style: `font-size:${(size * 1.22).toFixed(1)}px` }, name).textContent = c.known;
    const bw = Math.min(230, s.G * 1.05), x0 = s.x - bw / 2, by = y + 13, inner = bw - 22;
    el('path', { d: `M${x0} ${by}H${x0 + bw}L${x0 + bw - 8} ${by + 9}H${x0 + 8}Z`, fill: 'rgba(3,5,12,.6)', stroke: `url(#rule-${c.id})`, 'stroke-width': .9, 'stroke-linejoin': 'round' }, t);
    el('path', { d: `M${x0 - 14} ${by + 4.5}l5 -4.5l5 4.5l-5 4.5zM${x0 + bw + 4} ${by + 4.5}l5 -4.5l5 4.5l-5 4.5z`, fill: 'none', stroke: F.star, 'stroke-opacity': .55, 'stroke-width': .8 }, t);
    el('rect', { x: x0 + 11, y: by + 3, width: inner, height: 3, fill: 'rgba(236,230,214,.07)' }, t);
    if (c.known && c.ideas) {
      const w = inner * c.known / c.ideas;
      el('rect', { x: x0 + 11, y: by + 2, width: w, height: 5, fill: F.star, opacity: .55, filter: 'url(#soft)' }, t);
      el('rect', { x: x0 + 11, y: by + 3, width: w, height: 3, fill: F.star }, t);
    }
    let ny = by + 32;
    if (c.sub) { el('text', { x: s.x + 1.3, y: ny, 'text-anchor': 'middle', class: 'con-sub' }, t).textContent = c.sub.toUpperCase(); ny += 19; }
    el('text', { x: s.x + 1.1, y: ny, 'text-anchor': 'middle', class: 'con-count' }, t).textContent = (c.ideas ? `${c.known} of ${c.ideas} ideas known` : 'No ideas yet').toUpperCase();
    if (c.studying) el('text', { x: s.x + 1.1, y: ny + 20, 'text-anchor': 'middle', class: 'con-study' }, t).textContent = `✦ Studying ${c.studying}`.toUpperCase();
  }

  // ---------- Pointing, the arrow keys, and clicking ----------
  // The constellation that is pointed at grows, the others shrink and dim, and the sky moves a little toward the middle of the
  // window, the near things more than the far ones. Its description shows at the bottom of the window.
  function setHot(id) {
    hot = id && spots[id] && !still ? id : null;
    box.querySelectorAll('.con').forEach(g => g.classList.toggle('hot', g.dataset.id === hot));
    box.classList.toggle('hovering', !!hot);
    info.forEach(c => { if (state[c.id]) state[c.id].target = !hot ? 1 : c.id === hot ? 1.3 : .65; });
    const target = hot && wide() ? (W / 2 - spots[hot].x) * .045 : 0;
    Sky.pan((target - pan.target) * .35);
    pan.target = target;
    const c = hot && info.find(k => k.id === hot);
    if (about) {
      if (c && c.about && wide()) { about.innerHTML = `<p></p>`; about.firstChild.textContent = c.about; about.classList.add('on'); }
      else about.classList.remove('on');
    }
  }
  hits.addEventListener('mousemove', e => {
    const r = e.target.closest('.hitcon'), id = r ? r.dataset.id : null;
    if (id !== hot) setHot(id);
  });
  hits.addEventListener('mouseleave', () => setHot(null));
  hits.addEventListener('click', e => {
    const r = e.target.closest('.hitcon');
    if (r && api.onEnter) api.onEnter(r.dataset.id);
  });
  // The left and right arrow keys choose the constellation to the left or the right, and go round from one end to the other.
  // Enter goes into the chosen constellation. Neither works while the reader is typing.
  addEventListener('keydown', e => {
    if (!running || (e.target.closest && e.target.closest('input, textarea, .ypanel'))) return;
    const ids = info.map(c => c.id), i = ids.indexOf(hot);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const step = e.key === 'ArrowLeft' ? -1 : 1;
      setHot(ids[i < 0 ? (step > 0 ? 0 : ids.length - 1) : (i + step + ids.length) % ids.length]);
      e.preventDefault();
    } else if (e.key === 'Enter' && hot && api.onEnter) api.onEnter(hot);
  });
  addEventListener('mousemove', e => { mouse.x = e.clientX - innerWidth / 2; mouse.y = e.clientY - innerHeight / 2; });
  addEventListener('resize', () => { if (running && innerWidth > 0 && innerHeight > 58) draw(info, false); });

  // ---------- Every frame: the gas and the small stars, which breathe and twinkle, and the slow drift with the pointer ----------
  // The figures move a little more than the small stars of the sky behind them, and the gas less again, which makes the sky
  // look deep.
  function frame(t) {
    if (!running) return;
    mouse.sx += (mouse.x - mouse.sx) * .04; mouse.sy += (mouse.y - mouse.sy) * .04;
    pan.x += (pan.target - pan.x) * .035;
    const px = still ? 0 : -mouse.sx, py = still ? 0 : -mouse.sy;
    svg.style.transform = twinkles.style.transform = `translate(${(px * .014 + pan.x).toFixed(2)}px,${(py * .014).toFixed(2)}px)`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    // How far each constellation has lit up, from 0 to 1, and how bright it is now.
    const lit = info.map(c => { const st = state[c.id], p = st.t0 == null ? 1 : Math.min(1, Math.max(0, (t - st.t0) / 2600)); return p * p * (3 - 2 * p); });
    const bright = info.map((c, i) => {
      const st = state[c.id];
      st.glow += (st.target - st.glow) * .05;
      return st.glow * lit[i] * (1 + .06 * Math.sin(t / 2300 + i * 2));
    });
    if (gas && !gas.lost) gas.paint(bright, [px * .007 + pan.x * .55, py * .007]);
    // The bright stars are far away, so they move least. They light up with the first constellation.
    const fade = lit.length ? lit[0] : 1;
    for (const b of brights) {
      const a = b.a * fade * (.82 + .18 * Math.sin(b.p + t * .001 * b.v)), z = b.size * (.95 + .05 * Math.sin(b.p * 2 + t * .0007 * b.v));
      ctx.globalAlpha = Math.max(0, a);
      ctx.drawImage(sprite(b.c), b.x + px * .004 + pan.x * .3 - z / 2, b.y + py * .004 - z / 2, z, z);
    }
    ctx.globalAlpha = 1;
    info.forEach((c, i) => {
      const s = spots[c.id], st = state[c.id], b = bright[i];
      if (b < .005) return;
      if (!gas || gas.lost) {
        // The cloud is drawn taller than it is wide, so the dark sky between two constellations stays dark.
        const size = s.G * 3.5 * (1 + .015 * Math.sin(t / 3300 + i)), x = s.x + px * .007, y = s.y + py * .007;
        ctx.save(); ctx.translate(x, y); ctx.rotate(.04 * Math.sin(t / 11000 + i * 1.7));
        ctx.globalAlpha = Math.min(1, .66 * b);
        ctx.drawImage(clouds[c.id] || (clouds[c.id] = cloud(FIGURES[c.id])), -size / 2, -size * .64, size, size * 1.28);
        ctx.restore(); ctx.globalAlpha = 1;
      }
      const dx = px * .01 + pan.x * .8, dy = py * .01;
      // Each small star twinkles gently, between 74% and 100% of its brightness. Its color is set once and its brightness with
      // globalAlpha, so no new text is made for each star in each frame. While another constellation is pointed at, the small
      // stars keep at least 90% of their brightness, though the gas around them dims.
      let fill = null;
      for (const q of st.dust) {
        if (q.fill !== fill) ctx.fillStyle = fill = q.fill;
        ctx.globalAlpha = Math.max(0, Math.min(1, q.a * Math.min(1.3, Math.max(b, .9 * lit[i])) * (.87 + .13 * Math.sin(q.p + t * .001 * q.v))));
        ctx.fillRect(s.x + q.x * s.G + dx - q.s / 2, s.y + q.y * s.G + dy - q.s / 2, q.s, q.s);
      }
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(frame);
  }

  const api = {
    draw,
    onEnter: null,
    // Starts and stops the drawing of every frame, so that the sky costs nothing while a constellation is open.
    start() { if (running) return; running = true; requestAnimationFrame(frame); },
    stop() {
      running = false; setHot(null); pan.x = pan.target = 0;
      svg.innerHTML = ''; twinkles.innerHTML = ''; hits.innerHTML = '';
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (gas) gas.clear();
    },
    // The middle of a constellation on the screen.
    centerOf(id) { const s = spots[id]; return s ? { x: s.x + pan.x, y: s.y } : { x: innerWidth / 2, y: innerHeight / 2 }; },
    // Every star of the three figures and every line between them, for the small copy of the sky in the instrument.
    miniature() {
      const stars = [], edges = [];
      info.forEach(c => {
        const s = spots[c.id], F = FIGURES[c.id], base = stars.length;
        F.stars.forEach(([x, y, m]) => stars.push({ x: s.x + x * s.S, y: s.y + y * s.S, r: [0, 2.6, 2, 1.6, 1.2][m], fill: F.star }));
        F.edges.forEach(([a, b]) => edges.push([base + a, base + b, F.star]));
      });
      return { stars, edges };
    },

    // For place.js. figures is FIGURES, which it changes. afterDraw, when set, is called each time the sky is drawn.
    figures: FIGURES,
    afterDraw: null,
    // The middle and the size S of a figure, in pixels of the window.
    spotOf(id) { return spots[id] || null; },
    // Keeps the figures still: they no longer move with the pointer, and nothing is pointed at.
    hold(on) { still = !!on; if (still) { setHot(null); pan.x = pan.target = 0; } },
    // Draws one figure again from FIGURES, without drawing the rest of the sky again.
    redrawFigure(id) {
      const c = info.find(k => k.id === id);
      if (!running || !c || !defs) return;
      box.querySelectorAll(`.con[data-id="${id}"]`).forEach(g => g.remove());
      ['name-', 'rule-'].forEach(p => defs.defs.querySelector(`[id="${p + id}"]`)?.remove());
      intro = false;
      figure(c, spots[id], defs, lightDefs);
      if (api.afterDraw) api.afterDraw();
    },
  };
  return api;
})();
