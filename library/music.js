// Puts the songs in music/ on the pages. music/ holds the songs that the star theme plays, as mp3 files named by a number and
// their title, such as "1 Starlit Hush.mp3". sound.js plays them in a shuffled order.
// For each song, it writes into ui-ideas/audio/, where sound.html plays them:
// - a copy of the mp3, named from the title, such as starlit-hush.mp3,
// - the same bytes in base64, as a script, such as starlit-hush.js, which sets window.SONG_DATA. sound.js loads it when sound.html
//   is opened as a file, because Chrome gives Web Audio only silence from an mp3 at a file:// address, and a script at a
//   file:// address still loads,
// - the song's levels, such as starlit-hush.levels, which the music player on a phone draws its picture of the music from,
// and it writes ui-ideas/audio/songs.js, the list of songs that sound.js reads, with each song's volume preset from
// music/volumes.json. It removes from ui-ideas/audio/ the copies and the levels of
// songs that are no longer in music/. It needs ffmpeg, which measures each song. Run it after adding, removing, or changing a
// song, and after cloning the repository, because git keeps only music/, songs.js, and the levels, not the copies:
//   node library/music.js

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MUSIC = path.join(ROOT, 'music'), AUDIO = path.join(ROOT, 'ui-ideas', 'audio');
// How loud each song plays, in LUFS, before the music's volume: the loudness of Starlit Hush, -13.4 LUFS, at the gain of 0.45
// that it had when it was the only song. A song's gain brings it to this loudness, and is never more than 1, so no song is
// made louder than it was recorded.
const TARGET = -20.3;
// The volume presets, in music/volumes.json: a song's title and the most the music's volume can be when that song starts, from
// 1 to 100, on the scale of the music volume in the panels, such as { "The Celestial City": 80 }. When The Celestial City
// starts, a music volume above 80 comes down to 80, and one at 80 or below stays. The reader can still move the volume while it
// plays, and the next song starts at the reader's music volume again. A song that the file does not name has 100, which never
// lowers it.
const PRESETS = path.join(MUSIC, 'volumes.json');
const presets = fs.existsSync(PRESETS) ? JSON.parse(fs.readFileSync(PRESETS, 'utf8')) : {};

// The integrated loudness of a song, in LUFS, as EBU R 128 measures it: one number for how loud the whole song sounds. ffmpeg
// writes it at the end of its report, as "I: -13.4 LUFS".
function loudness(file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-filter_complex', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const all = [...r.stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)];
  if (!all.length) throw new Error(`ffmpeg did not measure ${file}`);
  return +all[all.length - 1][1];
}

// Each song's sound, as 32-bit floats, in one channel, 11025 times a second.
const RATE = 11025;
function samples(file) {
  const raw = execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', file, '-ac', '1', '-ar', String(RATE), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4);
}

// A fast Fourier transform, in place, of re and im, whose length is a power of 2. Afterwards, bin k holds how much of the
// frequency k * RATE / length the sound has.
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const p = i + k, q = p + len / 2, tr = re[q] * cr - im[q] * ci, ti = re[q] * ci + im[q] * cr;
        re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti;
        [cr, ci] = [cr * wr - ci * wi, cr * wi + ci * wr];
      }
    }
  }
}

