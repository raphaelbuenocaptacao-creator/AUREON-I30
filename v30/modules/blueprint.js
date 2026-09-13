const uniq = arr => [...new Set(arr)];
const has = (text, words) => words.some(w => text.includes(w));

export function normalizeBlueprint(input = {}) {
  return {
    name: String(input.name || 'Meu App').trim() || 'Meu App',
    description: String(input.description || '').trim(),
    category: input.category || 'saas',
    targetUser: input.targetUser || 'Usuário',
    style: input.style || 'futuristic-dark',
    stack: input.stack || 'vanilla-pwa',
    features: uniq(Array.isArray(input.features) ? input.features : []),
    screens: uniq(Array.isArray(input.screens) ? input.screens : []),
    entities: uniq(Array.isArray(input.entities) ? input.entities : []),
    integrations: uniq(Array.isArray(input.integrations) ? input.integrations : [])
  };
}

export function parseBrief(brief) {
  const raw = String(brief || '').trim();
  const t = raw.toLocaleLowerCase('pt-BR');
  let category = 'saas';
  if (has(t,['finance','financeiro','finanças','divida','dívida','gasto','despesa'])) category='finance';
  else if (has(t,['crm','lead','cliente','pipeline','funil'])) category='crm';
  else if (has(t,['marketplace','loja','catálogo','catalogo','produto','carrinho','pedido'])) category='marketplace';
  else if (has(t,['agenda','calendário','calendario','tarefa','agendamento','compromisso'])) category='agenda';
  else if (has(t,['dashboard','painel','indicador','kpi','métrica','metrica'])) category='dashboard';

  const features=[]; const integrations=[]; const screens=[]; const entities=[];
  if (has(t,['dashboard','painel'])) features.push('dashboard');
  if (has(t,['gasto','despesa'])) {features.push('expenses'); entities.push('transactions');}
  if (has(t,['dívida','divida'])) {features.push('debts'); entities.push('debts');}
  if (has(t,['cliente'])) {features.push('clients'); entities.push('clients');}
  if (has(t,['lead'])) {features.push('leads'); entities.push('leads');}
  if (has(t,['pipeline','funil'])) features.push('pipeline');
  if (has(t,['produto','catálogo','catalogo'])) {features.push('catalog'); entities.push('products');}
  if (has(t,['carrinho'])) features.push('cart');
  if (has(t,['pedido'])) {features.push('orders'); entities.push('orders');}
  if (has(t,['agenda','calendário','calendario','agendamento'])) {features.push('calendar'); entities.push('events');}
  if (has(t,['tarefa'])) {features.push('tasks'); entities.push('tasks');}
  if (has(t,['ranking'])) features.push('ranking');
  if (has(t,['notificação','notificacao','notificações','notificacoes'])) features.push('notifications');
  if (has(t,['google'])) integrations.push('google-auth');
  else if (has(t,['login','autenticação','autenticacao'])) integrations.push('auth');
  if (has(t,['supabase'])) integrations.push('supabase');

  const categoryLabel = {finance:'Finance',crm:'CRM',marketplace:'Marketplace',agenda:'Agenda',dashboard:'Dashboard',saas:'SaaS'}[category];
  const quoted = raw.match(/[“"']([^”"']{3,40})[”"']/)?.[1];
  const name = quoted || `${categoryLabel} App`;
  const targetUser = has(t,['empresa','equipe','negócio','negocio']) ? 'Equipe/empresa' : 'Usuário final';
  const defaultScreens = {
    finance:['Visão geral','Transações','Dívidas','Orçamento','Perfil'],
    crm:['Visão geral','Leads','Pipeline','Clientes','Atividades'],
    marketplace:['Início','Catálogo','Produto','Carrinho','Pedidos'],
    agenda:['Hoje','Calendário','Tarefas','Notas','Perfil'],
    dashboard:['Visão geral','Analytics','Relatórios','Atividade','Configurações'],
    saas:['Visão geral','Workspace','Dados','Relatórios','Configurações']
  }[category];
  screens.push(...defaultScreens);
  return normalizeBlueprint({name,description:raw,category,targetUser,style:'futuristic-dark',stack:'vanilla-pwa',features,screens,entities,integrations});
}
