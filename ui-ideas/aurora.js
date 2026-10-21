// The aurora over each branch of the skill tree inside a constellation of Home, drawn with WebGL.
// A real aurora is curtains of light high in the air. Each curtain has a bright lower edge that waves across the sky, a glowing
// body above it, and rays that rise from the edge to different heights. Where one curtain lies behind another, the two add
// their light. Its color changes with height: green low down, from oxygen, and red and violet higher up.
// Here each branch has three curtains, one behind another at different heights, in rich colors of its own: bright and nearly
// white at the lower edge, the branch's deep color in the body, and a deeper color toward red and violet at the top. The rays
// reach different heights, up to the top of the branch. The lower edges are above the mountains in places and behind them in
// others. A branch's aurora is a little brighter the more of its ideas the reader knows.
// Behind each idea, the same picture has a light shadow, shaped as a cloud of dust in space is: uneven, a little off the idea,
// stretched and turned its own way, with a ragged edge and thinner and thicker places inside. It dims the aurora and the
// galaxy behind the idea a little, so that its name is easy to read, and they still show through it.
// The aurora does not move: the user found moving curtains too distracting to read beside. skilltree.js calls Aurora.paint each
// time it draws the tree, and the aurora is drawn once, onto a canvas behind the tree's drawing, so it scrolls with the tree.
// Without WebGL, Aurora.ok is false, and skilltree.js draws its older aurora of thin rays.