// The notes of a song, for the sounds of a move, so that each move is in the key of the song that plays. The song is cut into
// pieces of 4096 samples, and each piece's frequencies from 98 Hz (G2) to 2100 Hz are added up by the note they are nearest to,
// in any octave: C, C#, D, and so on. The song's notes are five of those with the most sound, taken strongest first, leaving out
// a note a half step from one already taken, because two notes a half step apart clash when a move plays them together. The
// first note of the list is the strongest, from A2 (MIDI 45) to G#3 (MIDI 56), because a move rings a bell on it. The others are
// the song's notes from a fifth above it to A4 (MIDI 69).
function notes(sound) {
  const N = 4096, energy = new Float64Array(12), re = new Float64Array(N), im = new Float64Array(N);
  for (let s = 0; s + N <= sound.length; s += N) {
    for (let i = 0; i < N; i++) { re[i] = sound[s + i] * (.5 - .5 * Math.cos(2 * Math.PI * i / (N - 1))); im[i] = 0; }
    fft(re, im);
    for (let k = 1; k < N / 2; k++) {
      const f = k * RATE / N;
      if (f < 98 || f > 2100) continue;
      energy[((Math.round(12 * Math.log2(f / 440)) + 69) % 12 + 12) % 12] += Math.hypot(re[k], im[k]);
    }
  }
  const strongest = [];
  for (const pc of [...energy.keys()].sort((a, b) => energy[b] - energy[a])) {
    if (strongest.length < 5 && !strongest.some(q => (pc - q + 12) % 12 === 1 || (q - pc + 12) % 12 === 1)) strongest.push(pc);
  }
  const root = 45 + (strongest[0] - 9 + 12) % 12;
  const rest = [];
  for (let m = root + 7; m <= 69; m++) if (strongest.includes(m % 12)) rest.push(m);
  return [root, ...rest];
}

// The levels of a song, for the picture of the music in the music player on a phone, player.js. On a computer, sound.js
// measures the music while it plays, with an analyser node of the Web Audio API. A phone plays each song with an audio element
// alone, because an iPhone stops Web Audio when its screen locks and does not let a page set an audio element's volume, so no
// analyser can hear it. So the levels are measured here, as that analyser measures them, and the phone reads them as the song
// plays.
// The analyser of sound.js takes the last 1024 samples, 44100 a second, of the song at its gain, in one channel, the mean of
// the left and the right. It multiplies them by a Blackman window, finds their frequencies with a Fourier transform divided by
// 1024, and keeps each frequency's size as 0.75 of what it kept the frame before plus 0.25 of the new size. It gives each one
// in decibels, from -100 dB at 0 to -30 dB at 255, and sky.js reads it 60 times a second. sound.js splits 60 Hz to 12000 Hz
// into 48 bands, spaced evenly in pitch, and a band's level is its loudest frequency. The picture's 72 rays use only 10 of the
// 48 bands, LEVEL_BANDS, as sky.js picks them: the band round(h * 47) for a ray at h, from 0 at a low point of the star to 1 at
// a diagonal, where h is a ninth, two ninths, and so on.
// The file is one byte for each of the 10 bands, from 0 to 255, for each frame, LEVEL_FPS frames a second: every second
// frame of the 60.
const LEVEL_RATE = 44100, FFT = 1024, LEVEL_FPS = 30, LEVEL_BANDS = Array.from({ length: 10 }, (_, j) => Math.round(j / 9 * 47));
function levels(file, gain) {
  // parseInt, because ffprobe writes "2," for an mp3 that LAME made, whose LAME tag gives the stream a field of side data.
  const channels = parseInt(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=channels', '-of', 'csv=p=0', file], { encoding: 'utf8' }));
  const mix = channels > 1 ? ['-af', 'pan=mono|c0=0.5*c0+0.5*c1'] : [];
  const raw = execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', file, ...mix, '-ar', String(LEVEL_RATE), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
  const sound = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4);
  const hz = LEVEL_RATE / FFT, edge = i => Math.round(60 * Math.pow(200, i / 48) / hz);
  const blackman = Float64Array.from({ length: FFT }, (_, i) => .42 - .5 * Math.cos(2 * Math.PI * i / FFT) + .08 * Math.cos(4 * Math.PI * i / FFT));
  const re = new Float64Array(FFT), im = new Float64Array(FFT), kept = new Float64Array(FFT / 2);
  const frames = Math.floor(sound.length / LEVEL_RATE * 60), out = new Uint8Array(Math.ceil(frames / 2) * LEVEL_BANDS.length);
  for (let f = 0; f < frames; f++) {
    const end = Math.round(f * LEVEL_RATE / 60);
    for (let i = 0; i < FFT; i++) { const s = end - FFT + i; re[i] = s >= 0 ? sound[s] * gain * blackman[i] : 0; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k < FFT / 2; k++) kept[k] = .75 * kept[k] + .25 * Math.hypot(re[k], im[k]) / FFT;
    if (f % 2) continue;
    LEVEL_BANDS.forEach((band, b) => {
      let most = 0;
      for (let k = edge(band); k < Math.max(edge(band) + 1, edge(band + 1)); k++) most = Math.max(most, kept[k] || 0);
      out[f / 2 * LEVEL_BANDS.length + b] = Math.max(0, Math.min(255, Math.floor(255 / 70 * (20 * Math.log10(most) + 100))));
    });
  }
  return out;
}

