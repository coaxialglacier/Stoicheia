// Builds ui-ideas/library-data.js from concepts/ and known.json, after checking every entry.
// The pages load that file, so run this after any change to an entry or to known.json:
//   node library/build.js

const fs = require('fs');
const path = require('path');
const { loadLibrary, ROOT } = require('./load.js');

const { entries, known, problems } = loadLibrary();
if (problems.length) {
  console.error(`The library has ${problems.length} ${problems.length === 1 ? 'problem' : 'problems'}, so library-data.js was not written:`);
  problems.forEach(p => console.error(`  ✗ ${p}`));
  process.exit(1);
}
const out = path.join(ROOT, 'ui-ideas', 'library-data.js');
fs.writeFileSync(out, `// Made by library/build.js from concepts/ and known.json. Do not edit it: change those files, and run node library/build.js.
const LIBRARY = ${JSON.stringify({ entries, known }, null, 1)};
`);
const concepts = Object.values(entries).filter(e => e.example).length;
console.log(`Wrote ui-ideas/library-data.js: ${Object.keys(entries).length} entries, ${concepts} of them concepts with a study, and ${known.length} known ids.`);
