import fs from 'node:fs';
import assert from 'node:assert/strict';
const atlas = JSON.parse(fs.readFileSync(new URL('../public/models/atlas.json', import.meta.url), 'utf8'));
const dictionary = JSON.parse(fs.readFileSync(new URL('../app/anatomy-ko.json', import.meta.url), 'utf8'));
const names = new Set(atlas.concepts.map(c => c.name.toLowerCase()));
for (const [english, entry] of Object.entries(dictionary)) {
  assert.ok(names.has(english), `Not present in BodyParts3D concepts: ${english}`);
  assert.ok(typeof entry.ko === 'string' && entry.ko.trim(), `Missing Korean name: ${english}`);
  assert.ok(Array.isArray(entry.aliases), `Invalid aliases: ${english}`);
  assert.equal(new Set(entry.aliases).size, entry.aliases.length, `Repeated aliases: ${english}`);
}
for (const english of ['scapula', 'humerus', 'thoracic vertebra', 'zone of deltoid', 'serratus anterior']) {
  assert.ok(dictionary[english], `Missing required teaching term: ${english}`);
}
console.log(`Korean anatomy glossary validated: ${Object.keys(dictionary).length} concepts, all mapped to real atlas names.`);