const slug = title => title.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const files = fs.readdirSync(MUSIC).filter(f => /\.mp3$/i.test(f)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
if (!files.length) throw new Error('music/ has no mp3 files');
fs.mkdirSync(AUDIO, { recursive: true });
const titles = files.map(f => f.replace(/\.mp3$/i, '').replace(/^\d+\s*/, ''));
for (const [title, percent] of Object.entries(presets)) {
  if (!titles.includes(title)) throw new Error(`music/volumes.json names "${title}", which is not a song in music/: ${titles.join(', ')}`);
  if (!Number.isFinite(percent) || percent < 1 || percent > 100) throw new Error(`music/volumes.json gives "${title}" ${percent}, not a percent from 1 to 100`);
}
const songs = files.map(f => {
  const from = path.join(MUSIC, f), title = f.replace(/\.mp3$/i, '').replace(/^\d+\s*/, ''), name = slug(title);
  const lufs = loudness(from);
  const sound = samples(from);
  fs.copyFileSync(from, path.join(AUDIO, name + '.mp3'));
  fs.writeFileSync(path.join(AUDIO, name + '.js'), `// Written by library/music.js from music/${f}. Do not edit.\nwindow.SONG_DATA = '${fs.readFileSync(from).toString('base64')}';\n`);
  const song = { title, file: name, source: f, seconds: +(sound.length / RATE).toFixed(1), gain: +Math.min(1, Math.pow(10, (TARGET - lufs) / 20)).toFixed(3), volume: (presets[title] ?? 100) / 100, notes: notes(sound) };
  const level = levels(from, song.gain);
  fs.writeFileSync(path.join(AUDIO, name + '.levels'), level);
  console.log(`${f}: ${song.seconds} s, ${lufs} LUFS, gain ${song.gain}, volume ${Math.round(song.volume * 100)}%, notes ${song.notes.join(' ')}, levels ${Math.round(level.length / 1024)} kB`);
  return song;
});
// The copies and the levels of songs that are no longer in music/.
const keep = new Set(songs.flatMap(s => [s.file + '.mp3', s.file + '.js', s.file + '.levels']).concat('songs.js'));
for (const f of fs.readdirSync(AUDIO)) if (/\.(mp3|js|levels)$/.test(f) && !keep.has(f)) { fs.rmSync(path.join(AUDIO, f)); console.log(`Removed ui-ideas/audio/${f}.`); }
fs.writeFileSync(path.join(AUDIO, 'songs.js'), `// Written by library/music.js from the songs in music/. Do not edit.
// Each song: its title, the name of its files in this folder, its file in music/, its length in seconds, the gain that brings it
// to the loudness of the others, its volume preset from music/volumes.json, the most the music's volume can be when it starts,
// from 0 to 1, and its notes, which the sounds of a move use. library/site.js copies each song from music/.
const SONGS = ${JSON.stringify(songs, null, 1).replace(/\n\s*(\d)/g, ' $1').replace(/\n\s*\]/g, ']')};
`);
console.log(`Wrote ui-ideas/audio/: ${songs.length} songs, and songs.js.`);
