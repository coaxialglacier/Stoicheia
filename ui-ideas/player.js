// The music player that a phone or a tablet shows, in place of the pages of Wardens of the Swift. The user asked on 2026-10-23
// that a phone or a tablet, which blocker.js keeps from the pages, show a note that the full experience is on a computer, and
// then a music player with every song, in the style of the music panel under the harp.
// At the top are the title and the note, with a button that shares the link. Under them is the player: the emblem of the music
// panel with its picture of the music, the song that plays, a bar of where the song is, which the reader can drag or tap to move
// through the song, and the controls: Shuffle, Previous, Play or Pause, Next, and Repeat. Where the page can set the music's
// volume, the music's volume is under them. Under the player is the list of every song, with its number, its name, and its
// length. Tapping a song plays it, and tapping the song that plays pauses it or plays it again. When the player's controls are
// scrolled out of view, a small bar at the bottom of the window has the song's name, Play or Pause, and Next.
// A phone plays the music with one audio element alone, not with the Web Audio API that sound.js uses on a computer:
// - An iPhone stops the Web Audio API when its screen locks or the reader goes to another app. An audio element plays on, and
//   its next song starts when one ends.
// - On an iPhone or an iPad, the device's own buttons set the volume, and the page shows no volume. Elsewhere, such as Chrome
//   on Android, the music's volume is under the controls.
// - An audio element plays with the iPhone's ring and silent switch set to silent, as music apps do.
// - One element, started by the reader's tap, may start each next song without another tap, even with the screen locked.
// The songs play one after another, each to its end, as in any music player, without the fade between two songs that a
// computer plays. The lock screen and the system's controls of the music show the song's name, Wardens of the Swift, and the
// cover, and have Play, Pause, Previous, Next, and a bar to move through the song, through the Media Session API.
// The picture of the music is drawn from levels that library/music.js measured from each song, as sound.js measures them on a
// computer, because an audio element alone gives the page nothing to measure.
// sound.html loads this script. blocker.js calls Player.build when it shows its view on a phone or a tablet.

