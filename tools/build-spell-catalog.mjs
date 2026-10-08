/**
 * Build spell catalog from D&D 2024 reference source.
 * 
 * Reads index from local HTML/JSON, fetches per-spell pages for descriptions
 * and material component text, emits src/data/spells-*.ts files.
 * 
 * Usage: node tools/build-spell-catalog.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REF_HTML = path.join(PROJECT_ROOT, 'reference/DND website/All Spells - D&D 5e (2024).html');
const REF_JSON = 'C:\\Users\\kaieh\\AppData\\Local\\Temp\\opencode\\ref-spells.json';
const CACHE_DIR = path.join(PROJECT_ROOT, '.spell-cache');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'src/data');

// App class IDs (Artificer excluded)
const APP_CLASSES = new Set([
  'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk',
  'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'
]);

// Species/lineage tags to re-apply (from existing catalog)
const SPECIES_TAGS = {
  // Species-wide grants
  'thaumaturgy': { speciesGrants: ['tiefling'] },
  'light': { speciesGrants: ['aasimar'] },
  'vicious-mockery': { speciesGrants: ['valen'] },
  // Lineage grants
  'chill-touch': { speciesLineages: ['tiefling-chthonic'] },
  'dancing-lights': { speciesLineages: ['elf-drow'] },
  'druidcraft': { speciesLineages: ['elf-wood-elf'] },
  'fire-bolt': { speciesLineages: ['tiefling-infernal'] },
  'mending': { speciesLineages: ['gnome-rock-gnome'] },
  'minor-illusion': { speciesLineages: ['gnome-forest-gnome'] },
  'poison-spray': { speciesLineages: ['tiefling-abyssal'] },
  'prestidigitation': { speciesLineages: ['elf-high-elf', 'gnome-rock-gnome'] },
  'detect-magic': { speciesLineages: ['elf-high-elf'] },
  'faerie-fire': { speciesLineages: ['elf-drow'] },
  'false-life': { speciesLineages: ['tiefling-chthonic'] },
  'hellish-rebuke': { speciesLineages: ['tiefling-infernal'] },
  'longstrider': { speciesLineages: ['elf-wood-elf'] },
  'ray-of-sickness': { speciesLineages: ['tiefling-abyssal'] },
  'speak-with-animals': { speciesLineages: ['gnome-forest-gnome'] },
  'darkness': { speciesLineages: ['elf-drow', 'tiefling-infernal'] },
  'hold-person': { speciesLineages: ['tiefling-abyssal'] },
  'misty-step': { speciesLineages: ['elf-high-elf'] },
  'pass-without-trace': { speciesLineages: ['elf-wood-elf'] },
  'ray-of-enfeeblement': { speciesLineages: ['tiefling-chthonic'] },
};

// Parse index HTML to get spell list (fallback to JSON)
function parseIndexHtml(html) {
  const spells = [];
  // Find all wiki-tab divs with tables
  const tabRegex = /<div id="wiki-tab-0-\d+"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  let tabMatch;
  let level = 0;
  
  while ((tabMatch = tabRegex.exec(html)) !== null) {
    const tabContent = tabMatch[1];
    const tableRegex = /<table class="wiki-content-table">([\s\S]*?)<\/table>/;
    const tableMatch = tabContent.match(tableRegex);
    if (!tableMatch) continue;
    
    const tableContent = tableMatch[1];
    const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
    let rowMatch;
    let firstRow = true;
    
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      if (firstRow) { firstRow = false; continue; } // Skip header
      
      const rowContent = rowMatch[1];
      const cellRegex = /<td>([\s\S]*?)<\/td>/g;
      const cells = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        cells.push(cellMatch[1].trim());
      }
      
      if (cells.length >= 7) {
        // Cell 0: <a href="/spell:slug">Name</a>
        const linkMatch = cells[0].match(/<a href="\/spell:([^"]+)">([^<]+)<\/a>/);
        if (!linkMatch) continue;
        const slug = linkMatch[1];
        const name = linkMatch[2];
        
        // Cell 1: <em>School</em>
        const schoolMatch = cells[1].match(/<em>([^<]+)<\/em>/);
        const school = schoolMatch ? schoolMatch[1] : cells[1].replace(/<[^>]+>/g, '').trim();
        
        // Cell 2: Class list (comma separated)
        const classesStr = cells[2].replace(/<[^>]+>/g, '').trim();
        
        // Cell 3: Casting Time
        const castingTime = cells[3].replace(/<[^>]+>/g, '').trim()
          .replace(/\(\*\)/, '')  // Remove footnote marker
          .replace(/\s+/g, ' ');
        
        // Cell 4: Range
        const range = cells[4].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
        
        // Cell 5: Components
        const components = cells[5].replace(/<[^>]+>/g, '').trim();
        
        // Cell 6: Duration
        const duration = cells[6].replace(/<[^>]+>/g, '').trim()
          .replace(/<em><sup>C<\/sup><\/em>/, 'Concentration')
          .replace(/\s+/g, ' ');
        
        spells.push({
          slug,
          name,
          level,
          school,
          classes: classesStr,
          castingTime,
          range,
          components,
          duration
        });
      }
    }
    level++;
  }
  return spells;
}

// Load index spells from JSON (pre-parsed)
function loadIndexSpells() {
  const jsonContent = fs.readFileSync(REF_JSON, 'utf8');
  return JSON.parse(jsonContent);
}

// Fetch per-spell page with caching
async function fetchSpellPage(slug) {
  const cacheFile = path.join(CACHE_DIR, `${slug}.html`);
  
  if (fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile, 'utf8');
  }
  
  const url = `https://dnd2024.wikidot.com/spell:${slug}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'DND-Character-Manager/1.0 (spell catalog build; +https://github.com)'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  
  const html = await response.text();
  
  // Ensure cache dir exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
  fs.writeFileSync(cacheFile, html, 'utf8');
  
  // Polite delay
  await new Promise(r => setTimeout(r, 100));
  
  return html;
}

// Parse per-spell page for description and material text
function parseSpellPage(html, slug) {
  // Find page-content div (id, not class)
  const contentMatch = html.match(/<div id="page-content">([\s\S]*?)(?:<div class="page-tags">|<script|$)/);
  if (!contentMatch) {
    console.warn(`  Could not find page-content for ${slug}`);
    return { description: '', materialText: undefined };
  }
  
  const content = contentMatch[1];
  
  // Extract stats block (Casting Time, Range, Components, Duration)
  // Handle both <br /> and <br> and newlines
  const statsMatch = content.match(/<p><strong>Casting Time:<\/strong>([\s\S]*?)<strong>Range:<\/strong>([\s\S]*?)<strong>Components:<\/strong>([\s\S]*?)<strong>Duration:<\/strong>([\s\S]*?)<\/p>/);
  
  // Extract description paragraphs (between stats block and higher-level-slot or end)
  let descStart = content.indexOf('</p>', content.indexOf('<strong>Duration:')) + 4;
  if (descStart < 4) descStart = content.indexOf('<p>', content.indexOf('<strong>Duration:')) + 3;
  let descContent = content.substring(descStart);
  
  // Stop at higher-level-slot or page-tags or script
  const stopMarkers = ['<p><strong>Using a Higher-Level Spell Slot', '<div class="page-tags">', '<script'];
  let stopIndex = descContent.length;
  for (const marker of stopMarkers) {
    const idx = descContent.indexOf(marker);
    if (idx !== -1 && idx < stopIndex) stopIndex = idx;
  }
  descContent = descContent.substring(0, stopIndex);
  
  // Convert HTML to plain text
  let description = descContent
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<em>([^<]+)<\/em>/g, '*$1*')
    .replace(/<strong>([^<]+)<\/strong>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/'/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/�/g, "'")  // Handle garbled apostrophes
    .replace(/\u0092/g, "'")  // Right single quote
    .replace(/\u0091/g, "'")  // Left single quote
    .replace(/\u2019/g, "'")  // Right single quotation mark
    .replace(/\u2018/g, "'")  // Left single quotation mark
    .trim();
  
  // Extract material text from Components if present
  let materialText = undefined;
  if (statsMatch) {
    const componentsText = statsMatch[3];
    const matMatch = componentsText.match(/M\s*\(([^)]+)\)/);
    if (matMatch) {
      materialText = matMatch[1].trim();
    }
  }
  
  return { description, materialText };
}

// Parse components string into object
function parseComponents(compStr, materialText) {
  const comp = { verbal: false, somatic: false, material: false, ritual: false };
  const parts = compStr.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part === 'V') comp.verbal = true;
    else if (part === 'S') comp.somatic = true;
    else if (part.startsWith('M')) comp.material = true;
    else if (part === 'R' || part === 'Ritual') comp.ritual = true;
  }
  
  if (materialText) {
    comp.materialText = materialText;
  }
  
  return comp;
}

// Parse duration for concentration
function parseDuration(durStr) {
  // Strip HTML entities first
  const stripped = durStr
    .replace(/<em><sup>C<\/sup><\/em>/gi, 'Concentration')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—');
  const concentration = stripped.toLowerCase().includes('concentration');
  const clean = stripped
    .replace(/Concentration,?\s*/i, '')
    .replace(/^\s*up to\s+/i, 'Up to ')
    .trim();
  return { duration: clean, concentration };
}

