// Isolate which hosts Node fetch can reach, and locate an SRD JSON mirror.
const TARGETS = [
  ['CONTROL vtt', 'https://virtualtabletoptools.com/classes/srd-2024_wizard/'],
  ['jsdelivr gh', 'https://cdn.jsdelivr.net/gh/5e-bits/5e-database@master/data/spells.json'],
  ['gh api', 'https://api.github.com/repos/5e-bits/5e-database'],
  ['unpkg dnd', 'https://unpkg.com/dnd-spells@latest/spells.json'],
  ['registry npm', 'https://registry.npmjs.org/5e-database'],
  ['omnisgm', 'https://rules.omnisgm.com/en/dnd/srd-5.2/spells/all/'],
  ['dnd5e.tools', 'https://dnd5e.tools/spells'],
];

for (const [label, url] of TARGETS) {
  const t = Date.now();
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20000) });
    const buf = await res.arrayBuffer();
    console.log(`${label}: HTTP ${res.status} bytes=${buf.byteLength} ct=${res.headers.get('content-type')} ${Date.now() - t}ms`);
  } catch (e) {
    console.log(`${label}: FAIL ${e.message?.slice(0, 80)} (${e.cause?.code ?? ''}) ${Date.now() - t}ms`);
  }
}