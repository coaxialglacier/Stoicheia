// The title, Wardens of the Swift, drawn large in gold for the night sky of Home. The user named the game on 2026-10-21 and
// chose this design, Aether Crown, from the ideas in title-ideas.html, without the stars that were above WARDENS.
// Three lines, centered: WARDENS; OF THE, small, between two fine lines that fade outward and end in diamonds; and SWIFT, larger.
// A soft band of pale light with small stars in it lies behind SWIFT, as the aether. Every ten seconds a band of white light
// crosses the gold letters. The user had the line and the star under SWIFT removed on 2026-10-21.
// Title.svg() returns the inside of an SVG, in units whose box is Title.box: [x, y, width, height], for its viewBox.
// heavens.js draws it at the top of the night sky.

const Title = (() => {
  // Cinzel's capitals are about 0.7 of its font size, so a word's capitals run from y - 0.7 * size up to its baseline y.
  const CAP = .7;
  const f = n => +n.toFixed(2);
  // The gold of the letters: light at the top of the capitals, darker just under their middle, and light again at the baseline.
  const GOLD = [[0, '#fff8e3'], [.36, '#f5dc9b'], [.55, '#ddb262'], [.62, '#a77b35'], [.71, '#d4a756'], [1, '#f5d68e']];
  function rnd(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  // A word in gold, in four layers: a soft glow, a dark copy a little lower that gives the letters depth, the gold face with a
  // thin light edge, and the band of light that crosses it. len is the width the word is spread to.
  function word(t, id, y, size, len) {
    const at = `x="500" y="${y}" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="${size}" textLength="${len}" lengthAdjust="spacing"`;
    return `<defs>
      <filter id="${id}-b" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="${f(size * .11)}"/></filter>
      <linearGradient id="${id}-g" gradientUnits="userSpaceOnUse" x1="0" y1="${f(y - size * CAP)}" x2="0" y2="${y}">${GOLD.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>
      <linearGradient id="${id}-s" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="150" y2="-70">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
        <animateTransform attributeName="gradientTransform" type="translate" values="-300 0;1300 0;1300 0" keyTimes="0;.3;1" dur="10s" begin="2.4s" repeatCount="indefinite"/></linearGradient>
    </defs>
    <text ${at} fill="#e6c477" opacity=".42" filter="url(#${id}-b)">${t}</text>
    <text ${at} fill="#3b290b" stroke="#3b290b" stroke-width="${f(size * .03)}" stroke-linejoin="round" transform="translate(0 ${f(size * .025)})">${t}</text>
    <text ${at} fill="url(#${id}-g)" stroke="rgba(255,246,222,.55)" stroke-width="${f(size * .007)}">${t}</text>
    <text ${at} fill="url(#${id}-s)">${t}</text>`;
  }
  const diamond = (x, y, r) => `<path d="M${x} ${y - r}L${f(x + r * .62)} ${y}L${x} ${y + r}L${f(x - r * .62)} ${y}Z" fill="#e6c477"/>`;

  function svg() {
    const r = rnd(11);
    let dust = '';
    for (let i = 0; i < 30; i++) {
      const x = 90 + r() * 820, y = 392 + (r() - .5) * 130 * (1 - Math.abs(x - 500) / 540);
      dust += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(.5 + r() * 1.1)}" fill="#e8f1ff" opacity="${f(.3 + r() * .6)}"/>`;
    }
    // OF THE, with its letters spread 9.9 apart. The space after the last letter is taken back by moving it right by half of it.
    const ofY = 318, ruleY = f(ofY - 22 * CAP / 2 - .5);
    return `<defs>
        <radialGradient id="wt-band"><stop offset="0" stop-color="#bcd6ff" stop-opacity=".2"/><stop offset=".55" stop-color="#7d9fe0" stop-opacity=".07"/><stop offset="1" stop-color="#7d9fe0" stop-opacity="0"/></radialGradient>
        <linearGradient id="wt-in"><stop offset="0" stop-color="#e6c477" stop-opacity="0"/><stop offset="1" stop-color="#e6c477" stop-opacity=".85"/></linearGradient>
        <linearGradient id="wt-out"><stop offset="0" stop-color="#e6c477" stop-opacity=".85"/><stop offset="1" stop-color="#e6c477" stop-opacity="0"/></linearGradient>
      </defs>
      <ellipse cx="500" cy="392" rx="470" ry="78" fill="url(#wt-band)"/>${dust}
      ${word('WARDENS', 'wt-w', 268, 100, 690)}
      <text x="504.95" y="${ofY}" text-anchor="middle" font-family="Cinzel" font-weight="600" font-size="22" letter-spacing="9.9" fill="#f3dc9f" style="filter:drop-shadow(0 0 6px rgba(230,196,119,.5))">OF THE</text>
      <rect x="310" y="${ruleY}" width="118" height="1" fill="url(#wt-in)"/><rect x="572" y="${ruleY}" width="118" height="1" fill="url(#wt-out)"/>
      ${diamond(303, f(ofY - 22 * CAP / 2), 4.5)}${diamond(697, f(ofY - 22 * CAP / 2), 4.5)}
      ${word('SWIFT', 'wt-s', 438, 130, 610)}`;
  }

  // The box around the title's letters and their glow.
  return { box: [130, 186, 740, 272], svg };
})();
