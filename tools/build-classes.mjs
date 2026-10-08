/**
 * Rebuild src/data/classes/*.ts (13 classes) + src/data/classes/index.ts
 * + the CLASSES section of src/data/startingEquipment.ts
 * strictly from cached dnd2024.wikidot.com class pages.
 *
 * Usage: node tools/build-classes.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CLASS_DIR = join(ROOT, 'reference', 'DND website');
const SUBCLASS_CACHE = join(ROOT, '.subclass-cache');
const CLASS_CACHE = join(ROOT, '.class-cache');
const OUT_DIR = join(ROOT, 'src', 'data', 'classes');
const OUT_INDEX = join(OUT_DIR, 'index.ts');
const OUT_SE = join(ROOT, 'src', 'data', 'startingEquipment.ts');
const DRY = process.argv.includes('--dry');

// ---------------- helpers ----------------
const clean = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
    .replace(/"/g, '"').replace(/'/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;|&lsquo;/g, "'").replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&mdash;|&ndash;/g, '-').replace(/&hellip;/g, '...')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\u2019|\u2018/g, "'").replace(/\u201C|\u201D/g, '"')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

const pageBody = (html) => {
  const a = html.indexOf('id="page-content"');
  if (a === -1) return '';
  // Find the end of main content: look for page-tags div
  let b = html.indexOf('<div class="page-tags">', a);
  if (b === -1) {
    // Fallback: find the closing of the main content area
    // Look for the footer or the last </div> before ads
    b = html.indexOf('<div class="page-info-break">', a);
  }
  if (b === -1) {
    // Last resort: find the script that contains "nitroAds" or "wad-tier" which marks ads
    b = html.indexOf('nitroAds', a);
  }
  if (b === -1) b = html.length;
  return html.slice(a, b);
};

const paragraphs = (body) => [...body.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);

const q = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const ABILITY = { Strength: 'str', Dexterity: 'dex', Constitution: 'con', Intelligence: 'int', Wisdom: 'wis', Charisma: 'cha' };
const SKILL = {
  Acrobatics: 'acrobatics', 'Animal Handling': 'animalHandling', Arcana: 'arcana', Athletics: 'athletics',
  Deception: 'deception', History: 'history', Insight: 'insight', Intimidation: 'intimidation',
  Investigation: 'investigation', Medicine: 'medicine', Nature: 'nature', Perception: 'perception',
  Performance: 'performance', Persuasion: 'persuasion', Religion: 'religion', 'Sleight of Hand': 'sleightOfHand',
  Stealth: 'stealth', Survival: 'survival',
};

// ---------------- 1. Load subclass index ----------------
const subclassIndex = JSON.parse(readFileSync(join(SUBCLASS_CACHE, '_index.json'), 'utf8'));
const EXCLUDED_SUBCLASS_SLUGS = new Set(['main', 'spell-list', 'all', 'multiclassing', 'spellcasting', 'metamagic']);

// ---------------- 2. Class page list ----------------
const classFiles = [
  { id: 'barbarian', file: 'Barbarian - D&D 5e (2024).html' },
  { id: 'bard', file: 'Bard - D&D 5e (2024).html' },
  { id: 'cleric', file: 'Cleric - D&D 5e (2024).html' },
  { id: 'druid', file: 'Druid - D&D 5e (2024).html' },
  { id: 'fighter', file: 'Fighter - D&D 5e (2024).html' },
  { id: 'monk', file: 'Monk - D&D 5e (2024).html' },
  { id: 'paladin', file: 'Paladin - D&D 5e (2024).html' },
  { id: 'ranger', file: 'Ranger - D&D 5e (2024).html' },
  { id: 'rogue', file: 'Rogue - D&D 5e (2024).html' },
  { id: 'sorcerer', file: 'Sorcerer - D&D 5e (2024).html' },
  { id: 'warlock', file: 'Warlock - D&D 5e (2024).html' },
  { id: 'wizard', file: 'Wizard - D&D 5e (2024).html' },
  { id: 'artificer', file: null, cacheFile: 'artificer.html' }, // from .class-cache
];

const problems = [];
const allResults = [];

// ---------------- Parsing functions (stubs for now) ----------------
function parseCoreTraits(body, classId) {
  // Find the Core Traits table (first wiki-content-table after Source)
  const tableMatch = body.match(/<table class="wiki-content-table">[\s\S]*?<th[^>]*>Core [^<]+ Traits<\/th>[\s\S]*?<\/table>/);
  if (!tableMatch) {
    problems.push(`${classId}: Could not find Core Traits table`);
    return {};
  }
  const table = tableMatch[0];

  // Extract rows
  const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => m[1]);
  const traits = {};

  for (const row of rows) {
    const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => clean(m[1]));
    if (cells.length < 2) continue;
    const label = cells[0].replace(/^\*\s*/, '').trim();
    const value = cells[1].trim();

    switch (label) {
      case 'Primary Ability':
        traits.primaryAbility = parsePrimaryAbility(value);
        break;
      case 'Hit Point Die':
        const dieMatch = value.match(/D(\d+)/i);
        traits.hitDie = dieMatch ? parseInt(dieMatch[1], 10) : 8;
        break;
      case 'Saving Throw Proficiencies':
        traits.savingThrows = value.split(/\s+and\s+/).map(s => ABILITY[s.trim()] ?? s.trim().toLowerCase());
        break;
      case 'Skill Proficiencies':
        traits.skills = parseSkillProficiencies(value);
        break;
      case 'Weapon Proficiencies':
        traits.weaponProficiencies = [value]; // keep as display string
        break;
      case 'Tool Proficiencies':
        traits.toolProficiencies = [value]; // keep as display string
        break;
      case 'Armor Training':
        traits.armorProficiencies = parseArmorProficiencies(value);
        // Fix "None" -> empty array
        if (traits.armorProficiencies.length === 1 && traits.armorProficiencies[0].toLowerCase() === 'none') {
          traits.armorProficiencies = [];
        }
        break;
      case 'Starting Equipment':
        traits.startingEquipment = value;
        break;
    }
  }

  // Determine subclass level from Part A (will be set later, default 3)
  traits.subclassLevel = 3;

  // asiLevels default
  traits.asiLevels = [4, 8, 12, 16];

  return traits;
}

