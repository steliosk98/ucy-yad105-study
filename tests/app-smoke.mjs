// Run the actual router and event handlers with a small browser-shell double.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const bank = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url)));
const docEvents = {}, winEvents = {}, elements = new Map();
class Element {
  constructor() { this.dataset = {}; this.value = ''; this.classList = { add() {}, remove() {}, toggle() {} }; }
  setAttribute() {} removeAttribute() {} focus() {} setSelectionRange() {}
  querySelector(s) { return get(s); }
}
const get = key => { if (!elements.has(key)) elements.set(key, new Element()); return elements.get(key); };
globalThis.document = { querySelector: get, querySelectorAll: () => [], documentElement: new Element(),
  addEventListener: (k, fn) => (docEvents[k] ||= []).push(fn) };
globalThis.window = { addEventListener: (k,fn) => winEvents[k] = fn, scrollTo() {}, print() { globalThis.printCalled = true; } };
let hashValue = '#/learn';
globalThis.location = { get hash() { return hashValue; }, set hash(v) { hashValue = v.startsWith('#') ? v : '#' + v; }, hostname: 'localhost' };
globalThis.history = { replaceState() {}, pushState() {} };
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.fetch = async () => ({ json: async () => bank });
await import('../js/app.js');
await new Promise(resolve => setTimeout(resolve, 0));
assert.ok(get('#view').innerHTML.includes('Your 7-day exam sprint'));
const route = hash => { location.hash = hash; winEvents.hashchange(); };
const click = (action, value = '') => {
  const button = { dataset: { learn: action, value } };
  for (const fn of docEvents.click) fn({ target: { closest: () => button } });
  winEvents.hashchange();
};
click('start', 'cram-v1-day-1');
assert.ok(get('#view').innerHTML.includes(bank.questions[0].qe));
get('#langBtn').onclick();
assert.ok(get('#view').innerHTML.includes(bank.questions[0].qg));
assert.ok(get('#view').innerHTML.includes('Ενδεικτική απάντηση'));
get('#langBtn').onclick();
assert.ok(get('#view').innerHTML.includes(bank.questions[0].qe));
assert.ok(get('#view').innerHTML.includes(bank.questions[0].qg));
click('advance');
route('#/');
assert.ok(get('#view').innerHTML.includes('data-go="#/learn"'));
route('#/learn/run');
assert.ok(get('#view').innerHTML.includes(bank.questions.find(q => q.id === 'Q005').qe));
for (const hash of ['#/cards', '#/exam', '#/browse', '#/stats', '#/settings']) {
  route(hash);
  assert.ok(get('#view').innerHTML.length > 100, hash);
}
const S = await import('../js/store.js');
S.state.srs.Q001 = { due: Date.now() - 1000 };
S.state.srs.Q002 = { due: Date.now() - 1000 }; // Not part of the SOS selection.
S.state.srs.Q005 = { due: Date.now() + 864e5 };
route('#/cards/run?deck=cram&n=20');
assert.ok(get('#view').innerHTML.includes(bank.questions[0].qe));
assert.ok(!get('#view').innerHTML.includes(bank.questions[1].qe));
assert.ok(get('#view').innerHTML.includes('1 of 1'), 'SOS review selects only due essential cards');
route('#/sos');
assert.equal(document.documentElement.dataset.printGuide, 'true');
assert.ok(get('#view').innerHTML.includes('Q463'));
for (const fn of docEvents.click) fn({ target: { closest: () => ({ id: 'printGuide', dataset: {} }) } });
assert.equal(globalThis.printCalled, true);
route('#/learn');
assert.equal(document.documentElement.dataset.printGuide, 'false');
const worker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
for (const file of ['js/learn.js', 'js/learn-view.js', 'js/cram.js', 'js/sos-guide.js']) assert.ok(worker.includes(file), 'offline asset included');
console.log('ok — app boot, learning routes, language switch, pause/navigation, existing views and offline asset manifest');
