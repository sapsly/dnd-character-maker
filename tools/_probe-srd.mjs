// Probe candidate machine-readable SRD sources. Prints only status/shape, never payloads.
const CANDIDATES = [
  ['5e-database master', 'https://raw.githubusercontent.com/5e-bits/5e-database/master/data/spells.json'],
  ['5e-database srd-5.2', 'https://raw.githubusercontent.com/5e-bits/5e-database/srd-5.2/data/spells.json'],
  ['5e-database v5.5', 'https://raw.githubusercontent.com/5e-bits/5e-database/v5.5.0/data/spells.json'],
];

for (const [label, url] of CANDIDATES) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) { console.log(`${label}: HTTP ${res.status}`); continue; }
    const json = await res.json();
    const spells = Array.isArray(json) ? json : json.spell ?? [];
    const lvl = {};
    for (const s of spells) lvl[s.level] = (lvl[s.level] ?? 0) + 1;
    console.log(`${label}: ${spells.length} spells`);
    console.log(`  perLevel: ${JSON.stringify(lvl)}`);
    console.log(`  keys: ${Object.keys(spells[0] ?? {}).join(',')}`);
    console.log(`  sample[acid-arrow]: ${JSON.stringify(spells.find((s) => s.name === 'Acid Arrow')?.classes)}`);
    console.log(`  classesSeen: ${[...new Set(spells.flatMap((s) => s.classes ?? []))].sort().join(',')}`);
    console.log(`  hasArcaneHand: ${!!spells.find((s) => s.name === 'Arcane Hand')}  hasBigbysHand: ${!!spells.find((s) => s.name === "Bigby's Hand")}`);
    console.log(`  hasIceKnife: ${!!spells.find((s) => s.name === 'Ice Knife')}  hasElementalism: ${!!spells.find((s) => s.name === 'Elementalism')}`);
  } catch (e) {
    console.log(`${label}: FAILED ${e.message}`);
  }
}