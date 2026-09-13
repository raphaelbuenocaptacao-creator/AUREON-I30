import { createEmptyProject } from './state.js';

const componentSets = {
  finance: [
    ['overview','Visão geral','finance-dashboard','Financeiro',[{kind:'metrics',items:['Saldo','Receitas','Gastos','Dívidas']},{kind:'list',title:'Movimentações recentes'}]],
    ['transactions','Transações','transactions','Transações',[{kind:'table',columns:['Data','Descrição','Categoria','Valor']}]],
    ['debts','Dívidas','debts','Dívidas',[{kind:'cards',items:['Cartões','Parcelas','Vencimentos']}]],
    ['budget','Orçamento','budget','Orçamento',[{kind:'metrics',items:['Planejado','Realizado','Disponível']}]],
    ['profile','Perfil','profile','Perfil',[{kind:'section',title:'Preferências financeiras'}]]
  ],
  crm: [
    ['overview','Visão geral','crm-dashboard','CRM',[{kind:'metrics',items:['Leads','Conversões','Clientes','Receita']}]],
    ['leads','Leads','leads','Leads',[{kind:'table',columns:['Nome','Origem','Etapa','Responsável']}]],
    ['pipeline','Pipeline','pipeline','Pipeline',[{kind:'pipeline',columns:['Novo','Contato','Proposta','Fechado']}]],
    ['clients','Clientes','clients','Clientes',[{kind:'list',title:'Clientes ativos'}]],
    ['activities','Atividades','activities','Atividades',[{kind:'list',title:'Próximas ações'}]]
  ],
  marketplace: [
    ['home','Início','market-home','Marketplace',[{kind:'hero',title:'Encontre o produto ideal'},{kind:'products'}]],
    ['catalog','Catálogo','catalog','Catálogo',[{kind:'products'}]],
    ['product','Produto','product','Produto',[{kind:'product-detail'}]],
    ['cart','Carrinho','cart','Carrinho',[{kind:'list',title:'Itens no carrinho'}]],
    ['orders','Pedidos','orders','Pedidos',[{kind:'table',columns:['Pedido','Status','Total']}]]
  ],
  agenda: [
    ['today','Hoje','today','Hoje',[{kind:'metrics',items:['Compromissos','Tarefas','Concluídas']},{kind:'task-list'}]],
    ['calendar','Calendário','calendar','Calendário',[{kind:'calendar'}]],
    ['tasks','Tarefas','tasks','Tarefas',[{kind:'task-list'}]],
    ['notes','Notas','notes','Notas',[{kind:'cards',items:['Ideias','Reuniões','Pessoal']}]],
    ['profile','Perfil','profile','Perfil',[{kind:'section',title:'Rotina e preferências'}]]
  ],
  dashboard: [
    ['overview','Visão geral','dashboard-overview','Dashboard',[{kind:'metrics',items:['Meta','Resultado','Conversão','Ticket']},{kind:'chart'}]],
    ['analytics','Analytics','analytics','Analytics',[{kind:'chart'},{kind:'metrics',items:['Hoje','Semana','Mês']}]],
    ['reports','Relatórios','reports','Relatórios',[{kind:'table',columns:['Período','Resultado','Variação']}]],
    ['activity','Atividade','activity','Atividade',[{kind:'list',title:'Últimas atualizações'}]],
    ['settings','Configurações','settings','Configurações',[{kind:'section',title:'Preferências'}]]
  ],
  saas: [
    ['overview','Visão geral','saas-overview','Visão geral',[{kind:'metrics',items:['Usuários','Ativos','Receita','Uso']}]],
    ['workspace','Workspace','workspace','Workspace',[{kind:'section',title:'Área principal'}]],
    ['data','Dados','data','Dados',[{kind:'table',columns:['Registro','Status','Atualização']}]],
    ['reports','Relatórios','reports','Relatórios',[{kind:'chart'}]],
    ['settings','Configurações','settings','Configurações',[{kind:'section',title:'Preferências'}]]
  ]
};

const entitySets = {
  finance:[{name:'transactions',fields:['id','date','description','category','amount']},{name:'debts',fields:['id','creditor','dueDate','amount','status']}],
  crm:[{name:'leads',fields:['id','name','source','stage','owner']},{name:'clients',fields:['id','name','contact','status']}],
  marketplace:[{name:'products',fields:['id','name','price','stock','image']},{name:'orders',fields:['id','customer','total','status']}],
  agenda:[{name:'events',fields:['id','title','start','end']},{name:'tasks',fields:['id','title','dueDate','done']}],
  dashboard:[{name:'metrics',fields:['id','label','value','period']},{name:'activities',fields:['id','type','createdAt']}],
  saas:[{name:'records',fields:['id','name','status','updatedAt']}]
};

function filesFor(project){
  const manifest = JSON.stringify({name:project.name,short_name:project.name.slice(0,12),display:'standalone',start_url:'./',theme_color:'#0a0b10',background_color:'#0a0b10'},null,2);
  return [
    {path:'index.html',language:'html',content:`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${project.name}</title><link rel="stylesheet" href="styles.css"></head><body><main id="app"></main><script src="app.js"></script></body></html>`},
    {path:'styles.css',language:'css',content:'body{margin:0;font-family:Inter,system-ui;background:#0a0b10;color:#fff}#app{min-height:100vh}'},
    {path:'app.js',language:'javascript',content:`const project=${JSON.stringify({name:project.name,category:project.category})}; document.querySelector('#app').textContent=project.name;`},
    {path:'manifest.webmanifest',language:'json',content:manifest},
    {path:'README.md',language:'markdown',content:`# ${project.name}\n\nGerado pelo AUREON V30.\n\nCategoria: ${project.category}`}
  ];
}

export function generateProject(blueprint){
  const category = componentSets[blueprint.category] ? blueprint.category : 'saas';
  const screens = componentSets[category].map(([id,name,type,title,components])=>({id,name,type,title,components:structuredClone(components)}));
  const project = createEmptyProject({...blueprint,category,screens,entities:structuredClone(entitySets[category] || entitySets.saas)});
  project.files = filesFor(project);
  return project;
}
