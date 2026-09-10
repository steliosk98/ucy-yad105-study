import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CRAM } from '../js/cram.js';
import { sosGuide, guideCopy, diagrams } from '../js/sos-guide.js';
const bank = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url)));
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
assert.deepEqual(Object.keys(guideCopy.en), Object.keys(guideCopy.el));
assert.equal(diagrams.length, 7);
for (const lang of ['en','el','both']) {
  const html = sosGuide(bank,lang,esc);
  assert.equal((html.match(/data-question-id=/g) || []).length, 140);
  assert.equal((html.match(/<figure /g) || []).length, 7);
  assert.ok(html.includes('id="printGuide"'));
  for (const l of CRAM) for (const id of l.ids) {
    const q = bank.questions.find(q => q.id === id);
    for (const k of lang === 'both' ? ['qe','qg','ae','ag'] : lang === 'el' ? ['qg','ag'] : ['qe','ae']) {
      assert.ok(html.includes(esc(q[k])), `${lang} missing ${id} ${k}`);
    }
  }
  for (const d of diagrams) {
    assert.ok(html.includes(esc(lang === 'el' ? d.noteEl : d.noteEn)));
    if (lang === 'both') assert.ok(html.includes(esc(d.noteEl)));
  }
}
const modified = structuredClone(bank);
modified.questions[0].ae = '<script>alert("test")</script>';
assert.ok(!sosGuide(modified,'en',esc).includes('<script>'));
const css = readFileSync(new URL('../css/style.css',import.meta.url),'utf8');
assert.ok(css.includes('@media print'));
assert.ok(css.includes('break-inside: avoid'));
assert.ok(css.includes('.guide-day + .guide-day { break-before: page; }'));
console.log('ok — printable guide has all 140 complete bilingual Q&As, seven localized diagrams and print rules');
