import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join('C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker', '.background-cache');

function parseBgPage(html, slug) {
  const contentMatch = html.match(/<div id="page-content">([\s\S]*?)(?:<div class="page-tags">|<script|$)/);
  if (!contentMatch) {
    return null;
  }
  
  const content = contentMatch[1];
  
  // Extract source (first <p>Source: ...</p>)
  let source = '';
  const sourceMatch = content.match(/<p>Source: ([^<]+)<\/p>/);
  if (sourceMatch) {
    source = sourceMatch[1].trim();
  }
  
  // Extract flavour text (paragraphs before the stat block)
  // The stat block starts with <strong>Ability Scores:
  const statBlockStart = content.indexOf('<strong>Ability Scores:');
  let flavour = '';
  if (statBlockStart > 0) {
    const beforeStats = content.substring(0, statBlockStart);
    // Extract text from <p> tags
    const pMatches = beforeStats.matchAll(/<p>([\s\S]*?)<\/p>/g);
    const flavourParts = [];
    for (const m of pMatches) {
      // Skip the Source paragraph
      if (!m[1].includes('Source:')) {
        flavourParts.push(m[1].replace(/<[^>]+>/g, '').trim());
      }
    }
    flavour = flavourParts.join(' ').trim();
  }
  
  // Parse stat lines
  const abilityMatch = content.match(/<strong>Ability Scores:<\/strong>([^<]+)/);
  const featMatch = content.match(/<strong>Feat:<\/strong>([\s\S]*?)(?:<br \/>|<\/p>)/);
  const skillMatch = content.match(/<strong>Skill Proficiencies?:<\/strong>([^<]+)/);
  const toolMatch = content.match(/<strong>Tool Proficienc(?:y|ies):<\/strong>([^<]+)/);
  const equipMatch = content.match(/<strong>Equipment:<\/strong>([\s\S]*?)(?:<\/p>|$)/);
  
  // Parse ability scores
  let abilities = [];
  if (abilityMatch) {
    abilities = abilityMatch[1].split(',').map(s => s.trim().toLowerCase())
      .map(s => s.replace('intelligence', 'int').replace('wisdom', 'wis').replace('charisma', 'cha')
        .replace('strength', 'str').replace('dexterity', 'dex').replace('constitution', 'con'));
  }
  
  // Parse feat
  let featId = '';
  let featName = '';
  if (featMatch) {
    const featText = featMatch[1];
    const linkMatch = featText.match(/<a href="\/feat:([^"]+)">([^<]+)<\/a>/);
    if (linkMatch) {
      featId = linkMatch[1];
      featName = linkMatch[2];
    } else {
      // Handle "Survivor or a Dark Gift feat of your choice" type
      featName = featText.replace(/<[^>]+>/g, '').trim();
      // Try to extract a feat id from the name
      if (featName.toLowerCase().includes('survivor')) featId = 'survivor';
      else if (featName.toLowerCase().includes('sharp eye')) featId = 'sharp-eye';
      else if (featName.toLowerCase().includes('mist walker')) featId = 'mist-walker';
      else if (featName.toLowerCase().includes('gathered whispers')) featId = 'gathered-whispers';
      else if (featName.toLowerCase().includes('planar pact')) featId = 'planar-pact';
      else if (featName.toLowerCase().includes('dark gift')) featId = 'dark-gift';
    }
  }
  
  // Parse skills
  let skillsGranted = [];
  let skillChoices = [];
  let skillChoiceCount = 0;
  if (skillMatch) {
    const skillText = skillMatch[1].trim();
    // Handle "Insight and Religion" or "Choose one kind of Gaming Set" (that's tool)
    // Skills are typically "X and Y" or "X, Y, and Z"
    // Check for "choose" wording
    if (skillText.toLowerCase().includes('choose')) {
      // This is a choice - but skill choices are rare in 2024 backgrounds
      // Usually it's tool proficiency that has choices
    } else {
      skillsGranted = skillText.split(' and ').map(s => s.trim().toLowerCase()
        .replace('sleight of hand', 'sleightOfHand')
        .replace('animal handling', 'animalHandling')
        .replace(/ /g, ''));
    }
  }
  
  // Parse tools
  let toolsGranted = [];
  let toolChoices = [];
  let toolChoiceCount = 0;
  let toolChoiceCategory = undefined;
  if (toolMatch) {
    const toolText = toolMatch[1].trim();
    if (toolText.toLowerCase().includes('choose')) {
      toolChoiceCount = 1;
      if (toolText.toLowerCase().includes('artisan')) {
        toolChoiceCategory = 'artisansTools';
        toolChoices = ["Artisan's Tools (one kind of your choice)"];
      } else if (toolText.toLowerCase().includes('gaming set')) {
        toolChoiceCategory = 'gamingSet';
        toolChoices = ['Gaming Set (one kind of your choice)'];
      } else if (toolText.toLowerCase().includes('musical instrument')) {
        toolChoiceCategory = 'musicalInstrument';
        toolChoices = ['Musical Instrument (one kind of your choice)'];
      } else {
        // Generic choice
        toolChoices = [toolText];
      }
    } else {
      toolsGranted = [toolText];
    }
  }
  
  // Parse equipment
  let equipmentA = '';
  let equipmentB = '50 GP';
  if (equipMatch) {
    const equipText = equipMatch[1].trim();
    // Parse "Choose A or B: (A) ...; or (B) 50 GP"
    const aMatch = equipText.match(/\(A\)([^;]+);/);
    const bMatch = equipText.match(/\(B\)([^;]+)/);
    if (aMatch) equipmentA = aMatch[1].trim();
    if (bMatch) equipmentB = bMatch[1].trim();
  }
  
  return {
    slug,
    source,
    flavour,
    abilities,
    featId,
    featName,
    skillsGranted,
    skillChoices,
    skillChoiceCount,
    toolsGranted,
    toolChoices,
    toolChoiceCount,
    toolChoiceCategory,
    equipmentA,
    equipmentB
  };
}

function main() {
  const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.html'));
  console.log(`Found ${files.length} cached background files`);
  
  const backgrounds = [];
  
  for (const file of files) {
    const slug = file.replace('.html', '');
    const html = fs.readFileSync(path.join(CACHE_DIR, file), 'utf8');
    const parsed = parseBgPage(html, slug);
    if (parsed) {
      backgrounds.push(parsed);
    } else {
      console.log(`Failed to parse: ${slug}`);
    }
  }
  
  // Sort by slug for consistent output
  backgrounds.sort((a, b) => a.slug.localeCompare(b.slug));
  
  for (const bg of backgrounds) {
    console.log('\n=== ' + bg.slug + ' ===');
    console.log('Source:', bg.source);
    console.log('Flavour:', bg.flavour || '(none)');
    console.log('Abilities:', bg.abilities);
    console.log('Feat:', bg.featId, '-', bg.featName);
    console.log('Skills:', bg.skillsGranted);
    console.log('Tools Granted:', bg.toolsGranted);
    console.log('Tool Choices:', bg.toolChoices, 'Count:', bg.toolChoiceCount, 'Category:', bg.toolChoiceCategory);
    console.log('Equipment A:', bg.equipmentA);
    console.log('Equipment B:', bg.equipmentB);
  }
  
  // Also group by source
  console.log('\n\n=== BY SOURCE ===');
  const bySource = {};
  for (const bg of backgrounds) {
    if (!bySource[bg.source]) bySource[bg.source] = [];
    bySource[bg.source].push(bg.slug);
  }
  for (const [src, slugs] of Object.entries(bySource)) {
    console.log(`${src} (${slugs.length}): ${slugs.join(', ')}`);
  }
}

main();