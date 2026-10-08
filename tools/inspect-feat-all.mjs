import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\kaieh\\Documents\\usefull\\DND Chracter maker';
const html = fs.readFileSync(path.join(ROOT, '.feat-cache', '_all.html'), 'utf8');

// Split page-content region
const content = html.match(/<div id="page-content">([\s\S]*)$/)[1];

// Walk through: h1 sections introduce a tab-view group; yui-nav lis give tab labels;
// wiki-tab divs hold the feat tables.
const lines = content.split('\n');
let currentSection = '(root)';
let currentTab = '';
let output = [];

for (const line of lines) {
  const h1 = line.match(/<h1[^>]*><span>(.*?)<\/span><\/h1>/);
  if (h1) {
    currentSection = h1[1].trim();
    currentTab = '';
    output.push(`\n===== ${currentSection} =====`);
    continue;
  }
  const tab = line.match(/<li class="selected"><a href="javascript:;"><em>(.*?)<\/em><\/a><\/li>|<li><a href="javascript:;"><em>(.*?)<\/em><\/a><\/li>/);
  if (tab) {
    currentTab = (tab[1] || tab[2] || '').trim();
    continue;
  }
  const tabDiv = line.match(/<div id="wiki-tab-\d+-\d+"[^>]*>.*?<div class="list-pages-box">/);
  if (tabDiv) {
    output.push(`\n  [tab] ${currentTab || '(unnamed tab)'}`);
    continue;
  }
  const feat = line.match(/<td><a href="\/feat:([a-z0-9-]+)">([^<]+)<\/a><\/td>/);
  if (feat) {
    output.push(`    ${feat[1]}  |  ${feat[2]}`);
  }
}

console.log(output.join('\n'));