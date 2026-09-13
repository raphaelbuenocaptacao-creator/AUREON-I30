function clone(project){ return structuredClone(project); }
function addOnce(arr,value){ if(!arr.includes(value)) arr.push(value); }
function addScreen(project, screen){ if(!project.screens.some(s=>s.type===screen.type)) project.screens.push(screen); }

export function applyMutation(project,message){
  const text=String(message||'').trim();
  const t=text.toLocaleLowerCase('pt-BR');
  const next=clone(project); let summary=''; let supported=true;
  if(/ranking/.test(t)){
    addOnce(next.features,'ranking'); addScreen(next,{id:'ranking',name:'Ranking',type:'ranking',title:'Ranking',components:[{kind:'ranking'}]}); summary='Tela de ranking adicionada.';
  } else if(/futurist|premium|moderno/.test(t)){
    next.style='futuristic-dark'; summary='Visual atualizado para futurista.';
  } else if(/google/.test(t) && /(login|auth|entrar)/.test(t)){
    addOnce(next.integrations,'google-auth'); summary='Login Google adicionado à configuração.';
  } else if(/supabase/.test(t)){
    addOnce(next.integrations,'supabase'); addOnce(next.features,'cloud-data'); summary='Supabase adicionado como integração de dados.';
  } else if(/relat[oó]rio/.test(t)){
    addOnce(next.features,'reports'); addScreen(next,{id:'reports',name:'Relatórios',type:'reports',title:'Relatórios',components:[{kind:'chart'},{kind:'table',columns:['Período','Resultado','Variação']}]}); summary='Tela de relatórios adicionada.';
  } else if(/notifica/.test(t)){
    addOnce(next.features,'notifications'); summary='Notificações adicionadas ao projeto.';
  } else if(/tela/.test(t) && /perfil/.test(t)){
    addScreen(next,{id:'profile',name:'Perfil',type:'profile',title:'Perfil',components:[{kind:'section',title:'Perfil do usuário'}]}); summary='Tela de perfil adicionada.';
  } else {
    supported=false;
  }
  if(!supported) return {project,summary:'Ainda não reconheço essa alteração. Tente pedir ranking, relatórios, login Google, Supabase, notificações ou estilo futurista.',supported:false};
  next.updatedAt=new Date().toISOString();
  next.history=[...(next.history||[]),{request:text,summary,at:next.updatedAt}];
  return {project:next,summary,supported:true};
}