function parseSkillProficiencies(text) {
  // e.g. "Choose 2: Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, or Survival"
  // or "Choose any 3 skills"
  const chooseAnyMatch = text.match(/Choose\s+any\s+(\d+)\s+skills?/i);
  if (chooseAnyMatch) {
    const choiceCount = parseInt(chooseAnyMatch[1], 10);
    const allSkills = Object.values(SKILL);
    return { granted: [], choices: allSkills, choiceCount };
  }

  const chooseMatch = text.match(/Choose\s+(\d+)\s*:\s*(.+)/i);
  if (chooseMatch) {
    const choiceCount = parseInt(chooseMatch[1], 10);
    const skillList = chooseMatch[2].split(/,|\sor\s/).map(s => s.trim().replace(/\.$/, ''));
    const choices = skillList.map(s => SKILL[s] ?? s).filter(Boolean);
    const misses = skillList.filter(s => !SKILL[s] && s);
    if (misses.length) misses.forEach(m => problems.push(`  Unknown skill: "${m}"`));
    return { granted: [], choices, choiceCount };
  }
  // Fixed skills (no "Choose")
  const skillList = text.split(/,|\sor\s/).map(s => s.trim().replace(/\.$/, ''));
  const granted = skillList.map(s => SKILL[s] ?? s).filter(Boolean);
  const misses = skillList.filter(s => !SKILL[s] && s);
  if (misses.length) misses.forEach(m => problems.push(`  Unknown skill: "${m}"`));
  return { granted, choices: [], choiceCount: 0 };
}

function parseArmorProficiencies(text) {
  // e.g. "Light armor and Shields" or "Light and Medium armor and Shields" or "Light, Medium, Heavy armor and Shields"
  // Normalize "Light and Medium armor" -> "Light armor, Medium armor"
  let normalized = text
    .replace(/\bLight and Medium armor\b/g, 'Light armor, Medium armor')
    .replace(/\bLight, Medium, Heavy armor\b/g, 'Light armor, Medium armor, Heavy armor')
    .replace(/\bMedium and Heavy armor\b/g, 'Medium armor, Heavy armor')
    .replace(/\bLight and Medium and Heavy armor\b/g, 'Light armor, Medium armor, Heavy armor')
    .replace(/\bLight and Medium\b/g, 'Light, Medium')
    .replace(/\bLight or Medium\b/g, 'Light, Medium')
    // Fix standalone Light/Medium/Heavy
    .replace(/\bLight\b(?!\s+armor)/g, 'Light armor')
    .replace(/\bMedium\b(?!\s+armor)/g, 'Medium armor')
    .replace(/\bHeavy\b(?!\s+armor)/g, 'Heavy armor');
  
  // Split on " and " or commas
  const parts = normalized.split(/\s+and\s+|,\s*/);
  return parts.map(p => p.trim()).filter(Boolean);
}

function parsePrimaryAbility(text) {
  // e.g. "Strength and Charisma" or "Strength or Dexterity" -> use first for spellcasting
  const first = text.split(/\s+(?:and|or)\s+/)[0].trim();
  return ABILITY[first] ?? first.toLowerCase();
}

function determineSubclassAndASI(partARows) {
  let subclassLevel = 3;
  const asiLevels = [];
  
  for (const row of partARows) {
    for (const feat of row.features) {
      const name = feat.name.toLowerCase();
      // Detect subclass CHOICE level (where you pick your subclass)
      // Look for specific subclass choice feature names
      if (name === 'druid subclass' || 
          name === 'barbarian subclass' || 
          name === 'bard college' || 
          name === 'divine domain' || 
          name === 'martial archetype' || 
          name === 'primal path' || 
          name === 'sacred oath' || 
          name === 'sorcerous origin' || 
          name === 'otherworldly patron' || 
          name === 'arcane tradition' ||
          name === 'artificer subclass' ||
          name === 'ranger archetype' ||
          name === 'roguish archetype') {
        subclassLevel = row.level;
      }
      // Detect ASI levels
      if (name === 'ability score improvement') {
        asiLevels.push(row.level);
      }
    }
    // Also check plain text for ghost rows
    if (row.plainText.toLowerCase().includes('ability score improvement')) {
      if (!asiLevels.includes(row.level)) asiLevels.push(row.level);
    }
  }
  
  return { subclassLevel, asiLevels: asiLevels.sort((a,b) => a-b) };
}

function parsePartA(body) {
  // Find "Part A" table - the first wiki-content-table after "Class Features" h1
  // that has headers: Level | Proficiency Bonus | Features (+ optional extra cols)
  const tables = [...body.matchAll(/<table class="wiki-content-table">[\s\S]*?<\/table>/g)].map(m => m[0]);
  
  for (const table of tables) {
    // Check if this is the Part A table by looking for "Level" and "Features" or "Class Features" in header
    const headerMatch = table.match(/<th[^>]*>Level<\/th>[\s\S]*?<th[^>]*>(?:Features|Class Features)<\/th>/i);
    if (headerMatch) {
      // This is Part A table
      const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => m[1]);
      const result = [];
      
      for (const row of rows) {
        const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => m[1]);
        if (cells.length < 3) continue; // skip header row
        
        const level = parseInt(clean(cells[0]), 10);
        if (isNaN(level)) continue;
        
        const proficiency = clean(cells[1]);
        const featuresHtml = cells[2];
        
        // Extract feature names and anchor links
        const features = [];
        const links = [...featuresHtml.matchAll(/<a href="#([^"]+)">([^<]+)<\/a>/g)];
        for (const link of links) {
          features.push({ anchor: link[1], name: clean(link[2]) });
        }
        
        // Also capture any text not in links (like "-" or extra text)
        const plainText = clean(featuresHtml.replace(/<a[^>]*>[^<]*<\/a>/g, '').replace(/,/g, ''));
        
        result.push({ level, proficiency, features, plainText });
      }
      return result;
    }
  }
  
  problems.push(`Could not find Part A table`);
  return [];
}

