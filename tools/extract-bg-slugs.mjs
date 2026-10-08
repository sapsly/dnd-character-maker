import fs from 'fs';

const html = fs.readFileSync('C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker\\reference\\DND website\\Backgrounds - D&D 5e (2024).html', 'utf8');
const matches = html.matchAll(/<a href="\/background:([^"]+)">/g);
const slugs = [];
for (const m of matches) {
  slugs.push(m[1]);
}
console.log('Total:', slugs.length);
console.log(slugs.join('\n'));