const Player = (() => {
  if (typeof Blocker === 'undefined' || Blocker.why !== 'device') return { on: false };
  const SONGS_ = typeof SONGS === 'undefined' ? [] : SONGS, N = SONGS_.length;
  const NS = 'http://www.w3.org/2000/svg';
  const f = n => +n.toFixed(2);
  const sparkle = (x, y, r) => { const k = r * .28; return `M${f(x)} ${f(y - r)}L${f(x + k)} ${f(y - k)}L${f(x + r)} ${f(y)}L${f(x + k)} ${f(y + k)}L${f(x)} ${f(y + r)}L${f(x - k)} ${f(y + k)}L${f(x - r)} ${f(y)}L${f(x - k)} ${f(y - k)}Z`; };
  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  // The reader's choices, kept in localStorage: whether the songs play in a shuffled order, what repeats ('all' plays the songs
  // again after the last one, 'one' plays one song again and again, and 'off' stops after the last one), and the music's
  // volume, from 0 to 1, where the page can set it. The first song is not the song that started last time, which sound.js
  // keeps under stoicheiaLastSong, on a computer too.
  const KEY = 'stoicheiaPlayer', LAST = 'stoicheiaLastSong';
  const set = { shuffle: true, repeat: 'all', volume: 1 };
  try { const saved = JSON.parse(localStorage.getItem(KEY)) || {}; for (const k in set) if (k in saved) set[k] = saved[k]; } catch (e) {}
  const keep = () => { try { localStorage.setItem(KEY, JSON.stringify(set)); } catch (e) {} };

  // ---------- Playing the songs ----------
  const audio = document.createElement('audio');
  audio.preload = 'metadata';
  audio.loop = set.repeat === 'one';
  // On an iPhone or an iPad, the device's own buttons set the volume, so the page sets none and shows none there. An iPhone of
  // iOS 16 or earlier ignores a volume that a page sets and reads back 1, and Safari on iOS 26 reads back the volume it was
  // given, so the page does not rely on either. An iPad that asks for the desktop site names a Mac and has touch points, as
  // blocker.js says. Elsewhere, a volume that reads back 0.5 after it is set to 0.5 means the page can set it.
  const ua = navigator.userAgent || '';
  const apple = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const canVolume = !apple && (() => { try { const a = document.createElement('audio'); a.volume = .5; return Math.abs(a.volume - .5) < .01; } catch (e) { return false; } })();
  // Each song plays at its gain from songs.js, divided by the largest gain, so the quietest song plays at its full loudness and
  // the others as loud as it. A song's volume preset lowers the music's volume when it starts, as on a computer. vol is the
  // volume now, and set.volume is the reader's. Where the page cannot set the volume, the songs play as they were recorded.
  const MOST = Math.max(...SONGS_.map(s => s.gain), .001);
  let vol = canVolume ? set.volume : 1;
  function loudness(starting) {
    if (!canVolume) return;
    if (starting) vol = Math.min(set.volume, SONGS_[current].volume ?? 1);
    audio.volume = Math.min(1, vol * vol * SONGS_[current].gain / MOST);
  }

  // current is the number of the song in the player, from 0, in the order of the list. With Shuffle on, the songs play in a
  // random order: every song once, then every song again in a new order that does not start with the song that just ended, as
  // sound.js plays them. played is every song played since the page opened, in order, and pos is the place in it of the song in
  // the player, so Previous goes back through it and Next goes forward through it, then on to the next song of the shuffle.
  // order is the songs still to play in this round. With Shuffle off, Next plays the next song of the list, and after the last
  // one the first.
  let current = 0, played = [], pos = 0, order = [];
  // started is true once the reader has played a song. waiting is true while the song stops to load more of itself. failures
  // counts the songs in a row that could not load. seekTo is a place to move to when the song has loaded enough to move.
  let started = false, waiting = false, failures = 0, seekTo = null;
  function shuffled(avoid) {
    const all = SONGS_.map((s, i) => i);
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    if (all.length > 1 && all[0] === avoid) all.push(all.shift());
    return all;
  }
  const length = () => isFinite(audio.duration) && audio.duration > 0 ? audio.duration : SONGS_[current].seconds;
  const at = () => seekTo ?? audio.currentTime;
  const playing = () => !audio.paused && !audio.ended;

  // Puts song i in the player, and plays it when go is true.
  function load(i, go) {
    current = i; seekTo = null; waiting = false;
    audio.src = `audio/${SONGS_[i].file}.mp3`;
    loudness(true);
    levels(i);
    tell();
    if (go) play();
  }
  // Play must be called during the reader's tap, so that the browser lets the song start.
  function play() {
    // A tap after every song failed to load tries the song in the player again.
    if (failures >= N) { failures = 0; audio.load(); }
    started = true;
    audio.preload = 'auto';
    try { localStorage.setItem(LAST, SONGS_[current].file); } catch (e) {}
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
    tell();
  }
  function pause() { audio.pause(); tell(); }
  function toggle() { if (playing()) pause(); else play(); }
  // A song that ends plays the next one, with ended true. With Repeat off, the song after the last one is put in the player and
  // does not play.
  function next(ended) {
    let i, go = true;
    if (set.shuffle) {
      if (pos < played.length - 1) i = played[++pos];
      else {
        if (!order.length) { order = shuffled(current); go = !(ended && set.repeat === 'off'); }
        i = order.shift(); played.push(i); pos = played.length - 1;
      }
    } else {
      i = (current + 1) % N;
      go = !(ended && set.repeat === 'off' && i === 0);
    }
    load(i, go);
  }
  // Previous starts the song again when it has played for more than 3 seconds, or when there is no song before it, as on a
  // computer, and otherwise plays the song before it.
  function previous() {
    if (at() > 3 || (set.shuffle && pos === 0)) { seek(0); play(); return; }
    if (set.shuffle) load(played[--pos], true);
    else load((current - 1 + N) % N, true);
  }
  // Tapping a song in the list plays it. The rest of the round of the shuffle plays after it, without it.
  function pick(i) {
    if (i === current) return toggle();
    if (set.shuffle) { played = played.slice(0, pos + 1).concat(i); pos = played.length - 1; order = order.filter(k => k !== i); }
    load(i, true);
  }
  function seek(t) {
    t = Math.max(0, Math.min(t, length() - .2));
    if (audio.readyState >= 1) { audio.currentTime = t; seekTo = null; } else seekTo = t;
    position();
  }
  function shuffle() {
    set.shuffle = !set.shuffle; keep();
    if (set.shuffle) { order = shuffled(current).filter(i => i !== current); played = [current]; pos = 0; }
    show.modes();
  }
  function repeat() {
    set.repeat = { all: 'one', one: 'off', off: 'all' }[set.repeat] || 'all'; keep();
    audio.loop = set.repeat === 'one';
    show.modes();
  }

  audio.addEventListener('ended', () => next(true));
  audio.addEventListener('playing', () => { waiting = false; failures = 0; tell(); });
  audio.addEventListener('waiting', () => { waiting = true; });
  audio.addEventListener('play', tell);
  audio.addEventListener('pause', tell);
  audio.addEventListener('seeked', position);
  audio.addEventListener('loadedmetadata', () => { if (seekTo !== null) { audio.currentTime = seekTo; seekTo = null; } position(); });
  // A song that cannot load is skipped. When no song can load, the player stops and says so.
  audio.addEventListener('error', () => {
    if (!audio.getAttribute('src')) return;
    if (++failures < N) setTimeout(() => next(false), 1200);
    else { audio.pause(); waiting = false; }
  });

  // ---------- The lock screen and the system's controls ----------
  const media = 'mediaSession' in navigator ? navigator.mediaSession : null;
  const COVER = new URL('audio/cover.png', location.href).href;
  if (media) {
    const on = (act, fn) => { try { media.setActionHandler(act, fn); } catch (e) {} };
    on('play', play); on('pause', pause); on('previoustrack', previous); on('nexttrack', () => next(false));
    on('seekto', d => seek(d.seekTime));
  }
  function tell() {
    if (!media) return;
    const song = SONGS_[current];
    if (typeof MediaMetadata === 'function' && (!media.metadata || media.metadata.title !== song.title)) {
      try { media.metadata = new MediaMetadata({ title: song.title, artist: 'Wardens of the Swift', album: 'Wardens of the Swift', artwork: [{ src: COVER, sizes: '512x512', type: 'image/png' }] }); } catch (e) {}
    }
    if (started) media.playbackState = playing() ? 'playing' : 'paused';
    position();
  }
  function position() {
    if (!media || !media.setPositionState || !started) return;
    const d = length();
    try { media.setPositionState({ duration: d, playbackRate: 1, position: Math.max(0, Math.min(d, at())) }); } catch (e) {}
  }

  // ---------- The levels of the music ----------
  // Each song's levels, from library/music.js: 10 bands, from low to high, LEVEL_FPS times a second, one byte each. They are
  // loaded when the song is put in the player.
  const LEVEL_FPS = 30, BANDS = 10, levelsOf = {}, now = new Float32Array(BANDS);
  function levels(i) {
    const file = SONGS_[i].file;
    if (file in levelsOf) return;
    levelsOf[file] = null;
    fetch(`audio/${file}.levels`).then(r => r.ok ? r.arrayBuffer() : Promise.reject(r.status))
      .then(b => { levelsOf[file] = new Uint8Array(b); }).catch(() => { delete levelsOf[file]; });
  }
  // The levels at t seconds into the song in the player, from 0 to 1, between the two frames around t.
  function levelsAt(t) {
    const data = levelsOf[SONGS_[current].file];
    if (!data || !data.length) return null;
    const frames = data.length / BANDS, x = Math.max(0, t * LEVEL_FPS), a = Math.min(frames - 1, Math.floor(x)), b = Math.min(frames - 1, a + 1), w = x - Math.floor(x);
    for (let k = 0; k < BANDS; k++) now[k] = (data[a * BANDS + k] * (1 - w) + data[b * BANDS + k] * w) / 255;
    return now;
  }

  // ---------- The page ----------
  // The emblem of the music panel, as sky.js draws it: a ring with fine marks that turns slowly, four small stars that turn the
  // other way, and a disc of sky, which the picture of the music is drawn over.
  const marks = Array.from({ length: 72 }, (_, i) => {
    const a = i / 72 * Math.PI * 2, r1 = i % 6 ? 57 : 52.5;
    return `<line x1="${f(Math.cos(a) * r1)}" y1="${f(Math.sin(a) * r1)}" x2="${f(Math.cos(a) * 60)}" y2="${f(Math.sin(a) * 60)}"/>`;
  }).join('');
  const four = [0, 1, 2, 3].map(i => { const a = (i + .5) * Math.PI / 2; return `<path d="${sparkle(Math.cos(a) * 64, Math.sin(a) * 64, 3.4)}"/>`; }).join('');
  const EMBLEM = `<svg viewBox="-66 -66 132 132" aria-hidden="true">
    <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="180s" repeatCount="indefinite"/>
      <circle r="64" fill="none" stroke="rgba(230,196,119,.16)" stroke-dasharray="1 3.5"/><circle r="60" fill="none" stroke="rgba(230,196,119,.45)"/>
      <g stroke="rgba(230,196,119,.42)" stroke-width=".6">${marks}</g></g>
    <g fill="#fbe7b0"><animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="240s" repeatCount="indefinite"/>${four}</g>
    <circle r="47" fill="rgba(5,7,18,.82)" stroke="rgba(230,196,119,.3)" stroke-dasharray="2 3"/></svg>`;
  // The controls, with the symbols of the music panel. Shuffle is two paths that cross, each with an arrowhead. Repeat is a
  // loop of two arrows, with a 1 inside it when one song repeats.
  const ICON = {
    previous: '<path d="M6 6h2v12H6zM9.5 12L18 18V6z"/>',
    next: '<path d="M6 18l8.5-6L6 6zM16 6v12h2V6z"/>',
    play: '<path class="pl" d="M8.5 5.5v13l10.5-6.5z"/><path class="pa" d="M7 5.5h3.6v13H7zM13.4 5.5H17v13h-3.6z"/>',
    shuffle: '<path d="M3.5 7H7c2.6 0 3.6 1.4 5 4.6S14.4 17 17 17h3.2M17.8 14.6l2.4 2.4-2.4 2.4"/><path d="M3.5 17H7c2.6 0 3.6-1.4 5-4.6S14.4 7 17 7h3.2M17.8 4.6l2.4 2.4-2.4 2.4"/>',
    repeat: '<path d="M4.5 12.5V10A3 3 0 0 1 7.5 7h12M17 4.5L19.5 7 17 9.5"/><path d="M19.5 11.5V14a3 3 0 0 1-3 3h-12M7 19.5L4.5 17 7 14.5"/><path class="one" d="M11.2 10.6l1.3-.9v4.6"/>',
  };
  const button = (cls, act, label, icon, size) => `<button class="${cls}" data-act="${act}" aria-label="${label}"><svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${icon}</svg></button>`;
  const mins = Math.round(SONGS_.reduce((s, x) => s + x.seconds, 0) / 60);

  // What the page shows changes in show: each frame, and when the reader changes a choice.
  const show = {};
  let page = null, ui = null;

  function build(box) {
    const old = box.querySelector('.bk-page');
    if (old) old.remove();
    document.title = 'Wardens of the Swift';
    page = document.createElement('div');
    page.className = 'pl-page';
    page.innerHTML = `<div class="pl-grid">
      <div class="pl-head">
        <h1 class="pl-title"><svg role="img" aria-label="Wardens of the Swift" viewBox="${Title.box.join(' ')}">${Title.svg()}</svg></h1>
        <div class="pl-note">
          <h2 class="ytitle"><span>For the full experience</span></h2>
          <p>Open Wardens of the Swift in Google Chrome on a computer. On this device, you can listen to its music.</p>
          <button class="ysettings pl-share"><i>✦</i><span>Share the link</span></button>
        </div>
      </div>
      <section class="pl-card" aria-label="Music player">
        <div class="pl-body">
          <div class="pl-emblem">${EMBLEM}<canvas></canvas></div>
          <div class="ynow"><i></i><span>Ready</span></div>
          <div class="ysong"><span></span></div>
          <div class="pl-prog">
            <div class="pl-range pl-seek" role="slider" tabindex="0" aria-label="Where the song is" aria-valuemin="0"><u></u><i></i><b></b></div>
            <div class="ytimes"><span class="pl-at">0:00</span><span class="pl-len">0:00</span></div>
          </div>
          <div class="ycontrols pl-controls">
            ${button('pl-mode', 'shuffle', 'Shuffle', ICON.shuffle, 22)}
            ${button('yskip', 'previous', 'Previous', ICON.previous, 26)}
            ${button('yplay paused', 'toggle', 'Play', ICON.play, 28)}
            ${button('yskip', 'next', 'Next', ICON.next, 26)}
            ${button('pl-mode', 'repeat', 'Repeat', ICON.repeat, 22)}
          </div>
          ${canVolume ? `<div class="pl-vol"><div class="ytop"><span>MUSIC</span><b></b></div>
            <div class="pl-range pl-volume" role="slider" tabindex="0" aria-label="Music volume" aria-valuemin="0" aria-valuemax="100"><u></u><i></i><b></b></div></div>` : ''}
        </div>
      </section>
      <section class="pl-list" aria-label="Songs">
        <h2 class="ytitle"><span>Soundtrack</span></h2>
        <p class="ysmall">${N} songs · ${mins} minutes</p>
        <ol class="pl-songs">${SONGS_.map((s, i) => `<li><button class="pl-row" data-i="${i}">
          <span class="pl-n"><b>${i + 1}</b><span class="pl-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="pl-star" aria-hidden="true">✦</span></span>
          <span class="pl-name">${s.title}</span><span class="pl-time">${clock(s.seconds)}</span></button></li>`).join('')}</ol>
      </section>
      <footer class="pl-foot">${location.host || 'wardensoftheswift.com'}</footer>
    </div>
    <div class="pl-mini" aria-label="Music">
      <span class="pl-mname"></span>
      ${button('pl-mplay', 'toggle', 'Play', ICON.play, 22)}
      ${button('pl-mnext', 'next', 'Next', ICON.next, 22)}
    </div>`;
    box.appendChild(page);
    box.appendChild(audio);
    const one = q => page.querySelector(q);
    ui = { canvas: one('.pl-emblem canvas'), song: one('.ysong'), now: one('.ynow'), state: one('.ynow span'), seek: one('.pl-seek'),
      at: one('.pl-at'), len: one('.pl-len'), mini: one('.pl-mini'), mname: one('.pl-mname'), vol: one('.pl-vol b') };

    const card = page.querySelector('.pl-card');
    const place = edge(card);
    requestAnimationFrame(() => card.classList.add('opening'));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);

    // The controls. Each one acts during the tap, so the browser lets the song start.
    const ACT = { toggle, previous, next: () => next(false), shuffle, repeat };
    page.querySelectorAll('button[data-act]').forEach(b => b.addEventListener('click', () => ACT[b.dataset.act]()));
    page.querySelectorAll('.pl-row').forEach(b => b.addEventListener('click', () => pick(+b.dataset.i)));
    addEventListener('keydown', e => {
      if (e.key === ' ' && !e.target.closest('button, [role="slider"]')) { e.preventDefault(); toggle(); }
    });

    // The bar of where the song is moves the song only when the reader lets go, and shows where it will go while they drag.
    const seekBar = slider(page.querySelector('.pl-seek'), {
      step: () => 5 / length(),
      drag: p => { ui.at.textContent = clock(p * length()); },
      done: p => seek(p * length()),
    });
    const volBar = canVolume && slider(page.querySelector('.pl-volume'), {
      step: () => .05,
      drag: p => { set.volume = p; vol = p; loudness(false); show.volume(); },
      done: () => keep(),
    });
    show.volume = () => {
      if (!volBar) return;
      volBar.set(vol);
      ui.vol.textContent = Math.round(vol * 100);
    };
    show.modes = () => {
      const sh = page.querySelector('[data-act="shuffle"]'), rp = page.querySelector('[data-act="repeat"]');
      sh.classList.toggle('on', set.shuffle); sh.setAttribute('aria-pressed', set.shuffle);
      sh.setAttribute('aria-label', set.shuffle ? 'Shuffle is on' : 'Shuffle is off');
      rp.classList.toggle('on', set.repeat !== 'off'); rp.classList.toggle('one', set.repeat === 'one');
      rp.setAttribute('aria-label', { all: 'Repeat every song', one: 'Repeat this song', off: 'Repeat is off' }[set.repeat]);
    };

    // The button that shares the link opens the device's own way to share it, such as AirDrop, Messages, or Mail, so the
    // reader can send it to their computer. A browser that cannot share copies the link, and one that can do neither shows no
    // button.
    const share = page.querySelector('.pl-share'), word = share.querySelector('span');
    if (!navigator.share) { if (navigator.clipboard) word.textContent = 'Copy the link'; else share.remove(); }
    share.addEventListener('click', async () => {
      try {
        if (navigator.share) await navigator.share({ title: 'Wardens of the Swift', url: Blocker.link });
        else { await navigator.clipboard.writeText(Blocker.link); word.textContent = 'Link copied'; setTimeout(() => { word.textContent = 'Copy the link'; }, 2400); }
      } catch (e) {}
    });

    // The small bar at the bottom shows while more than half of the player's controls are scrolled up out of view.
    const mini = ui.mini;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => mini.classList.toggle('on', e.intersectionRatio < .5 && e.boundingClientRect.top < (e.rootBounds ? e.rootBounds.top : 0)), { root: box, threshold: [0, .5, 1] })
        .observe(page.querySelector('.pl-controls'));
    }

    // The first song: with Shuffle on, a random song that is not the one that started last time, and with it off, the song
    // after that one in the list.
    let last = null;
    try { last = localStorage.getItem(LAST); } catch (e) {}
    const was = SONGS_.findIndex(s => s.file === last);
    if (set.shuffle) { order = shuffled(was); current = order.shift(); }
    else current = (was + 1) % N;
    played = [current]; pos = 0;
    if (N) load(current, false);
    show.modes(); show.volume();
    seekBar.set(0);
    requestAnimationFrame(frame);
  }

  // The gold edge of the player, as sky.js draws the edge of a panel: a fine gold line with a fainter line just inside it, a
  // star on the top edge, a small diamond on each side, level with the song's name, and one at the bottom. It follows the
  // player's size. It returns the function that places it.
  function edge(card) {
    const svg = el('svg', { class: 'yedge', 'aria-hidden': 'true' });
    card.insertBefore(svg, card.firstChild);
    const defs = el('defs', {}, svg);
    const gold = el('linearGradient', { id: 'plGold', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    [[0, 'rgba(251,231,176,.95)'], [.4, 'rgba(230,196,119,.55)'], [1, 'rgba(230,196,119,.22)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gold));
    const halo = el('radialGradient', { id: 'plHalo' }, defs);
    [[0, .7], [.35, .2], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#e6c477', 'stop-opacity': a }, halo));
    const lines = [1, -1].flatMap(side => [
      { side, inset: .5, r: 21.5, gap: 13, el: el('path', { class: 'line', pathLength: 1, stroke: 'url(#plGold)', 'stroke-width': 1 }, svg) },
      { side, inset: 5.5, r: 16.5, gap: 18, el: el('path', { class: 'line inner', pathLength: 1, stroke: 'url(#plGold)', 'stroke-width': .8, opacity: .38 }, svg) }]);
    const diamond = (cls, s) => el('path', { class: cls, d: `M0 ${-s}L${s} 0L0 ${s}L${-s} 0Z`, fill: '#0b0f22', stroke: '#e6c477', 'stroke-width': 1 }, svg);
    const sides = [diamond('yside', 3.6), diamond('yside', 3.6)], end = diamond('yend', 4.4);
    const crown = el('g', {}, svg), star = el('g', { class: 'ig ycrown' }, crown);
    el('circle', { r: 17, fill: 'url(#plHalo)', class: 'halo' }, star);
    el('path', { d: sparkle(0, 0, 9), fill: '#fbe7b0' }, star);
    el('circle', { r: 1.6, fill: '#fff' }, star);
    function place() {
      const w = card.offsetWidth, h = card.offsetHeight;
      if (!w) return;
      svg.setAttribute('width', w); svg.setAttribute('height', h);
      lines.forEach(({ side, inset, r, gap, el: path }) => {
        const m = w / 2, x = side > 0 ? w - inset : inset, t = inset, b = h - inset, sweep = side > 0 ? 1 : 0;
        path.setAttribute('d', `M${m + side * gap} ${t}H${x - side * r}A${r} ${r} 0 0 ${sweep} ${x} ${t + r}V${b - r}A${r} ${r} 0 0 ${sweep} ${x - side * r} ${b}H${m + side * 6}`);
      });
      const name = card.querySelector('.ysong'), y = name ? name.offsetTop + name.offsetHeight / 2 : h / 2;
      sides[0].setAttribute('transform', `translate(.5 ${y})`); sides[1].setAttribute('transform', `translate(${w - .5} ${y})`);
      end.setAttribute('transform', `translate(${w / 2} ${h - .5})`);
      crown.setAttribute('transform', `translate(${w / 2} .5)`);
    }
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(card); else addEventListener('resize', place);
    place();
    return place;
  }

  // A bar to drag along, for where the song is and for the volume: a thin gold bar between two small diamonds, with a star at
  // its end. A finger can tap a place on it, or drag along it. The page still scrolls when the finger moves up or down, and
  // then the bar goes back to where it was. drag(p) is called as the value changes, and done(p) when the finger lets go, with p
  // from 0 to 1. The arrow keys move it by step().
  function slider(bar, { step, drag, done }) {
    let p = 0, before = 0, dragging = false;
    const put = v => { p = Math.max(0, Math.min(1, v)); bar.style.setProperty('--p', p.toFixed(4)); bar.setAttribute('aria-valuenow', Math.round(p * 100)); };
    const from = e => { const r = bar.getBoundingClientRect(); return (e.clientX - r.left) / r.width; };
    bar.addEventListener('pointerdown', e => {
      if (e.button) return;
      dragging = true; before = p; bar.classList.add('drag');
      try { bar.setPointerCapture(e.pointerId); } catch (err) {}
      put(from(e)); drag(p);
    });
    bar.addEventListener('pointermove', e => { if (dragging) { put(from(e)); drag(p); } });
    const stop = keepIt => { if (!dragging) return; dragging = false; bar.classList.remove('drag'); if (keepIt) done(p); else { put(before); drag(p); } };
    bar.addEventListener('pointerup', () => stop(true));
    bar.addEventListener('pointercancel', () => stop(false));
    bar.addEventListener('keydown', e => {
      const by = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (by) { e.preventDefault(); put(p + by * step()); drag(p); done(p); }
      if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); put(e.key === 'Home' ? 0 : 1); drag(p); done(p); }
    });
    return { set(v) { if (!dragging) put(v); }, get dragging() { return dragging; } };
  }

  // The song's name is one line, as in the music panel: a name wider than its box is set smaller, from 31 pixels down to 22,
  // and a name still too wide moves slowly to its end and back, with its cut edges faded. sky.js does the same.
  const SONG = 31, SONG_LEAST = 22, REST = 2500, SPEED = 24, FADE = 22;
  const lessMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let fit = null;
  function showSong(box, title, t) {
    const name = box.firstElementChild, room = box.clientWidth, key = `${title}|${document.fonts ? document.fonts.status : ''}|${room}`;
    if (!room) return;
    if (!fit || fit.key !== key) {
      if (name.textContent !== title) name.textContent = title;
      name.style.transform = ''; name.style.fontSize = SONG + 'px';
      const size = Math.max(SONG_LEAST, Math.min(SONG, Math.floor(SONG * room / name.offsetWidth * 10) / 10));
      name.style.fontSize = size + 'px';
      const over = name.offsetWidth - room > 1 ? name.offsetWidth - room : 0;
      fit = { key, over, start: t };
      box.classList.toggle('long', over > 0);
      box.title = over ? title : '';
    }
    if (!fit.over) return;
    const move = Math.max(1600, fit.over / SPEED * 1000), ease = u => (1 - Math.cos(Math.PI * u)) / 2;
    let s = lessMotion.matches ? 0 : (t - fit.start) % (2 * (REST + move)), q;
    if (s < REST) q = 0;
    else if ((s -= REST) < move) q = ease(s / move);
    else if ((s -= move) < REST) q = 1;
    else q = 1 - ease((s - REST) / move);
    const x = fit.over * q;
    name.style.transform = `translateX(${(-x).toFixed(2)}px)`;
    box.style.setProperty('--l', (Math.min(1, x / 14) * FADE).toFixed(1) + 'px');
    box.style.setProperty('--r', (Math.min(1, (fit.over - x) / 14) * FADE).toFixed(1) + 'px');
  }

  // Each frame: the picture of the music, the song's name, where the song is, the middle control, the list, and the small bar.
  // The picture is the one the music panel draws: 72 fine rays around a small star, in the emblem's disc. Each ray shows one
  // band of the song's frequencies, the low bands up, down, left, and right, and higher bands toward the diagonals. A ray grows
  // quickly and shrinks slowly, at the same speed on a screen that draws 60 or 120 frames a second. With the song stopped, the
  // rays lie short and still.
  const RAYS = 72, rays = new Float32Array(RAYS);
  let lastT = 0, shown = '';
  const write = (node, text) => { if (node.textContent !== text) node.textContent = text; };
  function frame(t) {
    requestAnimationFrame(frame);
    const dt = lastT ? Math.min(100, t - lastT) : 16.7; lastT = t;
    const live = playing() && !waiting, lv = live ? levelsAt(audio.currentTime) : null;
    const grow = 1 - Math.pow(.5, dt / 16.7), fall = 1 - Math.pow(.91, dt / 16.7), loud = .35 + .65 * Math.sqrt(vol);
    for (let k = 0; k < RAYS; k++) {
      const u = (k / RAYS * 4) % 1, high = u < .5 ? u * 2 : (1 - u) * 2, band = Math.round(high * (BANDS - 1));
      const target = lv ? Math.min(1, lv[band] * (1 + high * .7)) * loud : 0;
      rays[k] += (target - rays[k]) * (target > rays[k] ? grow : fall);
    }
    const canvas = ui.canvas, css = canvas.clientWidth;
    if (css) {
      const d = Math.min(3, devicePixelRatio || 1), px = Math.round(css * d), g = canvas.getContext('2d'), s = css / 94;
      if (canvas.width !== px) canvas.width = canvas.height = px;
      g.setTransform(d * s, 0, 0, d * s, px / 2, px / 2);
      g.clearRect(-47, -47, 94, 94);
      g.lineCap = 'round'; g.lineWidth = 1.1; g.shadowColor = 'rgba(230,196,119,.8)'; g.shadowBlur = 6 * s * d;
      for (let k = 0; k < RAYS; k++) {
        const a = k / RAYS * Math.PI * 2 - Math.PI / 2, still = .9 + .5 * Math.sin(t / 1100 + k * .45);
        const len = 1.5 + rays[k] * 30 + (lv ? 0 : still);
        g.strokeStyle = `rgba(251,231,176,${(.22 + .78 * rays[k]).toFixed(3)})`;
        g.beginPath(); g.moveTo(Math.cos(a) * 12, Math.sin(a) * 12); g.lineTo(Math.cos(a) * (12 + len), Math.sin(a) * (12 + len)); g.stroke();
      }
      const low = (rays[0] + rays[RAYS / 4] + rays[RAYS / 2] + rays[RAYS * 3 / 4]) / 4;
      g.strokeStyle = 'rgba(251,231,176,.35)'; g.lineWidth = .7;
      g.beginPath(); g.arc(0, 0, 9.5, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#fbe7b0'; g.fill(new Path2D(sparkle(0, 0, 4.5 + low * 5)));
      g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 1.2, 0, Math.PI * 2); g.fill();
    }
    if (!N) return;
    const song = SONGS_[current], on = playing();
    showSong(ui.song, song.title, t);
    const state = failures >= N ? 'The songs could not load' : !started && !on ? 'Ready' : on && waiting ? 'Loading' : on ? 'Now playing' : 'Paused';
    write(ui.state, failures >= N ? state : `${state} · ${current + 1} of ${N}`);
    ui.now.classList.toggle('live', live);
    if (!ui.seek.classList.contains('drag')) {
      ui.seek.style.setProperty('--p', Math.min(1, at() / length()).toFixed(4));
      ui.seek.setAttribute('aria-valuenow', Math.round(at() / length() * 100));
      ui.seek.setAttribute('aria-valuetext', `${clock(at())} of ${clock(length())}`);
      write(ui.at, clock(at()));
    }
    write(ui.len, clock(length()));
    // The middle control shows Pause while the song plays, and Play while it does not. So do the list and the small bar.
    const now = `${current}|${on}`;
    if (now !== shown) {
      shown = now;
      page.querySelectorAll('.yplay, .pl-mplay').forEach(b => { b.classList.toggle('paused', !on); b.setAttribute('aria-label', on ? 'Pause' : 'Play'); });
      page.querySelectorAll('.pl-row').forEach((b, i) => {
        b.classList.toggle('on', i === current); b.classList.toggle('live', i === current && on);
        if (i === current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      write(ui.mname, song.title);
      show.volume();
    }
    ui.mini.style.setProperty('--p', Math.min(1, at() / length()).toFixed(4));
  }

  return {
    on: true, build,
    // For testing: what plays, and the choices.
    state: () => ({ song: SONGS_[current] && SONGS_[current].title, current, at: +at().toFixed(1), length: +length().toFixed(1), playing: playing(), waiting, started, canVolume, vol, element: +audio.volume.toFixed(3), played: played.slice(), pos, order: order.slice(), ...set }),
    seek, next: () => next(false), previous, pick,
  };
})();
