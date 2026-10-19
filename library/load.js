// Reads the concept library from disk: one entry for each JSON file in concepts/, and the ids in known.json.
// It checks every entry with the checks in ui-ideas/library.js, the same code the pages run.

const fs = require('fs');
const path = require('path');
const Library = require('../ui-ideas/library.js');

const ROOT = path.join(__dirname, '..');
const CONCEPTS = path.join(ROOT, 'concepts');
const KNOWN = path.join(ROOT, 'known.json');

// Returns { entries, known, problems }. entries maps each id to its entry. problems lists each thing wrong, in one sentence.
function loadLibrary() {
  const entries = {}, problems = [];
  for (const file of fs.readdirSync(CONCEPTS).filter(f => f.endsWith('.json')).sort()) {
    const id = file.slice(0, -'.json'.length);
    try {
      entries[id] = JSON.parse(fs.readFileSync(path.join(CONCEPTS, file), 'utf8'));
    } catch (err) {
      problems.push(`${id}: concepts/${file} is not valid JSON: ${err.message}`);
    }
  }
  let known = [];
  try {
    known = JSON.parse(fs.readFileSync(KNOWN, 'utf8'));
    if (!Array.isArray(known)) { problems.push('known.json: it must be a list of ids'); known = []; }
  } catch (err) {
    problems.push(`known.json: ${err.message}`);
  }
  problems.push(...Library.checkLibrary(entries, known));
  return { entries, known, problems };
}

module.exports = { loadLibrary, ROOT };