function parsePartB(body) {
  // Find "Part B" table - has headers like Cantrips, Prepared Spells, Known Spells, 1st, 2nd, etc.
  const tables = [...body.matchAll(/<table class="wiki-content-table">[\s\S]*?<\/table>/g)].map(m => m[0]);
  
  for (const table of tables) {
    // Check for Part B headers - must have Level and at least one spell column
    if (!table.includes('<th>Level</th>')) continue;
    if (!/(Cantrips|Prepared Spells|Known Spells|Pact Magic|Mystic Arcanum|Wild Shape|1st|2nd|3rd|4th|5th|6th|7th|8th|9th)/i.test(table)) continue;
    
    // Skip Part A table (which also has Level but no spell columns beyond Features)
    if (table.includes('<th[^>]*>Features<\/th>') || table.includes('<th[^>]*>Class Features<\/th>')) continue;
    
    // This is Part B table
    const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => m[1]);
    const headers = [...rows[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => clean(m[1]));
    
    // Map header names to our semantics
    const headerMap = {};
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i].toLowerCase();
      if (h === 'level') headerMap[i] = 'level';
      else if (h === 'cantrips') headerMap[i] = 'cantrips';
      else if (h === 'prepared spells') headerMap[i] = 'preparedSpells';
      else if (h === 'known spells') headerMap[i] = 'knownSpells';
      else if (h === 'pact magic') headerMap[i] = 'pactMagic';
      else if (h === 'mystic arcanum') headerMap[i] = 'mysticArcanum';
      else if (h === 'wild shape') headerMap[i] = 'wildShape';
      else if (/^\d+(?:st|nd|rd|th)$/.test(h)) headerMap[i] = `slot${h}`;
      else headerMap[i] = h;
    }
    
    const cantripCountByLevel = {};
    const spellCountByLevel = {};
    const slotTable = {};
    let hasPactMagic = false;
    let hasPreparedSpells = false;
    let hasKnownSpells = false;
    
    for (let r = 1; r < rows.length; r++) {
      const cells = [...rows[r].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => clean(m[1]));
      if (cells.length < headers.length) continue;
      
      const level = parseInt(cells[0], 10);
      if (isNaN(level)) continue;
      
      for (let c = 1; c < cells.length; c++) {
        const val = cells[c];
        if (!val || val === '-') continue;
        const num = parseInt(val, 10);
        if (isNaN(num)) continue;
        
        const key = headerMap[c];
        if (key === 'cantrips') {
          cantripCountByLevel[level] = num;
        } else if (key === 'preparedSpells') {
          spellCountByLevel[level] = num;
          hasPreparedSpells = true;
        } else if (key === 'knownSpells') {
          spellCountByLevel[level] = num;
          hasKnownSpells = true;
        } else if (key === 'pactMagic') {
          hasPactMagic = true;
        } else if (key?.startsWith('slot')) {
          const slotLevel = parseInt(key.replace('slot', ''), 10);
          if (!slotTable[level]) slotTable[level] = [];
          // Ensure array is long enough
          while (slotTable[level].length < slotLevel) slotTable[level].push(0);
          slotTable[level][slotLevel - 1] = num;
        }
      }
    }
    
    // Determine spellsMode
    let spellsMode = 'prepared';
    if (hasKnownSpells && !hasPreparedSpells) spellsMode = 'known';
    
    return {
      cantripCountByLevel,
      spellCountByLevel,
      slotTable,
      pactMagic: hasPactMagic,
      spellsMode,
    };
  }
  
  return null; // No Part B table (non-casters)
}

