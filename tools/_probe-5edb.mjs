// Resolve the right 5e-database ref, then validate it as an SRD 5.2 source.
const api = (p) => fetch(`https://api.github.com/repos/5e-bits/5e-database${p}`, {
  headers: { 'user-agent': 'Mozilla/5.0', accept: 'application/vnd.github+json' },
}).then((r) => r.json());

const info = await api('');
const refs = new Set([info.default_branch, 'main', 'master', 'srd-5.2', '5.2', 'v5.5.0', '5.5']);
for (const t of await api('/tags?per_page=30')) refs.add(t.name);
for (const b of await api('/branches?per_page=50')) refs.add(b.name);
console.log(`default_branch=${info.default_branch} tags+branches=${refs.size}`);

let found = null;
for (const ref of refs) {
  for (const path of ['data/spells.json', 'spells.json', 'data/srd/spells.json']) {
    const url = `https://cdn.jsdelivr.net/gh/5e-bits/5e-database@${ref}/${path}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) continue;
      const txt = await res.text();
      if (txt.trim().startsWith('{') || txt.trim().startsWith('[')) {
        found = { ref, path, url, txt };
        console.log(`HIT ref=${ref} path=${path} bytes=${txt.length}`);
        break;
      }
    } catch { /* unreachable ref */ }
  }
  if (found) break;
}
if (!found) { console.log('no 5e-database spells.json reachable'); process.exit(1); }

const spells = JSON.parse(found.txt);
const arr = Array.isArray(spells) ? spells : spells.spell ?? spells.spells ?? [];
const lvl = {};
for (const s of arr) lvl[s.level] = (lvl[s.level] ?? 0) + 1;
console.log(`count=${arr.length} perLevel=${JSON.stringify(lvl)}`);
console.log(`keys=${Object.keys(arr[0] ?? {}).join(',')}`);
console.log(`classes=${[...new Set(arr.flatMap((s) => s.classes ?? []))].sort().join(',')}`);
console.log(`AcidArrow=${JSON.stringify(arr.find((s) => s.name === 'Acid Arrow')?.classes)}`);
for (const n of ['Arcane Hand', "Bigby's Hand", 'Ice Knife', 'Elementalism', 'Foresight', 'Gate', 'Weird', 'Sorcerous Burst', 'Faithful Hound'])
  console.log(`  has ${n}: ${!!arr.find((s) => s.name === n)}`);