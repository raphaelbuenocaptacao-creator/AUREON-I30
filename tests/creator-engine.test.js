const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function load(path, extras = {}) {
  const source = fs.readFileSync(path, 'utf8');
  const module = { exports: {} };
  const context = vm.createContext({ module, exports: module.exports, require, console, Date, ...extras });
  vm.runInContext(source, context, { filename: path });
  return module.exports;
}

const catalog = load('creator/catalog.js');
const generators = load('creator/generators.js');
const history = load('creator/history.js');

assert.equal(catalog.CREATION_TYPES.length, 12, 'I30 deve expor 12 formatos na primeira versão');
assert.ok(catalog.CREATION_TYPES.some(x => x.id === 'post'));
assert.ok(catalog.CREATION_TYPES.some(x => x.id === 'video'));
assert.ok(catalog.CREATION_TYPES.some(x => x.id === 'saas30'));

for (const type of catalog.CREATION_TYPES.filter(x => x.id !== 'saas30')) {
  const result = generators.generateCreation({ type: type.id, idea: 'divulgar uma hamburgueria nova', context: {} });
  assert.equal(result.type, type.id);
  assert.equal(result.idea, 'divulgar uma hamburgueria nova');
  assert.ok(result.title.length > 5);
  assert.ok(Array.isArray(result.sections) && result.sections.length >= 2, `${type.id} precisa gerar seções`);
  assert.ok(result.plainText.includes('hamburgueria'), `${type.id} precisa usar a ideia do usuário`);
  assert.equal(result.source, 'local');
}

const video = generators.generateCreation({ type: 'video', idea: 'campanha para academia', context: {} });
assert.ok(/pacote de produção/i.test(video.plainText));
assert.ok(!/mp4 criado|vídeo renderizado/i.test(video.plainText));

const memory = (() => {
  const data = new Map();
  return { getItem:k => data.has(k) ? data.get(k) : null, setItem:(k,v)=>data.set(k,String(v)), removeItem:k=>data.delete(k) };
})();
const sample = generators.generateCreation({ type: 'post', idea: 'cafeteria premium', context: {} });
history.saveCreation(memory, sample);
const loaded = history.loadCreations(memory);
assert.equal(loaded.length, 1);
assert.equal(loaded[0].idea, 'cafeteria premium');

const html = fs.readFileSync('index.html', 'utf8');
assert.ok(html.includes('Você tem uma ideia?'));
assert.ok(html.includes('creator/catalog.js'));
assert.ok(html.includes('creator/ui.js'));
assert.ok(html.includes('id="creatorIdeaInput"'));
assert.ok(html.includes('id="hero"'), 'fluxo legado de 30 SaaS deve continuar no HTML');

const sw = fs.readFileSync('sw.js', 'utf8');
for (const asset of ['./creator/catalog.js','./creator/generators.js','./creator/history.js','./creator/ui.js','./creator.css']) {
  assert.ok(sw.includes(asset), `service worker deve cachear ${asset}`);
}

console.log('I30 Creator Engine tests passed');
