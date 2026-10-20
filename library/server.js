// Serves the pages in ui-ideas/, and writes known.json when the reader marks an idea as known or removes one.
// The address / opens Home of the star theme, and /archive/ opens the archived pages, the warm-gray UI from before the star theme:
//   node library/server.js
// It listens on http://localhost:8772, or on the port in the PORT environment variable.
//
// POST /known with { "add": "braces" } adds that id to known.json, and { "remove": "braces" } takes it out.
// After each change, it runs node library/build.js, so ui-ideas/library-data.js has the same ids as known.json.
// Every file it serves has the header X-Stoicheia-Writes: known.json, which tells a page that this server writes changes.
// A server that only serves files, such as python3 -m http.server, does not send that header, so the pages send it no changes.
// It uses only Node.js's own modules.

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadLibrary, ROOT } = require('./load.js');

const PAGES = path.join(ROOT, 'ui-ideas');
const KNOWN = path.join(ROOT, 'known.json');
const BUILD = path.join(__dirname, 'build.js');
const PORT = Number(process.env.PORT) || 8772;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
};
const HEADERS = { 'Cache-Control': 'no-store', 'X-Stoicheia-Writes': 'known.json' };

// Runs node library/build.js, the same step as running it by hand, and returns the line it prints.
// It throws when the library has a problem, and then library-data.js is not written.
function build() {
  return execFileSync(process.execPath, [BUILD], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

// known.json keeps the form it has when it is written by hand: one line, such as ["function", "closure"].
function writeKnown(ids) {
  const tmp = `${KNOWN}.tmp`;
  fs.writeFileSync(tmp, `[${ids.map(id => JSON.stringify(id)).join(', ')}]\n`);
  fs.renameSync(tmp, KNOWN);
}

// Adds one id to known.json, or removes one, then builds library-data.js. Returns the status of the response and its JSON.
// Nothing is written when the library has a problem, or when the id has no entry in concepts/.
// If the build fails after known.json was written, known.json goes back to what it was, so the two files still match.
function changeKnown(change) {
  const add = change && change.add, remove = change && change.remove;
  const id = add || remove;
  if (typeof id !== 'string' || (add && remove)) return [400, { problems: ['Send { "add": id } or { "remove": id }, with one id.'] }];
  const { entries, known, problems } = loadLibrary();
  if (problems.length) return [500, { problems }];
  if (!Object.prototype.hasOwnProperty.call(entries, id)) return [400, { problems: [`"${id}" has no entry in concepts/, so known.json cannot list it.`] }];
  const next = add ? (known.includes(id) ? known : [...known, id]) : known.filter(k => k !== id);
  if (next.length === known.length) return [200, { known }];
  const before = fs.readFileSync(KNOWN, 'utf8');
  writeKnown(next);
  try {
    const built = build();
    console.log(`known.json: ${add ? 'added' : 'removed'} "${id}". It is now ${JSON.stringify(next)}. ${built}`);
    return [200, { known: next }];
  } catch (err) {
    fs.writeFileSync(KNOWN, before);
    return [500, { problems: [String(err.stderr || err.message).trim()] }];
  }
}

function sendJSON(res, status, body) {
  res.writeHead(status, { ...HEADERS, 'Content-Type': TYPES['.json'] });
  res.end(JSON.stringify(body));
}

// A change is taken only from a page that this server served. A page on another site cannot send one:
// the Host header must name this computer, the Origin header, when there is one, must be this server,
// and the body must be JSON, which a browser sends to another site only after that site allows it.
function fromOwnPage(req) {
  const host = req.headers.host || '';
  const hostname = host.replace(/:\d+$/, '');
  if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname)) return false;
  if (req.headers.origin && req.headers.origin !== `http://${host}`) return false;
  return /^application\/json\b/.test(req.headers['content-type'] || '');
}

function postKnown(req, res) {
  if (!fromOwnPage(req)) return sendJSON(res, 403, { problems: ['Only a page that this server served can change known.json.'] });
  let body = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 10000) { sendJSON(res, 413, { problems: ['A change is one id, so its body is short.'] }); req.destroy(); }
  });
  req.on('end', () => {
    if (res.headersSent) return;
    let change;
    try { change = JSON.parse(body); } catch (err) { return sendJSON(res, 400, { problems: [`The body is not JSON: ${err.message}`] }); }
    const [status, out] = changeKnown(change);
    if (status !== 200) console.error(`known.json was not changed: ${out.problems.join(' ')}`);
    sendJSON(res, status, out);
  });
}

// A file from ui-ideas/. The address / is index.html. No address can reach a file outside ui-ideas/.
function serveFile(req, res) {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch (err) { rel = null; }
  if (rel && rel.endsWith('/')) rel += 'index.html';
  const file = rel && path.join(PAGES, rel);
  if (!file || !file.startsWith(PAGES + path.sep)) return sendJSON(res, 404, { problems: ['No such file.'] });
  fs.readFile(file, (err, data) => {
    // A folder's address without its last /, such as /archive, goes to /archive/, so the links in its index.html find their pages.
    if (err && err.code === 'EISDIR') { res.writeHead(301, { ...HEADERS, Location: `${encodeURI(rel)}/` }); return res.end(); }
    if (err) return sendJSON(res, 404, { problems: [`ui-ideas${rel} does not exist.`] });
    res.writeHead(200, { ...HEADERS, 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Content-Length': data.length });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const route = req.url.split('?')[0];
    if (route === '/known') {
      if (req.method === 'POST') return postKnown(req, res);
      res.setHeader('Allow', 'POST');
      return sendJSON(res, 405, { problems: ['/known takes a POST with one change.'] });
    }
    if (req.method === 'GET' || req.method === 'HEAD') return serveFile(req, res);
    res.setHeader('Allow', 'GET, HEAD');
    sendJSON(res, 405, { problems: [`${req.method} is not used here.`] });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) sendJSON(res, 500, { problems: [err.message] });
  }
});

// On start, the server builds library-data.js once, so the pages read what known.json holds now, even after a change by hand.
try { console.log(build()); } catch (err) { console.error(String(err.stderr || err.message).trim()); }
// It listens on this computer only.
server.listen(PORT, '127.0.0.1', () => console.log(`Stoicheia: serving ui-ideas/ on http://localhost:${PORT}, and writing known.json.`));