const Aurora = (() => {
  const canvas = document.createElement('canvas');
  canvas.className = 'aurora-gl';
  const MAX = 6, SHADOWS = 96;
  // The colors of each branch's aurora, richer than the colors of its names: at the lower edge, in the body, and at the top.
  const PALETTE = {
    ui: ['#ff7cc4', '#ff3d9e', '#9b32ff'],
    swift: ['#7cc8ff', '#2f8cff', '#6a3dff'],
    memory: ['#7dffd0', '#1fe3a0', '#8a4dff'],
    conc: ['#d8b8ff', '#9a5cff', '#ff3d8c'],
    algo: ['#ffb0d8', '#ff5ca8', '#a03cff'],
  };
  const SHADER = `
    precision highp float;
    uniform vec2 uRes; uniform float uK; uniform vec3 uMap; uniform int uN;
    uniform vec4 uB[${MAX}]; uniform vec3 uLow[${MAX}]; uniform vec3 uMid[${MAX}]; uniform vec3 uTop[${MAX}]; uniform float uGain[${MAX}];
    uniform vec4 uS[${SHADOWS}]; uniform int uNS;
    float h1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
    float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h1(i), h1(i + 1.), f); }
    float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float n2(vec2 p) {
      vec2 i = floor(p), f = fract(p), w = f * f * (3. - 2. * f);
      return mix(mix(h2(i), h2(i + vec2(1., 0.)), w.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), w.x), w.y);
    }
    float f2(vec2 p) { return n2(p) * .55 + n2(p * 2.1 + 5.3) * .3 + n2(p * 4.3 + 1.7) * .15; }
    float f1(float x) { float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * n1(x); x = x * 2.07 + 17.1; a *= .5; } return s / .96875; }
    void main() {
      // From the canvas to the tree's own units: uMap is the tree's scale, and how far its ideas are from the canvas's corner.
      vec2 u = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / (uK * uMap.x) - uMap.yz;
      vec3 acc = vec3(0.);
      for (int i = 0; i < ${MAX}; i++) {
        if (i >= uN) break;
        vec4 B = uB[i];
        float seed = float(i) * 13.71;
        // Each branch's aurora fades out slowly at the sides of its branch, along an edge that is not straight.
        float dx = u.x - B.x, span = B.y + 90.;
        if (abs(dx) > span) continue;
        float side = 1. - smoothstep(B.y * .35, span, abs(dx) + (n1(u.y / 110. + seed) - .5) * 70.);
        float tall = B.w - B.z;
        for (int k = 0; k < 3; k++) {
          float fk = float(k), sd = seed + fk * 5.31;
          float x = u.x / 160.;
          // The lower edge is a smooth ribbon that sweeps across the branch in long curves, never jagged, so that it never looks
          // like a ridge of the mountains. The curtains behind are higher.
          float sweep = n1(x * .55 + sd) * .7 + n1(x * 1.3 + sd * 1.9) * .3;
          float edge = B.w - 40. - 70. * h1(seed + 2.) - 190. * sweep - 22. * sin(x * 2.1 + sd * 2.3) - fk * (80. + 40. * h1(sd));
          float d = edge - u.y;
          // A fold: the rays lean more the higher they are.
          float rx = u.x + d * .18 * sin(x * 1.4 + sd * 1.7);
          // Rays of different brightness, and each reaches its own height, so the top of a curtain is ragged.
          float fine = n1(rx / 4.2 + sd * 3.), wide = n1(rx / 15. + sd);
          float rays = .4 + .6 * pow(fine * .55 + wide * .45, 1.7);
          float reach = tall * (.32 + .5 * pow(n1(rx / 26. + sd * 2.3), 1.3)) * (1. - fk * .18);
          float up = max(d, 0.);
          float body = smoothstep(-2., 9., d) * (exp(-up / reach) * rays + exp(-up / (tall * .7)) * .16);
          // The lower edge is the brightest part of a curtain.
          float rim = exp(-abs(d - 3.) / 8.) * (.55 + .45 * fine);
          float I = (body + rim * .9) * side * (k == 0 ? 1. : k == 1 ? .7 : .5);
          // Nearly white at the lower edge, the deep color in the body, and the top color high up.
          float t = up / reach;
          vec3 col = mix(mix(uLow[i], vec3(1.), .15), uMid[i], smoothstep(.0, .3, t));
          col = mix(col, uTop[i], smoothstep(.45, 1.3, t));
          // Under the brightest parts of an edge, a thin pink fringe, which nitrogen gives a real aurora.
          float fringe = exp(-pow((d + 7.) / 5.5, 2.)) * .22 * fine * side * (k == 0 ? 1. : .5);
          acc += (col * I + vec3(1., .36, .62) * fringe) * uGain[i];
        }
      }
      acc = clamp(acc * .44, 0., 1.);
      // The shadows behind the ideas: each an uneven cloud of dust.
      float shade = 0.;
      for (int j = 0; j < ${SHADOWS}; j++) {
        if (j >= uNS) break;
        vec4 S = uS[j];
        vec2 o = u - S.xy;
        if (abs(o.x) > S.z * 1.7 || abs(o.y) > S.w * 1.9) continue;
        float sj = float(j) * 7.13 + 3.1;
        // Its middle is a little off the idea, and it is stretched and turned a little, each in its own way.
        o -= (vec2(h1(sj), h1(sj + 1.3)) - .5) * S.zw * .4;
        float a = (h1(sj + 2.7) - .5) * .9, c = cos(a), sn = sin(a);
        vec2 q = vec2(c * o.x - sn * o.y, sn * o.x + c * o.y) / (S.zw * (.85 + .35 * vec2(h1(sj + 4.1), h1(sj + 5.9))));
        // Noise bends its edge, so that it is ragged, and makes it thinner in places and thicker in others.
        q += (vec2(f2(u / 34. + sj), f2(u / 34. + sj + 9.2)) - .5) * .95;
        float cloud = (1. - smoothstep(.1, 1.05, length(q))) * (.45 + .55 * f2(u / 19. + sj * 2.));
        shade = max(shade, cloud);
      }
      // A light shadow: it takes away a third of the light behind the idea at most.
      float dark = shade * .34;
      float alpha = max(acc.r, max(acc.g, acc.b));
      gl_FragColor = vec4(acc * (1. - dark), alpha * (1. - dark) + dark);
    }`;

  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
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
    } catch (e) { console.warn('The aurora needs WebGL:', e.message); prog = null; }
  }
  const ok = !!prog;
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);

  // Draws the aurora once, at the back of parent. info is the size of the tree's drawing in its own units, its scale, where its
  // ideas start, each branch: its middle, half its width, the top of its aurora, the line its curtains rise from, and the share
  // of its ideas the reader knows, and the shadow behind each idea: its middle and how far it reaches across and up and down.
  // With intro, the aurora fades in.
  function paint(parent, info, intro) {
    if (!ok) return;
    parent.insertBefore(canvas, parent.firstChild);
    canvas.classList.toggle('fadein', !!intro);
    const cssW = info.W * info.scale, cssH = info.H * info.scale;
    const most = gl.getParameter(gl.MAX_VIEWPORT_DIMS), k = Math.min(1.25, devicePixelRatio || 1, most[0] / cssW, most[1] / cssH);
    canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
    canvas.width = Math.round(cssW * k); canvas.height = Math.round(cssH * k);
    const u = name => gl.getUniformLocation(prog, name);
    const B = info.branches.slice(0, MAX);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(u('uRes'), canvas.width, canvas.height);
    gl.uniform1f(u('uK'), k);
    gl.uniform3f(u('uMap'), info.scale, info.ox, info.oy);
    gl.uniform1i(u('uN'), B.length);
    gl.uniform4fv(u('uB'), B.flatMap(b => [b.cx, b.half, b.top, b.base]));
    const pal = b => PALETTE[b.id] || ['#ffffff', '#c3b0ff', '#8a4dff'];
    gl.uniform3fv(u('uLow'), B.flatMap(b => rgb(pal(b)[0])));
    gl.uniform3fv(u('uMid'), B.flatMap(b => rgb(pal(b)[1])));
    gl.uniform3fv(u('uTop'), B.flatMap(b => rgb(pal(b)[2])));
    gl.uniform1fv(u('uGain'), B.map(b => .85 + .35 * b.known));
    const S = (info.shadows || []).slice(0, SHADOWS);
    gl.uniform1i(u('uNS'), S.length);
    if (S.length) gl.uniform4fv(u('uS'), S.flatMap(s => [s.x, s.y, s.rx, s.ry]));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  return { ok, paint };
})();