// Map class names to app IDs
function mapClasses(classesStr) {
  const classes = classesStr
    .split(',')
    .map(c => c.trim().toLowerCase())
    .filter(c => APP_CLASSES.has(c));
  return classes;
}

// Clean casting time (handle ritual notation)
function cleanCastingTime(ct) {
  let ritual = false;
  let cleaned = ct
    .replace(/or\s*<em><sup>R<\/sup><\/em>/i, '')
    .replace(/or\s*R/i, '')
    .replace(/\(R\)/i, '')
    .trim();
  
  if (ct.toLowerCase().includes('<sup>r</sup>') || ct.toLowerCase().includes(' ritual')) {
    ritual = true;
  }
  
  return { castingTime: cleaned, ritual };
}

// Main build function
async function build() {
  console.log('Loading index spells...');
  const indexSpells = loadIndexSpells();
  console.log(`Loaded ${indexSpells.length} spells from index`);
  
  // Group by level
  const byLevel = {};
  for (const s of indexSpells) {
    if (!byLevel[s.level]) byLevel[s.level] = [];
    byLevel[s.level].push(s);
  }
  
  // Verify counts
  for (let l = 0; l <= 9; l++) {
    console.log(`  Level ${l}: ${byLevel[l]?.length || 0} spells`);
  }
  
  // Process each spell
  const processedSpells = [];
  const excludedSpells = [];
  
  for (const s of indexSpells) {
    process.stdout.write(`Fetching ${s.slug}... `);
    
    try {
      const pageHtml = await fetchSpellPage(s.slug);
      const { description, materialText } = parseSpellPage(pageHtml, s.slug);
      
      const { castingTime, ritual: ritualFromTime } = cleanCastingTime(s.castingTime);
      const comp = parseComponents(s.components, materialText);
      comp.ritual = comp.ritual || ritualFromTime;
      
      const { duration, concentration } = parseDuration(s.duration);
      
      const classes = mapClasses(s.classes);
      
      if (classes.length === 0) {
        console.log(`EXCLUDED (no valid classes: ${s.classes})`);
        excludedSpells.push({ slug: s.slug, name: s.name, reason: 'no valid classes after filtering Artificer' });
        continue;
      }
      
      const spellDef = {
        id: s.slug,
        name: s.name,
        level: s.level,
        school: s.school,
        castingTime,
        range: s.range,
        components: comp,
        duration,
        concentration,
        classes,
        description: description || 'No description available.'
      };
      
      // Apply species/lineage tags
      if (SPECIES_TAGS[s.slug]) {
        Object.assign(spellDef, SPECIES_TAGS[s.slug]);
      }
      
      processedSpells.push(spellDef);
      console.log(`OK`);
      
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
      excludedSpells.push({ slug: s.slug, name: s.name, reason: err.message });
    }
  }
  
  // Sort by name within each level
  for (let l = 0; l <= 9; l++) {
    const levelSpells = processedSpells.filter(s => s.level === l);
    levelSpells.sort((a, b) => a.name.localeCompare(b.name));
    
    // Write level file
    const levelName = l === 0 ? 'cantrips' : `l${l}`;
    const outputFile = path.join(OUTPUT_DIR, `spells-${levelName}.ts`);
    const exportName = l === 0 ? 'SPELL_CANTRIPS' : `SPELLS_L${l}`;
    
    let fileContent = `import type { SpellDef } from '../types/character';\n\n`;
    fileContent += `/** SRD 5.2 ${l === 0 ? 'cantrips (level 0)' : `level ${l} spells`}. */\n`;
    fileContent += `export const ${exportName}: SpellDef[] = [\n`;
    
    for (const spell of levelSpells) {
      fileContent += spellToTs(spell);
    }
    
    fileContent += '];\n';
    
    fs.writeFileSync(outputFile, fileContent, 'utf8');
    console.log(`Wrote ${outputFile} (${levelSpells.length} spells)`);
  }
  
  // Update spells.ts comment
  updateSpellsTs();
  
  // Report
  console.log('\n=== BUILD SUMMARY ===');
  console.log(`Total spells processed: ${processedSpells.length}`);
  console.log(`Excluded spells: ${excludedSpells.length}`);
  for (const ex of excludedSpells) {
    console.log(`  - ${ex.slug} (${ex.name}): ${ex.reason}`);
  }
  
  // Verify all SPECIES_TAGS were applied
  console.log('\n=== SPECIES/LINEAGE TAG VERIFICATION ===');
  for (const [spellId, tags] of Object.entries(SPECIES_TAGS)) {
    const found = processedSpells.find(s => s.id === spellId);
    if (found) {
      console.log(`  ✓ ${spellId}: ${JSON.stringify(tags)}`);
    } else {
      console.log(`  ✗ ${spellId}: NOT FOUND IN NEW CATALOG!`);
    }
  }
}

