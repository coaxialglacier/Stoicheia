// The sound of the constellation theme: quiet background music, and a sound for each move between pages. The music is the
// songs in music/, one after another, which library/music.js puts in audio/. The moves are made with the Web Audio API, with no sound files. A full page load stops
// every sound, so this script runs in sound.html, which stays open and shows the pages of Stoicheia inside an iframe.
// The moves come in two styles. Starlight is bright. Nordic has a male choir, a harp, wind, drums, horns, and large bells.
// The engine can also make music while it plays, in pieces such as Drift and Choir. The page no longer offers them.
// A move forward goes deeper, from Home to Expand to Parts to Graph and Page, and a move back goes the other way. Going forward,
// a move rises and gets brighter. Going back, it falls and gets darker. Each time a move plays, it picks other notes than the
// time before.

const Sound = (() => {
  const midi = m => 440 * Math.pow(2, (m - 69) / 12);
  const rand = (a, b) => a + Math.random() * (b - a);
  // Values that rise from 0 to peak along the curve x^power, for setValueCurveAtTime.
  const rise = (peak, power) => Float32Array.from({ length: 48 }, (_, i) => peak * Math.pow(i / 47, power));

  // The partials of a struck sound, as [ratio to the note, loudness, share of the decay time]. A higher partial decays sooner.
  // BAR is a metal bar, as in a celesta: its partials are not whole-number multiples. GLASS is near a pure tone.
  const BAR = [[1, 1, 1], [2.76, .3, .45], [5.4, .1, .22], [8.93, .04, .12]];
  const GLASS = [[1, 1, 1], [2, .18, .5], [3, .06, .3]];
  // A large bell, tuned as a church bell is: a hum an octave below the note, the note, a minor third above it, a fifth, an
  // octave, and higher partials. The minor third is what makes a large bell sound solemn.
  const CHURCH = [[.5, .5, 1], [1, 1, .75], [1.183, .55, .6], [1.506, .3, .45], [2, .5, .5], [2.514, .15, .3], [2.662, .12, .25], [3.011, .08, .2], [4.166, .05, .12]];
  // A crystal bowl: [ratio, loudness, decay in seconds, beat in Hz]. Each partial is two sine waves a few Hz apart, so its
  // loudness rises and falls that many times a second.
  const BOWL = [[1, 1, 6, .8], [2.71, .4, 3.5, 1.3], [5.15, .15, 2, 1.9], [8.43, .06, 1.1, 2.6]];

  // Chords are lists of MIDI note numbers, lowest first. 60 is middle C, and 62 is the D above it.
  // Drift: D major 9th, B minor 9th, G major 9th with a raised 11th, and A with a suspended 4th and an added 9th.
  const DRIFT = [[38, 50, 57, 61, 64, 66], [35, 47, 50, 54, 57, 61], [43, 50, 54, 57, 61], [45, 52, 57, 59, 62, 64]];
  // Orbits: each note with the period in seconds after which it plays again.
  const ORBITS = [[50, 17.9], [57, 19.7], [62, 21.3], [66, 23.6], [68, 25.9], [73, 28.1], [76, 31.4]];
  // Choir, for a male choir from C2 to C4: D minor, B-flat major, F major, and C major.
  const CHOIR = [[38, 45, 50, 53, 57], [41, 46, 50, 53, 58], [41, 48, 53, 57, 60], [36, 43, 48, 52, 55]];
  // Harp and strings, all in D Dorian, which is the notes of C major starting on D: D minor 9th, G major, C major, A minor 7th.
  const DORIAN = [[38, 45, 53, 57, 64], [43, 50, 55, 59, 62], [36, 48, 55, 60, 64], [45, 52, 55, 60, 64]];
  // Horn calls for Mountain wind, each a list of [MIDI note, length in seconds].
  const CALLS = [[[50, 1.8], [57, 2.6]], [[57, 1.4], [55, 1.2], [50, 2.8]], [[45, 1.3], [50, 1.3], [53, 1.1], [50, 2.8]], [[50, 1.5], [48, 1.2], [45, 2.8]]];
  // The chord a move uses when no music plays.
  const HOME = { stars: [50, 57, 61, 64, 66], north: [50, 57, 62, 65, 69] };

  // The first three formants of a male voice singing "oo", "oh", and "ah": the frequencies, in Hz, that the voice makes loudest
  // for that vowel. A choir's formants are wider than one singer's, and WIDTHS gives their width in Hz.
  const VOWELS = { u: [320, 800, 2300], o: [500, 850, 2500], a: [730, 1090, 2440] }, WIDTHS = [110, 130, 170], FORMANT_GAINS = [1, .5, .25];
  // Figures: a few notes in a row, as steps through the notes of a chord, counted from a starting note. Each one ends higher
  // than it starts. Played in reverse, it ends lower.
  const FIGURES = [[0, 1, 2, 3], [0, 2, 3, 4], [0, 1, 3], [1, 2, 4], [0, 2, 1, 3], [0, 1, 2, 4], [0, 3, 4]];
  // The notes from lo to hi that belong to the chord ch, in any octave.
  function tones(ch, lo, hi) {
    const pcs = new Set(ch.map(m => m % 12)), r = [];
    for (let m = lo; m <= hi; m++) if (pcs.has(m % 12)) r.push(m);
    return r;
  }

  // The impulse response of the reverb: noise that fades out over `seconds`. High frequencies fade sooner than low ones, so the
  // end of the tail is darker than its start. With backwards, it is reversed, so it grows louder and brighter, then stops.
  function impulse(ctx, seconds, backwards) {
    const sr = ctx.sampleRate, n = Math.round(sr * seconds), b = ctx.createBuffer(2, n, sr), pre = Math.round(sr * .015);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c); let y = 0;
      for (let i = pre; i < n; i++) {
        const p = i / n, a = .9 - .82 * p;
        y += (Math.random() * 2 - 1 - y) * a;
        d[i] = y / Math.sqrt(a / (2 - a)) * Math.exp(-7 * p) * Math.min(1, (i - pre) / (sr * .008));
      }
      if (backwards) d.reverse();
    }
    return b;
  }

  // Builds every sound on one audio context. Sound.render also builds it on an OfflineAudioContext, to measure it.
  function engine(ctx) {
    // master is the last gain before the speakers, so it turns every sound on or off at once.
    const comp = ctx.createDynamicsCompressor(), master = ctx.createGain();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .4;
    comp.connect(master); master.connect(ctx.destination);
    const room = impulse(ctx, 5.5), back = impulse(ctx, .8, true);
    // A bus takes dry sound and sound for the reverb. Both go through a low-pass filter and the bus's volume, to out.
    function bus(out) {
      const dry = ctx.createGain(), wet = ctx.createGain(), verb = ctx.createConvolver(), tone = ctx.createBiquadFilter(), vol = ctx.createGain();
      verb.buffer = room; tone.type = 'lowpass'; tone.frequency.value = 18000; tone.Q.value = .5;
      dry.connect(tone); wet.connect(verb); verb.connect(tone); tone.connect(vol); vol.connect(out);
      return { dry, wet, tone, vol };
    }
    // Only the moves go through the compressor. A compressor turns down everything that goes through it while a loud sound
    // plays, so music that went through it too would get quieter each time a move plays.
    const music = bus(master), moves = bus(comp);
    const noise = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = noise.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }

    // The output of one sound: a gain for its volume over time, a pan from left (-1) to right (1), and a send that sets how
    // much of it goes to the reverb. to is a bus, or the two outputs of a piece of music.
    function outlet(to, pan = 0, wet = .4, level = 0) {
      const g = ctx.createGain(), p = ctx.createStereoPanner(), w = ctx.createGain();
      g.gain.value = level; p.pan.value = Math.max(-1, Math.min(1, pan)); w.gain.value = wet;
      g.connect(p); p.connect(to.dry); p.connect(w); w.connect(to.wet);
      return g;
    }
    // An oscillator from t to end, or with no end until it is stopped. done disconnects the nodes once the last one has ended.
    function osc(type, f, t, end, into, detune = 0) {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = detune;
      o.connect(into); o.start(t); if (end) o.stop(end); return o;
    }
    const done = (o, ...nodes) => { o.onended = () => nodes.forEach(n => n.disconnect()); };
    // Calls fn at time t, by the audio clock, so it also works when the sound is rendered faster than real time.
    function after(t, fn) {
      const k = ctx.createConstantSource(); k.offset.value = 0; k.connect(ctx.destination);
      k.start(ctx.currentTime); k.stop(Math.max(t, ctx.currentTime + .01)); k.onended = () => { k.disconnect(); fn(); };
    }
    // Moves param toward v from time t, covering 63% of the distance every tc seconds. It starts from whatever value param has
    // at t, so a new glide can begin in the middle of another without a jump.
    function glide(param, v, t, tc) { param.cancelScheduledValues(t); param.setTargetAtTime(v, t, tc); }
    // A gain that rises from 0 to amp over up seconds, stays for hold, and falls to 0 over down.
    function envelope(g, t, up, hold, down, amp) {
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + up); g.gain.setValueAtTime(amp, t + up + hold); g.gain.linearRampToValueAtTime(0, t + up + hold + down);
    }
    // Vibrato on the oscillator o: its pitch moves up and down by cents, rate times a second, starting at t and growing over 1.5 s.
    function vibrato(o, t, end, rate, cents) {
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(cents, t + 1.5); g.connect(o.detune);
      osc('sine', rate, t, end, g);
    }

    // Picks one of n choices for key, never the one that key got last time, so a sound never plays the same notes twice in a row.
    const lastPick = {};
    function vary(key, n) { let i; do i = Math.floor(Math.random() * n); while (n > 1 && i === lastPick[key]); return lastPick[key] = i; }
    // A figure on the notes of the chord ch between lo and hi: going up when dir is 1, and down when dir is -1.
    function figure(key, ch, dir, lo, hi) {
      const ts = tones(ch, lo, hi), f = FIGURES[vary(key, FIGURES.length)], span = Math.max(...f);
      const s = Math.floor(Math.random() * Math.max(1, ts.length - span)), notes = f.map(i => ts[Math.min(ts.length - 1, s + i)]);
      return dir > 0 ? notes : notes.reverse();
    }

    // ---------- Instruments ----------
    // A struck note at f: one sine wave for each partial, each with its own decay. It goes into o.node, or to its own outlet.
    function bell(f, t, amp, o) {
      const { partials = GLASS, decay = 3, attack = .004 } = o;
      const out = o.node || outlet(o.to, o.pan, o.wet, 1);
      let last;
      for (const [r, a, d] of partials) {
        if (f * r > 18000) continue;
        const g = ctx.createGain(); g.connect(out);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a * amp, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + attack + decay * d);
        const s = osc('sine', f * r, t, t + attack + decay * d + .02, g);
        if (!last) { last = s; done(s, ...(o.node ? [g] : [g, out])); } else done(s, g);
      }
    }
    // A sine wave that fades in over up seconds, stays for hold, and fades out over down.
    function swell(f, t, up, hold, down, to, pan, wet, amp) {
      const out = outlet(to, pan, wet); envelope(out, t, up, hold, down, amp);
      done(osc('sine', f, t, t + up + hold + down + .05, out), out);
    }
    // Noise through a filter whose frequency glides from f0 to f1 over dur. By default its loudness rises along the same curve
    // as the stars stretch on the screen, x^2.2, then fades in 0.12 s. With shape 'fall', it starts loud and fades out over
    // dur. With shape 'arc', it is loudest at 40% of dur, so the middle of the glide is heard most.
    function whoosh(t, dur, type, f0, f1, q, peak, pan, wet, shape) {
      const src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), out = outlet(moves, pan, wet);
      src.buffer = noise; src.loop = true; fl.type = type; fl.Q.value = q;
      fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
      if (shape === 'fall') { out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(peak, t + .08); out.gain.exponentialRampToValueAtTime(.0001, t + dur); }
      else if (shape === 'arc') { out.gain.setValueCurveAtTime(Float32Array.from({ length: 48 }, (_, i) => peak * Math.pow(Math.sin(Math.PI * Math.pow(i / 47, .75)), 1.5)), t, dur); }
      else { out.gain.setValueCurveAtTime(rise(peak, 2.2), t, dur * .92); out.gain.linearRampToValueAtTime(0, t + dur + .12); }
      src.connect(fl); fl.connect(out); src.start(t, rand(0, 1.5)); src.stop(t + dur + .2); done(src, fl, out);
    }
    // One note of a slow chord: two sawtooth waves 12 cents apart, through a low-pass filter that keeps their lowest three
    // harmonics. It fades in over 5 seconds, stays for hold, and fades out over 7.
    function padNote(f, t, hold, to, pan, amp) {
      const out = outlet(to, pan, .55), lp = ctx.createBiquadFilter(), end = t + 5 + hold + 7;
      lp.type = 'lowpass'; lp.frequency.value = Math.min(1400, f * 3); lp.Q.value = .3; lp.connect(out);
      envelope(out, t, 5, hold, 7, amp);
      osc('sawtooth', f, t, end, lp, -6); done(osc('sawtooth', f, t, end, lp, 6), lp, out);
    }
    // A male choir singing the notes ms. Each note is sung by three voices, sawtooth waves 9 cents apart, each with its own
    // vibrato. Their sum goes through three band-pass filters at the formants of a vowel, which makes it sound sung. The
    // filters move from each vowel in o.vowels to the next over up + hold, which changes the vowel being sung. With o.bend,
    // every note starts that many semitones away from its pitch and slides to it over up. A low-pass filter after them keeps
    // frequencies below 5000 Hz. With o.lp, as [from, to] in Hz, its cutoff moves over up, so the choir gets brighter or darker.
    function choir(ms, t, [up, hold, down], o) {
      const end = t + up + hold + down, out = outlet(o.to, o.pan, o.wet ?? .6), sum = ctx.createGain(), vs = (o.vowels || ['o']).map(v => VOWELS[v]);
      const lp = ctx.createBiquadFilter(), [c0, c1] = o.lp || [5000, 5000];
      lp.type = 'lowpass'; lp.Q.value = .5; lp.frequency.setValueAtTime(c0, t); lp.frequency.exponentialRampToValueAtTime(c1, t + up); lp.connect(out);
      envelope(out, t, up, hold, down, o.amp);
      for (let i = 0; i < 3; i++) {
        const bp = ctx.createBiquadFilter(), g = ctx.createGain();
        bp.type = 'bandpass'; bp.Q.value = vs[0][i] / WIDTHS[i]; bp.frequency.setValueAtTime(vs[0][i], t);
        vs.slice(1).forEach((v, k) => bp.frequency.linearRampToValueAtTime(v[i], t + (up + hold) * (k + 1) / (vs.length - 1)));
        g.gain.value = FORMANT_GAINS[i] * 4; sum.connect(bp); bp.connect(g); g.connect(lp);
      }
      // A little breath: noise through the same formants.
      const air = ctx.createBufferSource(), ag = ctx.createGain(); air.buffer = noise; air.loop = true; ag.gain.value = .25;
      air.connect(ag); ag.connect(sum); air.start(t, rand(0, 1.5)); air.stop(end + .05);
      for (const m of ms) for (const cents of [-9, 0, 9]) {
        const c = cents + rand(-3, 3), s = osc('sawtooth', midi(m), t, end + .05, sum, c);
        if (o.bend) { s.detune.setValueAtTime(c + o.bend * 100, t); s.detune.linearRampToValueAtTime(c, t + up * .85); }
        vibrato(s, t + .3, end + .05, rand(4.6, 5.4), 7);
      }
      after(end + .15, () => out.disconnect());
    }
    // A plucked harp string, made once for each note and kept, with the Karplus-Strong method: one period of noise is played
    // again and again, each time averaged with itself one sample later. That removes the high frequencies first, as a plucked
    // string does, and the note fades out over 3 seconds. The period is a whole number of samples, so playbackRate corrects
    // the pitch.
    const strings = {};
    function string(m) {
      if (strings[m]) return strings[m];
      const sr = ctx.sampleRate, f = midi(m), N = Math.max(2, Math.round(sr / f - .5)), len = Math.round(sr * 3.2);
      const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0), rho = Math.pow(.001, 1 / (sr * 3));
      let y = 0, mean = 0;
      for (let i = 0; i < N; i++) { y += (Math.random() * 2 - 1 - y) * .45; d[i] = y; mean += y / N; }
      for (let i = 0; i < N; i++) d[i] -= mean;
      d[N] = d[0] * rho;
      for (let i = N + 1; i < len; i++) d[i] = rho * .5 * (d[i - N] + d[i - N - 1]);
      return strings[m] = { b, rate: f * (N + .5) / sr };
    }
    // With o.lp, the string goes through a low-pass filter at that frequency, which makes it softer and darker.
    function harp(m, t, amp, o) {
      const s = string(m), src = ctx.createBufferSource(), out = outlet(o.to, o.pan, o.wet ?? .55, amp);
      src.buffer = s.b; src.playbackRate.value = s.rate; src.start(t);
      if (!o.lp) { src.connect(out); return done(src, out); }
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.lp; lp.Q.value = .5;
      src.connect(lp); lp.connect(out); done(src, lp, out);
    }
    // One note of a string section: three sawtooth waves 9 cents apart, each with its own vibrato, through a low-pass filter.
    // It fades in over 4 seconds, stays for hold, and fades out over 6.
    function bowed(m, t, hold, to, pan, amp) {
      const f = midi(m), end = t + 4 + hold + 6, out = outlet(to, pan, .6), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = Math.min(2400, f * 6); lp.Q.value = .4; lp.connect(out);
      envelope(out, t, 4, hold, 6, amp);
      let last;
      for (const c of [-9, 0, 9]) { last = osc('sawtooth', f, t, end, lp, c + rand(-2, 2)); vibrato(last, t + 1, end, rand(4.6, 5.4), 6); }
      done(last, lp, out);
    }
    // A low drum, such as a timpani: sine waves at f and at 1.5 and 2 times f, whose pitch falls from 1.6 times that to it in
    // 0.1 s, with a burst of low-passed noise for the hit on the skin. The higher partials die sooner.
    function drum(f, t, amp, o) {
      const decay = o.decay || 1.4, out = outlet(o.to, o.pan, o.wet ?? .5, amp);
      for (const [r, a, d] of [[1, 1, 1], [1.5, .35, .5], [2, .2, .3]]) {
        const g = ctx.createGain(), s = osc('sine', f * r * 1.6, t, t + decay * d + .05, g); g.connect(out);
        s.frequency.setValueAtTime(f * r * 1.6, t); s.frequency.exponentialRampToValueAtTime(f * r, t + .1);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + decay * d);
      }
      const src = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), ng = ctx.createGain();
      src.buffer = noise; lp.type = 'lowpass'; lp.frequency.value = 700; src.connect(lp); lp.connect(ng); ng.connect(out);
      ng.gain.setValueAtTime(.5, t); ng.gain.exponentialRampToValueAtTime(.001, t + .09); src.start(t, rand(0, 1.5)); src.stop(t + .12);
      after(t + decay + .1, () => out.disconnect());
    }
    // A horn: three sawtooth waves a few cents apart, through a low-pass filter that opens as the note swells and closes as it
    // fades, because a brass note gets brighter when it is played louder. o.bright is how far the filter opens, in Hz.
    function horn(m, t, up, hold, down, amp, o) {
      const end = t + up + hold + down, out = outlet(o.to, o.pan, o.wet ?? .6), lp = ctx.createBiquadFilter(), bright = o.bright || 1300;
      lp.type = 'lowpass'; lp.Q.value = .8; lp.connect(out);
      lp.frequency.setValueAtTime(220, t); lp.frequency.linearRampToValueAtTime(bright, t + up); lp.frequency.setValueAtTime(bright, t + up + hold); lp.frequency.linearRampToValueAtTime(250, end);
      envelope(out, t, up, hold, down, amp);
      let last;
      for (const c of [-6, 0, 6]) { last = osc('sawtooth', midi(m), t, end + .02, lp, c + rand(-2, 2)); vibrato(last, t + up, end + .02, rand(4.8, 5.4), 4); }
      done(last, lp, out);
    }
    // Wind: noise through a band-pass filter whose frequency and loudness wander. Every 2 to 5 seconds each one starts to move
    // toward a new random value. A second, narrower filter adds a faint whistle that wanders the same way. It returns a fill
    // function that schedules the wandering up to a time.
    function wind(p, t0, level, pan) {
      const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true; src.start(t0, rand(0, 1.5)); p.running.push(src);
      const layers = [[2.5, 250, 1100, level], [16, 700, 1800, level * .3]].map(([q, lo, hi, lvl]) => {
        const bp = ctx.createBiquadFilter(), out = outlet(p.lv, pan, .4);
        bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.value = rand(lo, hi); src.connect(bp); bp.connect(out);
        out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(lvl * .5, t0 + 4);
        return { bp, out, lo, hi, lvl, next: t0 + 4.1 };
      });
      return until => layers.forEach(L => {
        for (; L.next < until; L.next += rand(2, 5)) { L.bp.frequency.setTargetAtTime(rand(L.lo, L.hi), L.next, rand(.8, 2)); L.out.gain.setTargetAtTime(L.lvl * rand(.15, 1), L.next, rand(.8, 2)); }
      });
    }

    // ---------- Music ----------
    // Each piece of music is made while it plays. fill(until) schedules every note that starts before the time until, so the
    // page calls it every second, a few seconds ahead. chord() gives the notes playing now, so a move can play in the same key.
    // Each piece has its own two outputs, which fade it out over 3 seconds when it stops.
    function piece() {
      const lv = { dry: ctx.createGain(), wet: ctx.createGain() }, running = [];
      lv.dry.connect(music.dry); lv.wet.connect(music.wet);
      return { lv, running, fill() {}, stop(t) {
        for (const g of [lv.dry, lv.wet]) glide(g.gain, 0, t, .5);
        running.forEach(o => o.stop(t + 3.1));
        after(t + 3.2, () => { lv.dry.disconnect(); lv.wet.disconnect(); });
      } };
    }
    // The chord of a list of chords that change every period seconds from t0, at time t.
    const chordAt = (list, t0, period) => t => list[Math.floor(Math.max(0, t - t0) / period) % list.length];
    const MUSIC = {
      // Drift: a new chord every 16 seconds, which fades in over the last one, and a quiet high note every 2.5 to 7 seconds.
      // Now and then a second high note follows the first.
      drift(t0) {
        const p = piece(), at = chordAt(DRIFT, t0, 16);
        let nextChord = t0, nextBell = t0 + 5;
        p.chord = () => at(ctx.currentTime).slice(1);
        p.fill = until => {
          for (; nextChord < until; nextChord += 16) at(nextChord).forEach((m, k) => padNote(midi(m), nextChord + (k ? rand(0, 1.5) : 0), 12, p.lv, k ? rand(-.5, .5) : 0, k ? .03 : .045));
          for (; nextBell < until; nextBell += rand(2.5, 7)) {
            const ts = tones(at(nextBell), 74, 90), o = { to: p.lv, pan: rand(-.7, .7), wet: .85, partials: BAR, decay: 3.5 };
            bell(midi(ts[vary('drift', ts.length)]), nextBell, rand(.02, .04), o);
            if (Math.random() < .3) bell(midi(ts[vary('drift', ts.length)]), nextBell + rand(.18, .4), .018, { ...o, pan: rand(-.7, .7) });
          }
        };
        return p;
      },
      // Deep field: one low D that never changes, with a slowly moving filter, and its overtones above it: higher notes at
      // whole-number multiples of its frequency. Every 4 to 9 seconds one overtone fades in and out. A faint high noise rises and
      // falls every 31 seconds.
      deep(t0) {
        const p = piece(), root = midi(38), HARMONICS = [3, 4, 5, 6, 8, 9, 10, 12];
        const out = outlet(p.lv, 0, .5), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), depth = ctx.createGain();
        lp.type = 'lowpass'; lp.frequency.value = 340; lp.Q.value = 2; lp.connect(out);
        lfo.frequency.value = 1 / 23; depth.gain.value = 180; lfo.connect(depth); depth.connect(lp.frequency); lfo.start(t0);
        out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(.07, t0 + 6);
        const fifth = ctx.createGain(); fifth.gain.value = .35; fifth.connect(out);
        p.running.push(lfo, osc('sawtooth', root, t0, 0, lp, -5), osc('sawtooth', root, t0, 0, lp, 5), osc('sine', root * 1.5, t0, 0, fifth));
        const air = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), airOut = outlet(p.lv, 0, .6, .004), alfo = ctx.createOscillator(), adepth = ctx.createGain();
        air.buffer = noise; air.loop = true; bp.type = 'bandpass'; bp.frequency.value = 5000; bp.Q.value = .6;
        alfo.frequency.value = 1 / 31; adepth.gain.value = .004; alfo.connect(adepth); adepth.connect(airOut.gain);
        air.connect(bp); bp.connect(airOut); air.start(t0); alfo.start(t0); p.running.push(air, alfo);
        let next = t0 + 3;
        p.chord = () => [50, 57, 62, 66, 69];
        p.fill = until => { for (; next < until; next += rand(4, 9)) swell(root * HARMONICS[vary('deep', HARMONICS.length)], next, rand(3, 5), rand(1, 3), rand(5, 7), p.lv, rand(-.6, .6), .7, .016); };
        return p;
      },
      // Orbits: seven notes, each played again after its own period, from 17.9 to 31.4 seconds. The periods share no common
      // multiple for hours, so the notes fall together differently each time. A quiet D and A sound under them.
      orbits(t0) {
        const p = piece(), next = ORBITS.map(([, period]) => t0 + rand(1, period * .7)), pans = [-.6, .4, -.2, .6, -.4, .2, 0];
        const out = outlet(p.lv, 0, .5); out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(.05, t0 + 8);
        p.running.push(osc('sine', midi(38), t0, 0, out), osc('sine', midi(45), t0, 0, out));
        p.chord = () => [50, 57, 61, 64, 66];
        p.fill = until => ORBITS.forEach(([m, period], i) => {
          for (; next[i] < until; next[i] += period) bell(midi(m), next[i], .11, { to: p.lv, pan: pans[i], wet: .7, partials: GLASS, decay: 6, attack: .04 });
        });
        return p;
      },
      // Choir: a low male choir, a new chord every 18 seconds. Its vowel moves from "oh" to "ah" and back on each chord. Soft
      // wind sounds under it, and a far drum sounds every 25 to 50 seconds, sometimes twice.
      choir(t0) {
        const p = piece(), at = chordAt(CHOIR, t0, 18), blow = wind(p, t0, .012, 0);
        let nextChord = t0, nextDrum = t0 + rand(20, 30);
        p.chord = () => at(ctx.currentTime).slice(1);
        p.fill = until => {
          blow(until);
          for (; nextChord < until; nextChord += 18) choir(at(nextChord), nextChord, [6, 14, 8], { to: p.lv, wet: .7, amp: .02, vowels: ['o', 'a', 'o'] });
          for (; nextDrum < until; nextDrum += rand(25, 50)) {
            drum(midi(38), nextDrum, .06, { to: p.lv, pan: rand(-.4, .4), wet: .9, decay: 2 });
            if (Math.random() < .5) drum(midi(38), nextDrum + rand(1.4, 1.9), .04, { to: p.lv, pan: rand(-.4, .4), wet: .9, decay: 2 });
          }
        };
        return p;
      },
      // Harp and strings: slow strings, a new chord every 16 seconds, and a harp phrase every 6 to 11 seconds. A phrase is
      // notes going up, notes going down, a rolled chord with one high note after it, or a short walk along the scale.
      harp(t0) {
        const p = piece(), at = chordAt(DORIAN, t0, 16), scale = tones([62, 64, 65, 67, 69, 71, 72], 62, 86);
        let nextChord = t0, nextPhrase = t0 + 3;
        p.chord = () => at(ctx.currentTime).slice(1);
        p.fill = until => {
          for (; nextChord < until; nextChord += 16) at(nextChord).forEach((m, k) => bowed(m, nextChord + (k ? rand(0, 1.2) : 0), 8, p.lv, k ? rand(-.5, .5) : 0, k ? .032 : .044));
          for (; nextPhrase < until; nextPhrase += rand(6, 11)) {
            const ch = at(nextPhrase), t = nextPhrase, o = () => ({ to: p.lv, pan: rand(-.5, .5), wet: .65 }), kind = vary('phrase', 4);
            if (kind < 2) { const gap = rand(.22, .34); figure('harp', ch, kind ? -1 : 1, 62, 86).forEach((m, i) => harp(m, t + i * gap, .23, o())); }
            if (kind === 2) { const ts = tones(ch, 55, 79), s = Math.floor(rand(0, ts.length - 4)); ts.slice(s, s + 4).forEach((m, i) => harp(m, t + i * .05, .19, o())); harp(tones(ch, 74, 86)[vary('harp-top', 3)], t + .75, .22, o()); }
            if (kind === 3) {
              let i = scale.indexOf(tones(ch, 66, 79)[0]); const walk = [scale[i]];
              for (let k = 0; k < 3; k++) { i = Math.max(0, Math.min(scale.length - 1, i + [-2, -1, 1, 2][vary('walk', 4)])); walk.push(scale[i]); }
              const end = tones(ch, walk[3] - 2, walk[3] + 3)[0]; if (end) walk.push(end);
              walk.forEach((m, k) => harp(m, t + k * .38, .23, o()));
            }
          }
        };
        return p;
      },
      // Mountain wind: wind on the left and the right, over a low open fifth, D and A, whose loudness rises and falls every
      // 27 seconds. About once a minute a horn calls far away, one of four short calls.
      wind(t0) {
        const p = piece(), blowL = wind(p, t0, .05, -.5), blowR = wind(p, t0, .05, .5);
        const out = outlet(p.lv, 0, .5), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), depth = ctx.createGain(), level = ctx.createGain();
        lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = .5; lp.connect(level); level.connect(out);
        out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(1, t0 + 8);
        level.gain.value = .05; lfo.frequency.value = 1 / 27; depth.gain.value = .025; lfo.connect(depth); depth.connect(level.gain); lfo.start(t0);
        p.running.push(lfo);
        for (const m of [38, 45, 50]) for (const c of [-5, 5]) p.running.push(osc('sawtooth', midi(m), t0, 0, lp, c));
        let nextCall = t0 + rand(8, 15);
        p.chord = () => [50, 57, 62, 65, 69];
        p.fill = until => {
          blowL(until); blowR(until);
          for (; nextCall < until; nextCall += rand(35, 70)) {
            const pan = rand(-.6, .6); let t = nextCall;
            for (const [m, len] of CALLS[vary('call', CALLS.length)]) { horn(m, t, .45, len - .45, 1.4, .055, { to: p.lv, pan, wet: .9, bright: 900 }); t += len - .1; }
          }
        };
        return p;
      },
    };

    // ---------- Moves ----------
    // Each move has two sounds. leave plays when the reader clicks and the stars stretch away, for 0.8 seconds. arrive plays when
    // the next page appears and the stars pull back in. ch is the chord playing now, so each move is in the key of the music.
    // dir is 1 for a move forward and -1 for a move back.
    let shrineNote = {};
    const MOVES = {
      // Stardust: noise and short high notes. Going forward, the noise rises, the notes climb toward the flash, and the chord
      // arrives going up over a quiet low note. Going back, all of it falls, and the chord arrives going down onto a low note.
      stardust: { style: 'stars',
        leave(t, pan, ch, dir) {
          whoosh(t, .8, 'bandpass', dir > 0 ? 500 : 5000, dir > 0 ? 6000 : 450, .8, .14, pan, .5);
          const ts = tones(ch, 74, 98);
          for (let i = 0; i < 14; i++) {
            const u = Math.random(), k = Math.round((dir > 0 ? u : 1 - u) * rand(.7, 1) * (ts.length - 1));
            bell(midi(ts[k]), t + .78 * Math.sqrt(u), .012 + .028 * u, { to: moves, pan: pan + rand(-.5, .5), wet: .8, partials: BAR, decay: rand(.5, .9), attack: .002 });
          }
        },
        arrive(t, pan, ch, dir) {
          const notes = figure('stardust' + dir, ch, dir, dir > 0 ? 74 : 62, dir > 0 ? 93 : 86);
          notes.forEach((m, i) => bell(midi(m), t + i * .075, .05, { to: moves, pan: pan * .8 + rand(-.15, .15), wet: .6, decay: 2 + i * .4 }));
          if (dir > 0) bell(midi(ch[0] + 12), t, .035, { to: moves, pan: 0, wet: .55, decay: 3.5, attack: .01 });
          else bell(midi(ch[0]), t + notes.length * .075 + .1, .055, { to: moves, pan: 0, wet: .55, decay: 3.5, attack: .01 });
        },
      },
      // Crystal bowl: a hum, two sine waves 1.5 Hz apart, then a struck crystal bowl that rings for 6 seconds. Going forward,
      // the hum bends up by a whole tone and the bowl is high. Going back, the hum bends down by a whole tone and the bowl is an
      // octave lower.
      bowl: { style: 'stars',
        leave(t, pan, ch, dir) {
          const f = midi(dir > 0 ? ch[0] + 12 : ch[0]), out = outlet(moves, pan, .5);
          out.gain.setValueCurveAtTime(rise(.07, 1.6), t, .8); out.gain.setTargetAtTime(0, t + .8, .15);
          for (const [r, a] of [[1, 1], [2.71, .22]]) {
            const g = ctx.createGain(); g.gain.value = a; g.connect(out);
            for (const beat of [0, 1.5]) { const o = osc('sine', f * r + beat, t, t + 1.8, g); o.frequency.setValueAtTime(f * r * (dir > 0 ? .89 : 1.12) + beat, t); o.frequency.exponentialRampToValueAtTime(f * r + beat, t + .8); }
          }
          after(t + 1.9, () => out.disconnect());
        },
        arrive(t, pan, ch, dir) {
          const ts = tones(ch, dir > 0 ? 62 : 50, dir > 0 ? 74 : 61), f = midi(ts[vary('bowl' + dir, ts.length)]), out = outlet(moves, pan * .6, .45, .11);
          for (const [r, a, d, beat] of BOWL) {
            const g = ctx.createGain(); g.connect(out);
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a * .5, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
            osc('sine', f * r, t, t + d + .02, g); osc('sine', f * r + beat, t, t + d + .02, g);
          }
          after(t + 6.1, () => out.disconnect());
        },
      },
      // Reverse bloom: short notes of the chord go into a reverb whose impulse response is reversed, so the chord swells up to
      // the flash, as a recording does when it is played backwards. Then the chord plays forwards, one note after another.
      // Going forward, the chord is high and its notes go up. Going back, it is lower and its notes go down.
      reverse: { style: 'stars',
        leave(t, pan, ch, dir) {
          const rev = ctx.createConvolver(), out = outlet(moves, pan, .35, 1.2), ts = tones(ch, dir > 0 ? 74 : 62, dir > 0 ? 90 : 78), s = vary('reverse-swell' + dir, Math.max(1, ts.length - 4));
          // Going back, the swell passes through a low-pass filter that closes from 7000 Hz to 1200 Hz, so it gets darker.
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .5;
          lp.frequency.setValueAtTime(dir > 0 ? 18000 : 7000, t); lp.frequency.exponentialRampToValueAtTime(dir > 0 ? 18000 : 1200, t + .8);
          rev.buffer = back; rev.connect(lp); lp.connect(out);
          out.gain.setValueAtTime(1.2, t + .8); out.gain.linearRampToValueAtTime(0, t + .95);
          ts.slice(s, s + 5).forEach((m, i) => bell(midi(m), t + i * .006, .25, { node: rev, partials: BAR, decay: .14 }));
          after(t + 1.9, () => { rev.disconnect(); lp.disconnect(); out.disconnect(); });
        },
        arrive(t, pan, ch, dir) {
          figure('reverse' + dir, ch, dir, dir > 0 ? 74 : 62, dir > 0 ? 93 : 81).forEach((m, i) => bell(midi(m), t + i * .045, .045, { to: moves, pan: pan * .7 + (i - 1.5) * .12 * dir, wet: .65, partials: BAR, decay: 3.2 }));
        },
      },
      // Deep warp: a low sine wave, with a triangle wave an octave above it that small speakers can play, and noise through a
      // low-pass filter. Going forward, the tone rises from 45 Hz to 110 Hz, the filter opens, and a bright low chord arrives with
      // one high note. Going back, the tone falls from 110 Hz to 45 Hz, the filter closes, and a darker, lower chord arrives.
      warp: { style: 'stars',
        leave(t, pan, ch, dir) {
          const out = outlet(moves, pan * .5, .25), tri = ctx.createGain(), [f0, f1] = dir > 0 ? [45, 110] : [110, 45];
          out.gain.setValueCurveAtTime(rise(.2, 1.4), t, .8); out.gain.setTargetAtTime(0, t + .8, .1);
          tri.gain.value = .25; tri.connect(out);
          const a = osc('sine', f0, t, t + 1.7, out), b = osc('triangle', f0 * 2, t, t + 1.7, tri);
          a.frequency.setValueAtTime(f0, t); a.frequency.exponentialRampToValueAtTime(f1, t + .8);
          b.frequency.setValueAtTime(f0 * 2, t); b.frequency.exponentialRampToValueAtTime(f1 * 2, t + .8);
          done(a, tri, out);
          whoosh(t, .8, 'lowpass', dir > 0 ? 200 : 3200, dir > 0 ? 3200 : 200, 1.2, .12, pan, .4);
        },
        arrive(t, pan, ch, dir) {
          const out = outlet(moves, pan * .5, .4), lp = ctx.createBiquadFilter(), ts = tones(ch, dir > 0 ? 50 : 38, dir > 0 ? 69 : 57), s = vary('warp' + dir, Math.max(1, ts.length - 3));
          lp.type = 'lowpass'; lp.Q.value = .7; lp.connect(out);
          lp.frequency.setValueAtTime(220, t); lp.frequency.exponentialRampToValueAtTime(dir > 0 ? 2600 : 1100, t + .25); lp.frequency.exponentialRampToValueAtTime(dir > 0 ? 400 : 250, t + 2.4);
          out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(dir > 0 ? .07 : .05, t + .09); out.gain.exponentialRampToValueAtTime(.0001, t + 3);
          let last;
          for (const m of [ch[0] - 12, ...ts.slice(s, s + 4)]) for (const cents of [-7, 7]) last = osc('sawtooth', midi(m), t, t + 3.05, lp, cents);
          done(last, lp, out);
          if (dir > 0) bell(midi(tones(ch, 86, 98)[vary('warp-top', 3)]), t + .12, .03, { to: moves, pan: pan * .7, wet: .7, partials: BAR, decay: 2.5 });
        },
      },
      // Gust and bell: a gust of wind with a faint whistle on the other side, and a low hum of the choir, then a large bell and
      // a few harp notes. Going forward, the gust rises and is loudest at the flash, the hum slides up, the bell is high, and the
      // harp goes up. Going back, the gust falls and is loudest in the middle of its fall, the hum slides down and fades sooner,
      // the bell is an octave lower, and the harp goes down, lower and darker.
      gust: { style: 'north',
        leave(t, pan, ch, dir) {
          const up = dir > 0, lo = rand(260, 340), hi = rand(1900, 2500);
          whoosh(t, .8, 'bandpass', up ? lo : hi, up ? hi : lo, 2.2, .14, pan, .5, up ? 'rise' : 'arc');
          whoosh(t, .8, 'bandpass', up ? 620 : 1700, up ? 1700 : 620, 14, .035, -pan, .6, up ? 'rise' : 'arc');
          choir(tones(ch, 38, 52).slice(0, 2), t, up ? [.6, .2, .8] : [.3, .15, .6], { to: moves, pan, wet: .6, amp: .015, vowels: ['u'], bend: up ? -3 : 3, lp: up ? [700, 2600] : [2000, 500] });
        },
        arrive(t, pan, ch, dir) {
          const up = dir > 0, ts = tones(ch, up ? 57 : 45, up ? 69 : 56);
          bell(midi(ts[vary('gust-bell' + dir, ts.length)]), t, .065, { to: moves, pan: pan * .5, wet: .55, partials: CHURCH, decay: up ? 7 : 9, attack: .005 });
          figure('gust' + dir, ch, dir, up ? 67 : 50, up ? 86 : 69).forEach((m, i) => harp(m, t + .22 + i * .12, .14, { to: moves, pan: pan * .6 + (i - 1.5) * .12 * dir, wet: .6, lp: up ? 0 : 1400 }));
          whoosh(t, 1.4, 'bandpass', up ? 1100 : 700, up ? 400 : 220, 1.6, .035, pan, .5, 'fall');
        },
      },
      // Chant: the choir alone, with a quiet breath of noise. Going forward, it slides up from "oo" to "ah", then opens into a
      // high chord on "ah" with a harp rolled upward. Going back, it slides down from "ah" to "oo", then settles on a low chord
      // on "oo" with a darker harp rolled downward.
      chant: { style: 'north',
        leave(t, pan, ch, dir) {
          const up = dir > 0, ts = tones(ch, up ? 45 : 50, up ? 57 : 62);
          choir(up ? ts.slice(0, 3) : ts.slice(-3), t, [.7, .2, .9], { to: moves, pan, wet: .6, amp: .022, vowels: up ? ['u', 'a'] : ['a', 'u'], bend: up ? -2 : 2, lp: up ? [800, 5000] : [5000, 700] });
          whoosh(t, .8, 'bandpass', up ? 400 : 1600, up ? 1600 : 400, .9, .04, pan, .5);
        },
        arrive(t, pan, ch, dir) {
          const up = dir > 0, ts = tones(ch, up ? 50 : 38, up ? 69 : 57), s = vary('chant' + dir, Math.max(1, ts.length - 3));
          choir(ts.slice(s, s + 4), t, [.25, .5, 3], { to: moves, pan: pan * .5, wet: .65, amp: .015, vowels: up ? ['a', 'o'] : ['o', 'u'], lp: up ? [5000, 5000] : [1400, 900] });
          figure('chant' + dir, ch, dir, up ? 69 : 57, up ? 88 : 76).forEach((m, k) => harp(m, t + .1 + k * .06, .12, { to: moves, pan: pan * .5 + (k - 1.5) * .15, wet: .7, lp: up ? 0 : 1400 }));
        },
      },
      // Drum and horn: drums tuned to the chord over a low rush of noise, then a horn call of two notes over one drum hit. Going
      // forward, a drum roll grows toward the flash, the rush rises, and the horn call goes up, from higher notes. Going back,
      // three slow hits go down and get softer, the rush falls, and the horn call goes down, from lower notes, and is darker.
      drum: { style: 'north',
        leave(t, pan, ch, dir) {
          const root = midi(tones(ch, 38, 49)[0]);
          whoosh(t, .8, 'lowpass', dir > 0 ? 150 : 1500, dir > 0 ? 1500 : 150, .8, .05, pan, .4);
          if (dir > 0) for (let k = 0, at = 0, gap = .13; at < .78; k++, at += gap, gap = Math.max(.042, gap * .86)) drum(root, t + at, .02 + .09 * Math.pow(at / .78, 1.6), { to: moves, pan: pan + (k % 2 ? .12 : -.12), wet: .45, decay: .5 });
          else [0, .27, .54].forEach((at, k) => drum(root * Math.pow(2, -[0, 2, 5][k] / 12), t + at, .13 - k * .03, { to: moves, pan, wet: .5, decay: 1 }));
        },
        arrive(t, pan, ch, dir) {
          const up = dir > 0, root = midi(tones(ch, 38, 49)[0]), ts = tones(ch, up ? 50 : 41, up ? 67 : 57);
          drum(up ? root : root * .75, t, up ? .13 : .1, { to: moves, pan: pan * .5, wet: .6, decay: up ? 1.8 : 1.4 });
          const calls = up ? [[0, 1], [0, 2], [1, 2], [1, 3]] : [[1, 0], [2, 0], [2, 1], [3, 1]], c = calls[vary('horn' + dir, calls.length)];
          const s = Math.floor(Math.random() * Math.max(1, ts.length - 3)), o = { to: moves, pan: pan * .5, wet: .6, bright: up ? 1500 : 850 };
          horn(ts[s + c[0]], t + .06, .25, .2, .5, .05, o);
          horn(ts[s + c[1]], t + .45, .3, .5, 1.8, .06, o);
          horn(ts[s + c[1]] - 12, t + .45, .3, .5, 1.8, .03, o);
        },
      },
      // Shrine bell: a bell, a breath of wind, a low hum of the choir, and harp notes. Going forward, a smaller, higher bell
      // played backwards swells up to the flash and gets brighter, the wind rises, then the bell rings forwards when the page
      // arrives, and the harp goes up. Going back, a large low bell rings at once, the wind falls, and the page arrives with the
      // hum and a darker harp going down.
      shrine: { style: 'north',
        leave(t, pan, ch, dir) {
          const up = dir > 0, ts = tones(ch, up ? 64 : 45, up ? 76 : 56), m = shrineNote[dir] = ts[vary('shrine' + dir, ts.length)];
          whoosh(t, .8, 'bandpass', up ? 500 : 2000, up ? 3000 : 300, 1.2, .08, pan, .5, up ? 'rise' : 'arc');
          if (!up) return bell(midi(m), t, .065, { to: moves, pan, wet: .55, partials: CHURCH, decay: 6, attack: .005 });
          // The swell passes through a low-pass filter that opens from 250 Hz to 8000 Hz, so it gets brighter toward the flash.
          const rev = ctx.createConvolver(), lp = ctx.createBiquadFilter(), out = outlet(moves, pan, .4, 2.2);
          lp.type = 'lowpass'; lp.Q.value = .5; lp.frequency.setValueAtTime(250, t); lp.frequency.exponentialRampToValueAtTime(8000, t + .8);
          rev.buffer = back; rev.connect(lp); lp.connect(out);
          out.gain.setValueAtTime(2.2, t + .8); out.gain.linearRampToValueAtTime(0, t + .95);
          bell(midi(m), t, .3, { node: rev, partials: CHURCH, decay: .2 });
          after(t + 1.9, () => { rev.disconnect(); lp.disconnect(); out.disconnect(); });
        },
        arrive(t, pan, ch, dir) {
          const up = dir > 0;
          if (up) bell(midi(shrineNote[1] || tones(ch, 64, 76)[0]), t, .05, { to: moves, pan: pan * .5, wet: .55, partials: CHURCH, decay: 7, attack: .005 });
          choir(tones(ch, up ? 45 : 38, up ? 57 : 50).slice(0, 2), t + (up ? .1 : 0), [.4, .3, 2.5], { to: moves, pan: 0, wet: .7, amp: .012, vowels: [up ? 'o' : 'u'], lp: up ? [5000, 5000] : [900, 600] });
          figure('shrine' + dir, ch, dir, up ? 64 : 55, up ? 86 : 76).forEach((n, i) => harp(n, t + .3 + i * .14, .12, { to: moves, pan: pan * .5 + (i - 1.5) * .12 * dir, wet: .6, lp: up ? 0 : 1400 }));
          shrineNote = {};
        },
      },
    };

    // fixed is the notes a move uses while a recorded song plays, since the song gives no chord to follow.
    let piece_ = null, move = 'gust', fixed = null;
    const chord = () => (piece_ && piece_.chord()) || fixed || HOME[MOVES[move].style];
    return {
      ctx, master, music, moves, MUSIC, MOVES,
      setChord(notes) { fixed = notes; },
      setMusic(name, t = ctx.currentTime) {
        if (piece_) piece_.stop(t);
        piece_ = MUSIC[name] ? MUSIC[name](t + .05) : null;
        if (piece_) piece_.fill(t + 6);
      },
      fill(until) { if (piece_) piece_.fill(until); },
      setMove(name) { move = name; },
      // x is where the reader clicked, from 0 at the left edge of the window to 1 at the right. dir is 1 forward, -1 back.
      // The music plays on through a move at the same volume.
      leave(x, dir = 1, t = ctx.currentTime + .01) { MOVES[move].leave(t, (x * 2 - 1) * .7, chord(), dir); },
      arrive(x, dir = 1, t = ctx.currentTime + .01) { MOVES[move].arrive(t, (x * 2 - 1) * .7, chord(), dir); },
    };
  }

  // ---------- The sound of the page ----------
  // A browser lets a page start sound only after the reader clicks or presses a key on it, so start() is called from those,
  // and once when sound.html opens.
  // The choices are kept in the browser's localStorage. Volumes go from 0 to 1, and the gain is the square of the volume,
  // because loudness is heard on a scale closer to that than to the gain itself. on is false when the reader has turned all
  // sound off, with the harp in a page's header.
  const KEY = 'stoicheiaSound';
  const set = { move: 'gust', musicVol: .5, moveVol: .7, on: true };
  try { const saved = JSON.parse(localStorage.getItem(KEY)) || {}; for (const k in set) if (k in saved) set[k] = saved[k]; } catch (err) {}
  let ctx = null, e = null;
  const gainOf = { music: v => v * v * .9, moves: v => v * v * 1.3 };

  // The songs, from audio/songs.js, which library/music.js writes from the songs in music/. They play in a shuffled order: see
  // shuffled. Each song plays at its own gain, which brings it to the loudness of the others, and its volume preset can lower
  // the music's volume while it plays: see volume. The moves use the song's own notes, so each move is in the key of the song
  // that plays. FADE is how many seconds before a song's end the next song starts.
  const SONGS_ = typeof SONGS === 'undefined' ? [] : SONGS, FADE = 8;
  // Chrome treats a media file opened as a file, at a file:// address, as a file of another origin, and gives Web Audio only
  // silence from it. So when this page is opened as a file, a song's bytes come from its script in audio/, which
  // library/music.js writes from the mp3, and the song plays from a Blob URL, which has this page's own origin. A song's bytes
  // are loaded when it is about to play: the next song's when the one before it starts.
  // The first song is loaded in full before it plays, with whole set, so that the loading view of sound.html can show how much
  // of it has come, and the song never stops to wait for more of it. Over http, its bytes come with fetch, and it plays from a
  // Blob URL. opening.part is how much of it has come, from 0 to 1, and opening.done is true when all of it has, or when it
  // could not be fetched, and then it plays from its address. A later song loads from its address while the song before it
  // plays.
  const urls = {}, opening = { part: 0, done: false };
  async function fetched(i) {
    const song = SONGS_[i], url = `audio/${song.file}.mp3`;
    try {
      const res = await fetch(url);
      if (!res.ok || !res.body) throw new Error(res.status);
      // The size from Content-Length, or about 22 kB for each second of the song when the server does not send it.
      const size = +res.headers.get('Content-Length') || song.seconds * 22000, reader = res.body.getReader(), parts = [];
      for (let got = 0; ;) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value); got += value.length; opening.part = Math.min(.99, got / size);
      }
      return URL.createObjectURL(new Blob(parts, { type: 'audio/mpeg' }));
    } catch (err) { return url; }
  }
  function songUrl(i, whole) {
    const file = SONGS_[i].file;
    if (!urls[file]) urls[file] = location.protocol !== 'file:' ? (whole ? fetched(i) : Promise.resolve(`audio/${file}.mp3`)) : new Promise(done => {
      const s = document.createElement('script');
      s.src = `audio/${file}.js`;
      s.onload = () => {
        const text = atob(window.SONG_DATA), bytes = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
        delete window.SONG_DATA; s.remove();
        done(URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' })));
      };
      document.head.appendChild(s);
    });
    return urls[file];
  }
  // Two audio elements take turns. When the song that plays is FADE seconds from its end, the other element starts the next
  // song, and the two fade across each other, so there is no gap. Each element goes through its own gain into the music bus,
  // so the music's volume applies to every song. current is the number of the song that plays, from 0, and place is where it is
  // in its round of the shuffle, from 1.
  let players = [], playing = 0, current = 0, place = 1, turning = false;
  // Each time sound.html opens, on a first visit or a reload, it starts with a song chosen at random that is not the song that
  // started last time, which localStorage keeps under stoicheiaLastSong. Then every other song plays once, in a random order,
  // and then all the songs again, in a new random order, which never starts with the song that just ended. order is the songs
  // still to play in this round, as numbers from 0.
  const LAST = 'stoicheiaLastSong';
  let order = [];
  function shuffled(avoid) {
    const all = SONGS_.map((s, i) => i);
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    if (all.length > 1 && all[0] === avoid) all.push(all.shift());
    return all;
  }
  async function playSong() {
    if (!SONGS_.length) return;
    players = [0, 1].map(() => {
      const a = new Audio(), g = ctx.createGain();
      a.preload = 'auto'; g.gain.value = 0;
      ctx.createMediaElementSource(a).connect(g); g.connect(e.music.dry);
      return { a, g };
    });
    let last = null;
    try { last = localStorage.getItem(LAST); } catch (err) {}
    order = shuffled(SONGS_.findIndex(s => s.file === last));
    const first = order.shift(), url = await songUrl(first, true);
    opening.part = 1; opening.done = true;
    if (held) await held;
    begin(players[0], first, url, .5);
    setInterval(async () => {
      const p = players[playing];
      if (turning || p.a.paused || !p.a.duration || p.a.currentTime < p.a.duration - FADE) return;
      turning = true;
      const next = order.shift(), url = await songUrl(next);
      p.g.gain.cancelScheduledValues(ctx.currentTime); p.g.gain.setTargetAtTime(0, ctx.currentTime, FADE / 4);
      setTimeout(() => p.a.pause(), FADE * 1000 + 300);
      playing = 1 - playing; begin(players[playing], next, url, FADE / 4);
      turning = false;
    }, 250);
  }
  // The music's volume now, from 0 to 1. It is the reader's music volume, set.musicVol, except that a song with a volume preset
  // in music/volumes.json starts no louder than its preset. Heaventree, at 80, starts at 80 when the reader's volume is higher,
  // and at the reader's volume when it is 80 or lower. The reader can still move the volume while the song plays, and that
  // becomes their music volume. Each new song starts at the reader's music volume, or at its own preset when that is lower.
  // onVolume is called with each new volume, so that sound.html can show it on the page.
  let volume = set.musicVol;
  const api = { onVolume: null };
  function setVolume(v, tc) {
    volume = v;
    if (e) { const g = e.music.vol.gain; g.cancelScheduledValues(ctx.currentTime); g.setTargetAtTime(gainOf.music(v), ctx.currentTime, tc); }
    if (api.onVolume) api.onVolume(v);
  }
  // Starts song i on the player p. When this round has no songs left, the next round is shuffled now, so the next song's bytes
  // can load while this one plays.
  function begin(p, i, url, tc) {
    current = i; place = SONGS_.length - order.length; e.setChord(SONGS_[i].notes);
    try { localStorage.setItem(LAST, SONGS_[i].file); } catch (err) {}
    p.a.src = url; p.a.currentTime = 0; p.a.play().catch(() => {});
    p.g.gain.cancelScheduledValues(ctx.currentTime); p.g.gain.setTargetAtTime(SONGS_[i].gain, ctx.currentTime, tc);
    setVolume(Math.min(set.musicVol, SONGS_[i].volume ?? 1), 2);
    if (!order.length) order = shuffled(i);
    songUrl(order[0]);
  }

  // The loading view of sound.html starts the first song when it has found the stars, so that the song starts with the title.
  // hold() keeps the first song from starting, and returns a function that lets it start.
  let held = null;
  function hold() { let go; held = new Promise(done => { go = done; }); return () => go(); }

  // sound.html calls start() as soon as it opens. Chrome lets it start the sound then only after a reload that the page itself
  // started, from a click or a key press, as sound.html does for Command-R. After any other reload, and on a first visit, the
  // audio context waits, and the song does not play, until the reader clicks or presses a key, which calls start() again.
  // The music fades in over a few seconds.
  let meter = null, bins = null;
  function start() {
    if (!ctx) {
      ctx = new AudioContext({ latencyHint: 'interactive' }); e = engine(ctx);
      e.setMove(set.move); e.master.gain.value = set.on ? 1 : 0;
      e.music.vol.gain.setValueAtTime(0, ctx.currentTime); e.music.vol.gain.setTargetAtTime(gainOf.music(volume), ctx.currentTime, 2);
      e.moves.vol.gain.value = gainOf.moves(set.moveVol);
      meter = ctx.createAnalyser(); meter.fftSize = 1024; meter.smoothingTimeConstant = .75;
      e.music.dry.connect(meter); bins = new Uint8Array(meter.frequencyBinCount);
      playSong();
    }
    if (document.hidden) return;
    if (ctx.state === 'suspended') ctx.resume();
    const p = players[playing];
    if (p && p.a.paused) p.a.play().catch(() => {});
  }
  // For the music panel: the song's title, where it is in its round of the shuffle and how many songs there are, where it is in
  // seconds, how long it is, whether it plays, and how loud the music is now in each of n bands of frequencies, from 60 Hz to 12000 Hz, each from 0 to
  // 1. The bands are measured before the music's volume, so they show the songs themselves.
  function listen(n) {
    const p = players[playing], song = SONGS_[current] || { title: '', seconds: 0 };
    const now = { title: song.title, number: place, of: SONGS_.length, at: p ? p.a.currentTime : 0, length: (p && p.a.duration) || song.seconds,
      playing: !!p && !p.a.paused && !!ctx && ctx.state === 'running', levels: [] };
    if (!meter) return now;
    meter.getByteFrequencyData(bins);
    const hz = ctx.sampleRate / meter.fftSize, edge = i => Math.round(60 * Math.pow(200, i / n) / hz);
    for (let i = 0; i < n; i++) {
      let m = 0;
      for (let k = edge(i); k < Math.max(edge(i) + 1, edge(i + 1)); k++) m = Math.max(m, bins[k] || 0);
      now.levels.push(m / 255);
    }
    return now;
  }
  function choose(k, v) {
    set[k] = v;
    try { localStorage.setItem(KEY, JSON.stringify(set)); } catch (err) {}
    if (k === 'musicVol') setVolume(v, .08);
    if (!e) return;
    const t = ctx.currentTime;
    if (k === 'move') e.setMove(v);
    if (k === 'moveVol') { e.moves.vol.gain.cancelScheduledValues(t); e.moves.vol.gain.setTargetAtTime(gainOf.moves(v), t, .08); }
    // Turning sound off fades it out in about 0.3 seconds. Turning it on fades it in over about 1 second.
    if (k === 'on') { e.master.gain.cancelScheduledValues(t); e.master.gain.setTargetAtTime(v ? 1 : 0, t, v ? .3 : .08); }
  }
  // Plays the move once, without moving: the arrival comes 1.05 seconds after the click, about when a page arrives.
  function preview(dir = 1, x = .5) { start(); e.leave(x, dir); setTimeout(() => e.arrive(x, dir), 1050); }
  // A hidden tab plays nothing: the music fades out, the song pauses, and the audio context stops until the tab is shown again.
  // Then the song goes on from where it paused.
  let paused = [];
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    const g = e.music.vol.gain, t = ctx.currentTime;
    if (document.hidden) {
      g.cancelScheduledValues(t); g.setTargetAtTime(0, t, .15);
      setTimeout(() => { if (!document.hidden) return; paused = players.filter(p => !p.a.paused); paused.forEach(p => p.a.pause()); ctx.suspend(); }, 700);
    } else ctx.resume().then(() => {
      paused.forEach(p => p.a.play().catch(() => {})); paused = [];
      g.cancelScheduledValues(ctx.currentTime); g.setTargetAtTime(gainOf.music(volume), ctx.currentTime, .6);
    });
  });

  // For testing: renders `seconds` of sound into a buffer, faster than real time, with whatever setup(e) schedules.
  function render(seconds, setup, sampleRate = 44100) {
    const off = new OfflineAudioContext(2, Math.round(sampleRate * seconds), sampleRate), oe = engine(off);
    oe.music.vol.gain.value = gainOf.music(set.musicVol); oe.moves.vol.gain.value = gainOf.moves(set.moveVol);
    setup(oe);
    return off.startRendering();
  }

  return Object.assign(api, {
    start, choose, preview, render, listen, hold, settings: set,
    // How much of the first song has loaded: { part, done }.
    loading: () => ({ ...opening }),
    // The music's volume now, which a song's preset can make lower than set.musicVol.
    volume: () => volume,
    started: () => !!ctx,
    state: () => ctx ? ctx.state : 'not started',
    // For testing: where each player of the song is, and a jump to a time in the song that plays now.
    song: () => players.map(p => ({ at: +p.a.currentTime.toFixed(1), of: +(p.a.duration || 0).toFixed(1), paused: p.a.paused, gain: +p.g.gain.value.toFixed(3) })),
    seek: s => { if (players[playing]) players[playing].a.currentTime = s; },
    leave: (x, dir) => { if (e) e.leave(x, dir); },
    arrive: (x, dir) => { if (e) e.arrive(x, dir); },
  });
})();