function parseFeatures(body, partARows, classId) {
  // Build a map of anchor -> feature info from Part A
  const anchorMap = {};
  for (const row of partARows) {
    for (const feat of row.features) {
      anchorMap[feat.anchor] = { level: row.level, name: feat.name };
    }
  }
  
  // Find all h3 feature sections
  // Pattern: <h3 ...><span>Level N: Feature Name <a name="anchor"></a></span></h3>
  const h3Matches = [...body.matchAll(/<h3[^>]*>\s*<span[^>]*>\s*Level\s+(\d+):\s*([^<]+)(?:\s*<a\s+name="([^"]+)"><\/a>)?\s*<\/span>\s*<\/h3>/g)];
  
  const featuresByLevel = {};
  let currentFeature = null;
  let currentLevel = null;
  let currentAnchor = null;
  
  // Process the body content after the Part A table
  // Find the Part A table end position
  const partATableMatch = body.match(/<h6[^>]*>\s*<span[^>]*>[^<]*Part A[^<]*<\/span>\s*<\/h6>/);
  const searchStart = partATableMatch ? partATableMatch.index + partATableMatch[0].length : 0;
  const searchBody = body.slice(searchStart);
  
  // Find all h3 and their following content until next h3/h2/h1
  const sections = [...searchBody.matchAll(/<h3[^>]*>\s*<span[^>]*>\s*Level\s+(\d+):\s*([^<]+)(?:\s*<a\s+name="([^"]+)"><\/a>)?\s*<\/span>\s*<\/h3>([\s\S]*?)(?=<h[1-3][^>]*>|$)/g)];
  
  for (const match of sections) {
    const level = parseInt(match[1], 10);
    const name = clean(match[2]);
    const anchor = match[3] || '';
    const content = match[4];
    
    // Skip the "Subclasses" h5 section that appears between features
    if (name.toLowerCase().includes('subclass') && !anchor) continue;
    
    // Extract paragraphs from content
    const ps = paragraphs(content);
    const description = ps.map(p => clean(p)).join(' ').trim();
    
    if (!description) {
      problems.push(`${classId}: Level ${level} feature "${name}" has no description`);
      continue;
    }
    
    // Generate feature id
    let featId = kebab(name);
    // Check for duplicates at higher levels (e.g., Ability Score Improvement)
    const existingLevels = Object.keys(featuresByLevel).map(Number).filter(l => 
      featuresByLevel[l].some(f => f.id === featId || f.id.startsWith(featId + '-'))
    );
    if (existingLevels.length > 0) {
      featId = `${featId}-${level}`;
    }
    
    // Determine subclass level from first feature that mentions subclass
    const subclassLevelMatch = name.match(/^(?:Druid|Barbarian|Bard|Cleric|Fighter|Monk|Paladin|Ranger|Rogue|Sorcerer|Warlock|Wizard|Artificer)\s+(?:Subclass|Circle|College|Domain|Archetype|Path|Oath|Origin|Patron|Tradition|Specialty)/i);
    // We'll handle subclassLevel separately
    
    const feature = {
      id: featId,
      name,
      description,
    };
    
    if (!featuresByLevel[level]) featuresByLevel[level] = [];
    featuresByLevel[level].push(feature);
  }
  
  // Handle "ghost" subclass feature rows (Subclass Feature with no h3)
  for (const row of partARows) {
    if (row.plainText.includes('Subclass Feature') && row.features.length === 0) {
      // This is a ghost row - add placeholder
      if (!featuresByLevel[row.level]) featuresByLevel[row.level] = [];
      featuresByLevel[row.level].push({
        id: `subclass-feature-${row.level}`,
        name: 'Subclass Feature',
        description: `See the ${classId.charAt(0).toUpperCase() + classId.slice(1)} subclass you chose at level ${getSubclassLevel(classId, partARows)}.`,
      });
    }
  }
  
  return featuresByLevel;
}

function getSubclassLevel(classId, partARows) {
  // Find the first Part A row that mentions subclass
  for (const row of partARows) {
    for (const feat of row.features) {
      const name = feat.name.toLowerCase();
      if (name.includes('subclass') || 
          name.includes('circle') || 
          name.includes('college') || 
          name.includes('domain') || 
          name.includes('archetype') || 
          name.includes('path') || 
          name.includes('oath') || 
          name.includes('origin') || 
          name.includes('patron') || 
          name.includes('tradition') ||
          name.includes('specialty')) {
        return row.level;
      }
    }
  }
  return 3; // default
}

function parseSubclasses(classId, body) {
  // Get subclass slugs from index
  const slugs = subclassIndex[classId] || [];
  if (!slugs.length) {
    problems.push(`${classId}: No subclasses in index`);
    return [];
  }
  
  // Also extract from class page's subclass list (for display names and validation)
  const pageSubclasses = [];
  const subclassTableMatch = body.match(/<h5[^>]*>\s*<span[^>]*>[^<]*Subclass[^<]*<\/span>\s*<\/h5>[\s\S]*?<table class="wiki-content-table">[\s\S]*?<\/table>/);
  if (subclassTableMatch) {
    const table = subclassTableMatch[0];
    const links = [...table.matchAll(/<a href="\/[^:]+:([^"]+)">([^<]+)<\/a>/g)];
    for (const link of links) {
      const slug = link[1];
      const name = clean(link[2]);
      if (!EXCLUDED_SUBCLASS_SLUGS.has(slug) && !slug.includes('/spell:')) {
        pageSubclasses.push({ slug, name });
      }
    }
  }
  
  // For artificer, the subclass list is in its own page
  if (classId === 'artificer' && pageSubclasses.length === 0) {
    const artTableMatch = body.match(/<h[56][^>]*>\s*<span[^>]*>Artificer Subclasses<\/span>\s*<\/h[56]>[\s\S]*?<table class="wiki-content-table">[\s\S]*?<\/table>/);
    if (artTableMatch) {
      const table = artTableMatch[0];
      const links = [...table.matchAll(/<a href="\/[^:]+:([^"]+)">([^<]+)<\/a>/g)];
      for (const link of links) {
        const slug = link[1];
        const name = clean(link[2]);
        if (!EXCLUDED_SUBCLASS_SLUGS.has(slug) && !slug.includes('/spell:')) {
          pageSubclasses.push({ slug, name });
        }
      }
    }
  }
  
  // Filter index slugs: exclude non-subclass pages
  const validSlugs = slugs.filter(s => !EXCLUDED_SUBCLASS_SLUGS.has(s) && !s.includes('/spell:'));
  
  // Cross-reference: use index slugs but get display names from page
  const results = [];
  for (const slug of validSlugs) {
    const pageInfo = pageSubclasses.find(p => p.slug === slug);
    const name = pageInfo?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Load subclass page
    const subFile = join(SUBCLASS_CACHE, `${classId}-${slug}.html`);
    if (!existsSync(subFile)) {
      problems.push(`${classId}: Missing subclass page for ${slug}`);
      continue;
    }
    const subHtml = readFileSync(subFile, 'utf8');
    const subBody = pageBody(subHtml);
    
    // Parse subclass page
    const subclass = parseSubclassPage(classId, slug, name, subBody);
    if (subclass) results.push(subclass);
  }
  
  // Warn about page subclasses not in index
  for (const p of pageSubclasses) {
    if (!validSlugs.includes(p.slug)) {
      problems.push(`${classId}: Subclass "${p.name}" (${p.slug}) on class page but not in index`);
    }
  }
  
  return results;
}

function parseSubclassPage(classId, slug, name, body) {
  // Extract Source
  const sourceMatch = body.match(/<p>Source:\s*([^<]+)<\/p>/i);
  const source = sourceMatch ? clean(sourceMatch[1]) : 'Unknown';
  
  // Flavour paragraphs (before first h3)
  const firstH3 = body.search(/<h3[^>]*>/);
  const flavourRegion = firstH3 === -1 ? body : body.slice(0, firstH3);
  const flavourPs = paragraphs(flavourRegion).filter(p => !/^Source\s*:/.test(clean(p)));
  const description = clean(flavourPs.join(' ')) || `Subclass: ${name}`;
  
  // Find all h3 feature sections: ### Level N: Feature Name
  const featureMatches = [...body.matchAll(/<h3[^>]*>\s*<span[^>]*>\s*Level\s+(\d+):\s*([^<]+)(?:\s*<a\s+name="[^"]*"><\/a>)?\s*<\/span>\s*<\/h3>([\s\S]*?)(?=<h[1-3][^>]*>|$)/g)];
  
  const features = [];
  for (const match of featureMatches) {
    const level = parseInt(match[1], 10);
    const featName = clean(match[2]);
    const content = match[3];
    
    // Skip if this is a "Subclasses" list or similar
    if (featName.toLowerCase().includes('subclass') && !level) continue;
    
    const ps = paragraphs(content);
    const desc = ps.map(p => clean(p)).join(' ').trim();
    
    if (!desc) {
      problems.push(`${classId}/${slug}: Level ${level} feature "${featName}" has no description`);
      continue;
    }
    
    // Replace /spell:SLUG links with display name only
    let processedDesc = desc.replace(/<a href="\/spell:([^"]+)">([^<]+)<\/a>/g, '$2');
    processedDesc = clean(processedDesc);
    
    features.push({ level, name: featName, description: processedDesc });
  }
  
  console.log(`    Subclass ${slug}: ${features.length} features, desc length: ${description.length}`);
  
  return {
    id: slug,
    classId,
    name,
    description,
    features,
  };
}

function parseStartingEquipment(text) {
  // Input: "Choose A or B: (A) ...; or (B) 50 GP"
  // or "Choose A, B, or C: (A) ...; (B) ...; or (C) 155 GP"
  const chooseMatch = text.match(/^Choose\s+([A-C](?:\s*,?\s*(?:or\s+)?[A-C])*)\s*:\s*(.+)/i);
  if (!chooseMatch) {
    problems.push(`  Could not parse starting equipment: "${text}"`);
    return [];
  }
  
  const rest = chooseMatch[2];
  // Split by \(([ABC])\) to get options
  const parts = rest.split(/\(([ABC])\)\s*/); // ['', letter, text, letter, text...]
  const options = [];
  
  for (let i = 1; i < parts.length; i += 2) {
    const letter = parts[i].toLowerCase();
    let optionText = parts[i + 1]?.replace(/;?\s*or\s*$/, '').replace(/;?\s*$/, '').trim() || '';
    
    const isCoins = /^\d+\s*(?:GP|SP|CP)$/i.test(optionText);
    if (isCoins) {
      const gpMatch = optionText.match(/^(\d+)\s*(GP|SP|CP)$/i);
      let coinsGp = parseInt(gpMatch[1], 10);
      if (gpMatch[2].toUpperCase() === 'SP') coinsGp = coinsGp / 10;
      else if (gpMatch[2].toUpperCase() === 'CP') coinsGp = coinsGp / 100;
      options.push({ id: letter, label: 'Option ' + letter.toUpperCase(), kind: 'coins', items: '', coinsGp });
    } else {
      options.push({ id: letter, label: 'Option ' + letter.toUpperCase(), kind: 'package', items: optionText, coinsGp: 0 });
    }
  }
  
  return options;
}

// ---------------- Main loop ----------------
for (const { id, file, cacheFile } of classFiles) {
  console.log(`\n=== Parsing ${id} ===`);
  let pageHtml;
  if (cacheFile) {
    pageHtml = readFileSync(join(CLASS_CACHE, cacheFile), 'utf8');
  } else {
    pageHtml = readFileSync(join(CLASS_DIR, file), 'utf8');
  }
  const body = pageBody(pageHtml);
  if (!body) {
    problems.push(`${id}: Could not extract page body`);
    continue;
  }

  // Extract Source
  const sourceMatch = body.match(/<p>Source:\s*([^<]+)<\/p>/i);
  const source = sourceMatch ? clean(sourceMatch[1]) : 'Unknown';
  console.log(`  Source: ${source}`);

  // Parse core traits
  const coreTraits = parseCoreTraits(body, id);
  console.log(`  Core traits:`, coreTraits);

  // Parse Part A
  const partARows = parsePartA(body);
  console.log(`  Part A rows: ${partARows.length}`);

  // Determine subclassLevel and asiLevels from Part A
  const { subclassLevel, asiLevels } = determineSubclassAndASI(partARows);
  coreTraits.subclassLevel = subclassLevel;
  coreTraits.asiLevels = asiLevels;
  console.log(`  subclassLevel: ${subclassLevel}, asiLevels: [${asiLevels.join(', ')}]`);

  // Parse Part B
  const partB = parsePartB(body);
  console.log(`  Part B:`, partB ? 'present' : 'absent');

  // Parse features
  const featuresByLevel = parseFeatures(body, partARows, id);
  console.log(`  Features by level: ${Object.keys(featuresByLevel).length} levels`);

  // Parse subclasses
  const subclasses = parseSubclasses(id, body);
  console.log(`  Subclasses: ${subclasses.length}`);

  // Parse starting equipment
  const startingEquipment = parseStartingEquipment(coreTraits.startingEquipment || '');
  console.log(`  Starting equipment options: ${startingEquipment.length}`);

  allResults.push({
    id,
    source,
    coreTraits,
    partARows,
    partB,
    featuresByLevel,
    subclasses,
    startingEquipment,
  });
}

// ---------------- 3. Report ----------------
console.log('\n=== PROBLEMS ===');
if (problems.length) {
  problems.forEach((p, i) => console.log(`  ${i+1}. ${p}`));
} else {
  console.log('(none)');
}

console.log('\n=== SUMMARY ===');
for (const r of allResults) {
  console.log(`${r.id}: hitDie=${r.coreTraits.hitDie ?? '?'}, subclassLevel=${r.coreTraits.subclassLevel ?? '?'}, subclasses=${r.subclasses.length}, asiLevels=${r.coreTraits.asiLevels?.join(',') ?? '?'}, spellcasting=${r.partB ? 'yes' : 'no'}`);
}

if (problems.length) {
  console.error(`\nABORT: ${problems.length} problem(s) found`);
  process.exit(1);
}
if (DRY) {
  console.log('\n--- DRY RUN (not writing) ---');
  process.exit(0);
}

// ---------------- 4. Emit class files ----------------
function emitClassFile(result) {
  const { id, source, coreTraits, partB, featuresByLevel, subclasses, startingEquipment } = result;
  
  // Build ClassDef object
  const classDef = {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    hitDie: coreTraits.hitDie,
    savingThrowProficiencies: coreTraits.savingThrows,
    armorProficiencies: coreTraits.armorProficiencies || [],
    weaponProficiencies: coreTraits.weaponProficiencies || [],
    toolProficiencies: coreTraits.toolProficiencies || [],
    skills: coreTraits.skills || { granted: [], choices: [], choiceCount: 0 },
    subclassLevel: coreTraits.subclassLevel,
    subclasses: subclasses.map(sc => ({
      id: sc.id,
      classId: sc.classId,
      name: sc.name,
      description: sc.description,
      features: sc.features.map(f => ({
        level: f.level,
        name: f.name,
        description: f.description,
      })),
    })),
    featuresByLevel: {},
    asiLevels: coreTraits.asiLevels || [4, 8, 12, 16],
  };

  // Add spellcasting if present
  if (partB) {
    classDef.spellcasting = {
      ability: coreTraits.primaryAbility || 'int',
      cantripsMode: 'known',
      cantripCountByLevel: partB.cantripCountByLevel || {},
      spellsMode: partB.spellsMode || 'prepared',
      spellCountByLevel: partB.spellCountByLevel || {},
      slotTable: partB.slotTable || {},
      pactMagic: partB.pactMagic || false,
    };
  }

  // Add weaponMastery if present (fighter, rogue, etc. have it in features)
  // We'll detect from featuresByLevel
  const weaponMasteryFeature = Object.values(featuresByLevel).flat().find(f => f.id === 'weapon-mastery' || f.id.startsWith('weapon-mastery'));
  if (weaponMasteryFeature) {
    // Try to extract from the feature description or use defaults per class
    const wmDefaults = {
      fighter: { featureLevel: 2, choiceCount: 2, pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'], extraPicksAtLevels: [4, 6, 10, 16] },
      rogue: { featureLevel: 2, choiceCount: 2, pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'], extraPicksAtLevels: [4, 6, 10, 16] },
      ranger: { featureLevel: 2, choiceCount: 2, pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'], extraPicksAtLevels: [4, 6, 10, 16] },
      barbarian: { featureLevel: 2, choiceCount: 2, pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'], extraPicksAtLevels: [4, 6, 10, 16] },
      paladin: { featureLevel: 2, choiceCount: 2, pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'], extraPicksAtLevels: [4, 6, 10, 16] },
      monk: { featureLevel: 5, choiceCount: 1, pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'], extraPicksAtLevels: [10, 16] },
      bard: { featureLevel: 2, choiceCount: 1, pool: ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'], extraPicksAtLevels: [6, 10, 14] },
    };
    if (wmDefaults[id]) {
      classDef.weaponMastery = wmDefaults[id];
    }
  }

  // Preserve multiclassGains from stale files if they exist
  const staleMulticlassGains = {
    barbarian: [
      'Light armor, Medium armor, Shields',
      'Simple weapons, Martial weapons',
      'Two skills from the Barbarian list',
    ],
    bard: [
      'Light armor',
      'Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords',
      'Three musical instruments (e.g., lute, flute, drum)',
      'One skill of your choice',
    ],
    cleric: [
      'Light armor, Medium armor, Shields',
      'Simple weapons',
      'Two skills from the Cleric list',
    ],
    druid: [
      'Light armor, Shields (nonmetal)',
      'Simple weapons, Herbalism Kit',
      'Two skills from the Druid list',
    ],
    fighter: [
      'Light armor, Medium armor, Heavy armor, Shields',
      'Simple weapons, Martial weapons',
      'One skill from the Fighter list',
    ],
    monk: [
      'Simple weapons, Martial weapons that have the Light property',
      'Choose one type of Artisan\'s Tools or Musical Instrument',
      'One skill from the Monk list',
    ],
    paladin: [
      'Light armor, Medium armor, Shields, Simple weapons, Martial weapons',
      'Lay on Hands, Divine Sense',
    ],
    ranger: [
      'Light armor, Medium armor, Shields, Simple weapons, Martial weapons',
      'Favored Enemy, Natural Explorer',
    ],
    rogue: [
      'Light armor, Simple weapons, Hand crossbows, Longswords, Rapiers, Shortswords, Daggers (two)',
      'Thieves\' tools, Expertise (two skills/thieves\' tools), Sneak Attack, Thieves\' Cant',
    ],
    sorcerer: [
      'Two cantrips from the sorcerer spell list',
      'Spellcasting (prepared spells from sorcerer list, Cha-based)',
      'Font of Magic (sorcery points equal to sorcerer level)',
      'Metamagic (2 options)',
    ],
    warlock: [
      'Light armor',
      'Simple weapons',
      'Two cantrips from the warlock spell list',
      'Pact Magic (spell slots)',
    ],
    wizard: [
      'Simple weapons',
      'Spellbook, Arcane Focus',
      'Two skills from the Wizard list',
    ],
    artificer: [
      'Light armor, Medium armor, Shields',
      'Simple weapons',
      'Thieves\' Tools, Tinker\'s Tools, one type of Artisan\'s Tools',
      'Two skills from the Artificer list',
    ],
  };
  if (staleMulticlassGains[id]) {
    classDef.multiclassGains = staleMulticlassGains[id];
  } else {
    classDef.multiclassGains = [];
  }

  // Process featuresByLevel - convert parser output to ClassFeature format
  // The parser gives us: featuresByLevel[level] = [{ id, name, description }, ...]
  // We need to preserve special features: fighting-style, expertise, expertise-2, draconic-sorcery subclass id
  
  const processedFeaturesByLevel = {};
  
  for (const [level, features] of Object.entries(featuresByLevel)) {
    const processedFeatures = features.map(f => {
      const feature = { ...f };
      
      // Special handling for fighting-style - preserve option IDs
      if (f.id === 'fighting-style' && (id === 'fighter' || id === 'paladin' || id === 'ranger')) {
        const fightingStyleOptions = {
          fighter: [
            { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls with ranged weapons.' },
            { id: 'blind-fighting', name: 'Blind Fighting', description: 'You have blindsight with a range of 10 feet.' },
            { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
            { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
            { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for a two-handed or versatile melee weapon attack, reroll the die and use the new roll.' },
            { id: 'interception', name: 'Interception', description: 'When a creature you can see hits a target within 10 ft of you, you can use your reaction to reduce the damage by 1d10 + proficiency (min 0). Must wield shield or simple/martial weapon.' },
            { id: 'protection', name: 'Protection', description: 'When a creature you can see attacks a target within 5 ft of you, you can use your reaction to impose disadvantage on the attack. Must wield a shield.' },
            { id: 'superior-technique', name: 'Superior Technique', description: 'Learn one Battle Master maneuver. You have 1 superiority die (d6) that refreshes on a short/long rest.' },
            { id: 'two-weapon-fighting', name: 'Two Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
            { id: 'unarmed-fighting', name: 'Unarmed Fighting', description: 'Your unarmed strikes deal 1d6 + Str. If you have two hands free, they deal 1d8.' },
          ],
          paladin: [
            { id: 'blessed-warrior', name: 'Blessed Warrior', description: 'Learn two cantrips from the Cleric list. Wisdom is your spellcasting ability for them. Change one when you gain a Paladin level.' },
            { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
            { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
            { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for a two-handed or versatile melee weapon attack, reroll the die and use the new roll.' },
            { id: 'protection', name: 'Protection', description: 'When a creature you can see attacks a target within 5 ft of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.' },
            { id: 'two-weapon-fighting', name: 'Two-Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
          ],
          ranger: [
            { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls with ranged weapons.' },
            { id: 'blind-fighting', name: 'Blind Fighting', description: 'You have blindsight with a range of 10 ft. Within that range, you can see anything that isn\'t behind total cover, even if blinded or in darkness.' },
            { id: 'defense', name: 'Defense', description: 'While wearing armor, you gain a +1 bonus to AC.' },
            { id: 'druidic-warrior', name: 'Druidic Warrior', description: 'Learn two cantrips from the Druid list. Wisdom is your spellcasting ability for them. You can change one when you gain a Ranger level. These are Druid cantrips, not Ranger cantrips.' },
            { id: 'dueling', name: 'Dueling', description: 'When wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' },
            { id: 'thrown-weapon-fighting', name: 'Thrown Weapon Fighting', description: 'You can draw a thrown weapon as part of the attack. When you hit with a ranged attack using a thrown weapon, you gain a +2 bonus to the damage roll.' },
            { id: 'two-weapon-fighting', name: 'Two-Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the off-hand attack.' },
          ],
        };
        if (fightingStyleOptions[id]) {
          feature.options = fightingStyleOptions[id];
          feature.optionCount = 2;
        }
      }
      
      // Special handling for expertise (rogue, bard) - preserve skillChoices structure
      if ((f.id === 'expertise' || f.id === 'expertise-2') && (id === 'rogue' || id === 'bard')) {
        const allSkills = [
          'acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception',
          'history', 'insight', 'intimidation', 'investigation', 'medicine',
          'nature', 'perception', 'performance', 'persuasion', 'religion',
          'sleightOfHand', 'stealth', 'survival',
        ];
        feature.options = allSkills.map(skill => ({
          id: skill,
          name: skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1').replace(/Of/g, 'of'),
          description: `Gain Expertise in ${skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1').replace(/Of/g, 'of')} (double proficiency bonus).`,
        }));
        feature.optionCount = 2;
        feature.skillChoices = allSkills;
        feature.skillChoiceCount = 2;
      }
      
      return feature;
    });
    
    processedFeaturesByLevel[parseInt(level, 10)] = processedFeatures;
  }
  
  classDef.featuresByLevel = processedFeaturesByLevel;

  // Generate the TypeScript file content
  const lines = [];
  lines.push(`import type { ClassDef } from '../../types/character';`);
  lines.push(``);
  lines.push(`export const ${id}: ClassDef = {`);
  lines.push(`  id: '${id}',`);
  lines.push(`  name: '${classDef.name}',`);
  lines.push(`  hitDie: ${classDef.hitDie},`);
  lines.push(`  savingThrowProficiencies: [${classDef.savingThrowProficiencies.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],`);
  lines.push(`  armorProficiencies: [${classDef.armorProficiencies.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],`);
  lines.push(`  weaponProficiencies: [${classDef.weaponProficiencies.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],`);
  lines.push(`  toolProficiencies: [${classDef.toolProficiencies.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],`);
  lines.push(`  skills: {`);
  lines.push(`    granted: [${classDef.skills.granted.map(s => `'${s}'`).join(', ')}],`);
  lines.push(`    choices: [${classDef.skills.choices.map(s => `'${s}'`).join(', ')}],`);
  lines.push(`    choiceCount: ${classDef.skills.choiceCount},`);
  lines.push(`  },`);
  
  if (classDef.spellcasting) {
    const sc = classDef.spellcasting;
    lines.push(`  spellcasting: {`);
    lines.push(`    ability: '${sc.ability}',`);
    lines.push(`    cantripsMode: '${sc.cantripsMode}',`);
    lines.push(`    cantripCountByLevel: {${Object.entries(sc.cantripCountByLevel).map(([k,v]) => `${k}: ${v}`).join(', ')}},`);
    lines.push(`    spellsMode: '${sc.spellsMode}',`);
    lines.push(`    spellCountByLevel: {${Object.entries(sc.spellCountByLevel).map(([k,v]) => `${k}: ${v}`).join(', ')}},`);
    lines.push(`    slotTable: {${Object.entries(sc.slotTable).map(([k,v]) => `${k}: [${v.join(', ')}]`).join(', ')}},`);
    if (sc.pactMagic) lines.push(`    pactMagic: true,`);
    lines.push(`  },`);
  }
  
  lines.push(`  subclassLevel: ${classDef.subclassLevel},`);
  lines.push(`  subclasses: [`);
  for (const sc of classDef.subclasses) {
    lines.push(`    {`);
    lines.push(`      id: '${sc.id}',`);
    lines.push(`      classId: '${sc.classId}',`);
    lines.push(`      name: '${sc.name.replace(/'/g, "\\'")}',`);
    lines.push(`      description: '${sc.description.replace(/'/g, "\\'")}',`);
    lines.push(`      features: [`);
    for (const f of sc.features) {
      lines.push(`        { level: ${f.level}, name: '${f.name.replace(/'/g, "\\'")}', description: '${f.description.replace(/'/g, "\\'")}' },`);
    }
    lines.push(`      ],`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);
  lines.push(`  featuresByLevel: {`);
  for (const [level, features] of Object.entries(classDef.featuresByLevel).sort((a,b) => parseInt(a[0]) - parseInt(b[0]))) {
    lines.push(`    ${level}: [`);
    for (const f of features) {
      lines.push(`      {`);
      lines.push(`        id: '${f.id}',`);
      lines.push(`        name: '${f.name.replace(/'/g, "\\'")}',`);
      lines.push(`        description: '${f.description.replace(/'/g, "\\'")}'`);
      if (f.options) {
        lines.push(`        ,`);
        lines.push(`        options: [`);
        for (const opt of f.options) {
          lines.push(`          { id: '${opt.id}', name: '${opt.name.replace(/'/g, "\\'")}', description: '${opt.description.replace(/'/g, "\\'")}' },`);
        }
        lines.push(`        ],`);
        if (f.optionCount) lines.push(`        optionCount: ${f.optionCount},`);
        if (f.skillChoices) lines.push(`        skillChoices: [${f.skillChoices.map(s => `'${s}'`).join(', ')}],`);
        if (f.skillChoiceCount) lines.push(`        skillChoiceCount: ${f.skillChoiceCount},`);
      }
      lines.push(`      },`);
    }
    lines.push(`    ],`);
  }
  lines.push(`  },`);
  
  if (classDef.weaponMastery) {
    const wm = classDef.weaponMastery;
    lines.push(`  weaponMastery: {`);
    lines.push(`    featureLevel: ${wm.featureLevel},`);
    lines.push(`    choiceCount: ${wm.choiceCount},`);
    lines.push(`    pool: [${wm.pool.map(s => `'${s}'`).join(', ')}],`);
    lines.push(`    extraPicksAtLevels: [${wm.extraPicksAtLevels.join(', ')}],`);
    lines.push(`  },`);
  }
  
  if (classDef.multiclassGains && classDef.multiclassGains.length > 0) {
    lines.push(`  multiclassGains: [${classDef.multiclassGains.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],`);
  }
  
  lines.push(`  asiLevels: [${classDef.asiLevels.join(', ')}],`);
  lines.push(`};`);
  
  const content = lines.join('\n');
  const outPath = join(OUT_DIR, `${id}.ts`);
  writeFileSync(outPath, content, 'utf8');
  console.log(`  Wrote ${outPath}`);
}

// Emit all class files
for (const result of allResults) {
  emitClassFile(result);
}

// ---------------- 5. Emit index.ts ----------------
const classIds = allResults.map(r => r.id).sort((a, b) => {
  const order = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard', 'artificer'];
  return order.indexOf(a) - order.indexOf(b);
});

const indexLines = [];
indexLines.push(`import type { ClassDef } from '../../types/character';`);
indexLines.push(``);
for (const id of classIds) {
  indexLines.push(`import { ${id} } from './${id}';`);
}
indexLines.push(``);
indexLines.push(`export { ${classIds.join(', ')} };`);
indexLines.push(``);
indexLines.push(`/** All ${classIds.length} classes, ordered for display. */`);
indexLines.push(`export const CLASSES: ClassDef[] = [`);
for (const id of classIds) {
  indexLines.push(`  ${id},`);
}
indexLines.push(`];`);
indexLines.push(``);
indexLines.push(`const BY_ID: Record<string, ClassDef> = Object.fromEntries(CLASSES.map((c) => [c.id, c]));`);
indexLines.push(``);
indexLines.push(`export function getClass(id: string): ClassDef | null {`);
indexLines.push(`  return BY_ID[id] ?? null;`);
indexLines.push(`}`);

writeFileSync(OUT_INDEX, indexLines.join('\n'), 'utf8');
console.log(`  Wrote ${OUT_INDEX}`);

// ---------------- 6. Emit startingEquipment.ts CLASSES section ----------------
const seContent = readFileSync(OUT_SE, 'utf8');
const markerRe = /\/\/ ={5,} CLASSES \(\d+\) ={5,}/;
const markerMatch = seContent.match(markerRe);
const newMarker = '// ==================== CLASSES (13) ====================';

if (!markerMatch) {
  problems.push('Could not find CLASSES marker in startingEquipment.ts');
} else {
  // Find the marker position and the end of the CLASSES section (before the closing ];)
  const markerIndex = markerMatch.index;
  // Find the closing ]; after the marker
  const afterMarker = seContent.slice(markerIndex);
  const closingIndex = afterMarker.search(/^\];/m);
  if (closingIndex === -1) {
    problems.push('Could not find closing ]; for CLASSES section');
  } else {
    const absoluteClosingIndex = markerIndex + closingIndex;
    // Build new CLASSES section
    const classEntries = [];
    for (const result of allResults) {
      const { id, coreTraits, startingEquipment } = result;
      const source = (id === 'artificer') ? 'eberron' : 'phb';
      
      let optionsStr = '';
      for (const opt of startingEquipment) {
        const itemsEscaped = opt.items.replace(/'/g, "\\'");
        optionsStr += `      {\n`;
        optionsStr += `        id: '${opt.id}',\n`;
        optionsStr += `        label: '${opt.label.replace(/'/g, "\\'")}',\n`;
        optionsStr += `        kind: '${opt.kind}',\n`;
        optionsStr += `        items: '${itemsEscaped}',\n`;
        optionsStr += `        coinsGp: ${opt.coinsGp},\n`;
        optionsStr += `      },\n`;
      }
      
      classEntries.push(`  // ${id.charAt(0).toUpperCase() + id.slice(1)} (${source === 'eberron' ? 'Eberron' : 'PHB'})
  {
    originId: '${id}',
    originKind: 'class',
    source: '${source}',
    options: [
${optionsStr}    ],
  }`);
    }
    
    const newClassesSection = `${newMarker}

${classEntries.join(',\n\n')}
];`;
    
    const newContent = seContent.slice(0, markerIndex) + newClassesSection + seContent.slice(absoluteClosingIndex + 2);
    writeFileSync(OUT_SE, newContent, 'utf8');
    console.log(`  Updated ${OUT_SE} CLASSES section`);
  }
}

console.log('\nDone!');