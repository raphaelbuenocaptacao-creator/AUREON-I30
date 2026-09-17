const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadModel() {
  const source = fs.readFileSync('creator/app-model.js', 'utf8');
  const module = { exports: {} };
  const context = vm.createContext({ module, exports: module.exports, console, globalThis: {} });
  vm.runInContext(source, context, { filename: 'creator/app-model.js' });
  return module.exports;
}

const model = loadModel();
const cases = [
  ['Chronos — loja de relógios premium', 'watch', 'catalog', 'Relógios'],
  ['Visão+ — ótica com armações e lentes', 'eyewear', 'catalog', 'Armações'],
  ['Box 77 — oficina mecânica', 'mechanic', 'service', 'Veículos'],
  ['Sabor — restaurante e delivery', 'restaurant', 'catalog', 'Cardápio'],
  ['RunX — corrida com mapa e pace', 'running', 'activity', 'Mapa'],
  ['Lar — imobiliária de apartamentos', 'realestate', 'catalog', 'Imóveis'],
  ['Studio — salão de beleza', 'beauty', 'service', 'Agenda'],
  ['PetCare — veterinária e pets', 'pet', 'service', 'Pets'],
  ['Money — finanças e investimentos', 'finance', 'dashboard', 'Carteira'],
  ['Academy — cursos e aulas', 'education', 'dashboard', 'Aulas'],
  ['Urban — loja de moda', 'fashion', 'catalog', 'Coleções'],
  ['Trip — viagens e hotel', 'travel', 'catalog', 'Destinos']
];

for (const [idea, domain, archetype, expectedTab] of cases) {
  const app = model.buildAppModel(idea);
  assert.equal(app.domain, domain, idea);
  assert.equal(app.archetype, archetype, idea);
  assert.ok(app.tabs.includes(expectedTab), `${idea}: missing ${expectedTab}`);
  assert.equal(app.tabs.length, 4, `${idea}: preview must keep four navigation tabs`);
  assert.equal(app.items.length, 3, `${idea}: preview must have three initial cards`);
  assert.equal(app.actions.length, 3, `${idea}: preview must have three contextual actions`);
  assert.ok(app.hero.length > 10, `${idea}: hero must be contextual`);
}

const customCatalog = model.buildAppModel('Floratta — loja para vender flores, buquês e presentes');
const customService = model.buildAppModel('Resolve — serviço para agendar atendimento de clientes');
assert.equal(customCatalog.archetype, 'catalog');
assert.equal(customService.archetype, 'service');
assert.notEqual(customCatalog.name, 'Novo App');
assert.notDeepEqual(customCatalog.tabs, customService.tabs);

const ui = fs.readFileSync('creator/ui.js', 'utf8');
assert.ok(ui.includes('tabContent'), 'UI must keep contextual content per tab');
assert.ok(ui.includes('secondaryActions'), 'UI must keep contextual secondary actions');
assert.ok(ui.includes('visualSets'), 'UI must keep varied catalog visuals');
assert.ok(ui.includes("running:{'Corridas'"), 'Running preview must have contextual history content');
assert.ok(ui.includes("'Mapa':['Percurso de hoje"), 'Running map tab must show route-specific content');
assert.ok(ui.includes("'Evolução':['Semana atual"), 'Running evolution tab must show progress-specific content');
assert.ok(ui.includes('instagram.com/aureon_saas'), 'AUREON Instagram lead must be preserved');

console.log('I30 domain preview regression suite passed');
