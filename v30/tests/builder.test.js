import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBrief } from '../modules/blueprint.js';
import { generateProject } from '../modules/project-generator.js';
import { applyMutation } from '../modules/mutations.js';
import { saveProject, loadProjects } from '../modules/storage.js';
import { serializeProject } from '../modules/export.js';

const bp = category => ({name:'Teste',description:'Teste',category,targetUser:'Usuário',style:'futuristic-dark',stack:'vanilla-pwa',features:[],integrations:[]});

test('finance brief detects features and Google auth',()=>{const r=parseBrief('Crie um app financeiro com login Google, dashboard, dívidas e gastos');assert.equal(r.category,'finance');assert.ok(r.features.includes('expenses'));assert.ok(r.features.includes('debts'));assert.ok(r.integrations.includes('google-auth'))});
test('CRM brief detects clients and pipeline',()=>{const r=parseBrief('CRM para clientes, leads e funil de vendas');assert.equal(r.category,'crm');assert.ok(r.features.includes('clients'));assert.ok(r.features.includes('pipeline'))});
test('five core categories produce distinct useful screens',()=>{assert.ok(generateProject(bp('finance')).screens.some(s=>s.type==='finance-dashboard'));assert.ok(generateProject(bp('crm')).screens.some(s=>s.type==='pipeline'));assert.ok(generateProject(bp('marketplace')).screens.some(s=>s.type==='catalog'));assert.ok(generateProject(bp('agenda')).screens.some(s=>s.type==='calendar'));assert.ok(generateProject(bp('dashboard')).screens.some(s=>s.type==='analytics'))});
test('ranking mutation is idempotent',()=>{let r=applyMutation(generateProject(bp('dashboard')),'adicione ranking');r=applyMutation(r.project,'adicione ranking');assert.equal(r.project.screens.filter(s=>s.type==='ranking').length,1)});
test('integration mutations are supported',()=>{let p=generateProject(bp('dashboard'));p=applyMutation(p,'adicione login Google').project;p=applyMutation(p,'adicione Supabase').project;assert.ok(p.integrations.includes('google-auth'));assert.ok(p.integrations.includes('supabase'))});
test('unknown mutation leaves project intact',()=>{const p=generateProject(bp('dashboard'));const before=JSON.stringify(p);const r=applyMutation(p,'xpto desconhecido');assert.equal(r.supported,false);assert.equal(JSON.stringify(p),before)});
test('storage updates same project instead of duplicating',()=>{const map=new Map();const s={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};const p=generateProject(bp('finance'));saveProject(s,p);saveProject(s,{...p,name:'Atualizado'});const all=loadProjects(s);assert.equal(all.length,1);assert.equal(all[0].name,'Atualizado')});
test('export is valid JSON with screens entities and files',()=>{const p=generateProject(bp('crm'));const out=JSON.parse(serializeProject(p));assert.ok(out.screens.length);assert.ok(out.entities.length);assert.ok(out.files.length)});