function spellToTs(spell) {
  let s = '  {\n';
  s += `    id: '${escapeStr(spell.id)}',\n`;
  s += `    name: '${escapeStr(spell.name)}',\n`;
  s += `    level: ${spell.level},\n`;
  s += `    school: '${escapeStr(spell.school)}',\n`;
  s += `    castingTime: '${escapeStr(spell.castingTime)}',\n`;
  s += `    range: '${escapeStr(spell.range)}',\n`;
  s += `    components: { verbal: ${spell.components.verbal}, somatic: ${spell.components.somatic}, material: ${spell.components.material}`;
  if (spell.components.materialText) {
    s += `, materialText: '${escapeStr(spell.components.materialText)}'`;
  }
  s += `, ritual: ${spell.components.ritual} },\n`;
  s += `    duration: '${escapeStr(spell.duration)}',\n`;
  s += `    concentration: ${spell.concentration},\n`;
  s += `    classes: [${spell.classes.map(c => `'${c}'`).join(', ')}]`;
  
  if (spell.speciesLineages) {
    s += `,\n    speciesLineages: [${spell.speciesLineages.map(c => `'${c}'`).join(', ')}]`;
  }
  if (spell.speciesGrants) {
    s += `,\n    speciesGrants: [${spell.speciesGrants.map(c => `'${c}'`).join(', ')}]`;
  }
  
  s += `,\n    description: '${escapeStr(spell.description)}'\n`;
  s += '  },\n';
  return s;
}

function escapeStr(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
}

function updateSpellsTs() {
  const spellsTsPath = path.join(OUTPUT_DIR, 'spells.ts');
  let content = fs.readFileSync(spellsTsPath, 'utf8');
  
  // Update the doc comment
  content = content.replace(
    /\/\*\*[\s\S]*?\*\//,
    `/**
 * Complete SRD 5.2 spell catalog (all levels 0-9).
 * Aggregated from per-level modules.
 */`
  );
  
  fs.writeFileSync(spellsTsPath, content, 'utf8');
  console.log('Updated spells.ts comment');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});