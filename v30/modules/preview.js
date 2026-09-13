const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const fakeValue=(label,i)=> label.toLowerCase().includes('receita')?'R$ 84,2k':label.toLowerCase().includes('gasto')?'R$ 18,4k':label.toLowerCase().includes('convers')?'24,8%':label.toLowerCase().includes('meta')?'82%':String((i+2)*17);
function componentNode(component){
  if(component.kind==='metrics'){const g=el('div','preview-grid');component.items.forEach((x,i)=>{const c=el('div','metric-card');c.append(el('small','',x),el('b','',fakeValue(x,i)));g.append(c)});return g}
  if(component.kind==='table'){const box=el('div','preview-block');const table=el('div','fake-table');for(let r=0;r<5;r++){const row=el('div','fake-row');(component.columns||['Item','Status','Valor','Data']).forEach((c,i)=>{row.append(el('span','',r===0?c:(i===0?`Registro ${r}`:i===1?'Ativo':i===2?'R$ 1.250':'Hoje')));});table.append(row)}box.append(table);return box}
  if(component.kind==='list'||component.kind==='task-list'){const box=el('div','preview-block');box.append(el('b','',component.title||'Próximos itens'));for(let i=1;i<=4;i++){const row=el('div','fake-row');row.style.gridTemplateColumns='1fr auto';row.append(el('span','',component.kind==='task-list'?`Tarefa prioritária ${i}`:`Atualização ${i}`),el('span','',i%2?'Hoje':'Amanhã'));box.append(row)}return box}
  if(component.kind==='pipeline'){const box=el('div','preview-block');const p=el('div','pipeline');(component.columns||[]).forEach((x,i)=>{const col=el('div','pipeline-col');col.append(el('b','',x));for(let j=0;j<2;j++)col.append(el('div','pipeline-card',`Lead ${i*2+j+1}`));p.append(col)});box.append(p);return box}
  if(component.kind==='calendar'){const box=el('div','preview-block');const c=el('div','calendar-grid');for(let i=1;i<=35;i++)c.append(el('div','day',i>30?'':String(i)));box.append(c);return box}
  if(component.kind==='products'){const box=el('div','preview-block');const p=el('div','products');for(let i=1;i<=6;i++){const card=el('div','product-card');card.append(el('div','product-img'));const txt=el('div');txt.append(el('b','',`Produto ${i}`),el('div','',`R$ ${49+i*10},90`));card.append(txt);p.append(card)}box.append(p);return box}
  if(component.kind==='product-detail'){const box=el('div','preview-block');box.append(el('h3','','Produto selecionado'),el('p','sub','Detalhes, preço, disponibilidade e ação principal.'));return box}
  if(component.kind==='chart'){const box=el('div','preview-block');box.append(el('b','','Evolução'),el('div','fake-chart'));return box}
  if(component.kind==='ranking'){const box=el('div','preview-block');box.append(el('b','','Ranking de performance'));['1º • Líder','2º • Destaque','3º • Crescimento','4º • Evolução'].forEach(x=>box.append(el('div','fake-row',x)));return box}
  if(component.kind==='cards'){const g=el('div','preview-grid');(component.items||[]).forEach(x=>{const c=el('div','pv-card');c.append(el('b','',x),el('p','sub','Resumo e próximos passos'));g.append(c)});return g}
  if(component.kind==='hero'){const box=el('div','preview-block');box.append(el('h2','',component.title||'Destaque'),el('p','sub','Uma experiência criada pelo AUREON V30.'));return box}
  const box=el('div','preview-block');box.append(el('b','',component.title||'Seção'),el('p','sub','Conteúdo estruturado para esta área do aplicativo.'));return box;
}
export function renderPreview(project,mountNode,screenId){
  if(!mountNode) throw new Error('Preview mount não encontrado');
  mountNode.replaceChildren();
  const screen=project.screens.find(s=>s.id===screenId)||project.screens[0];
  if(!screen){mountNode.append(el('div','preview-block','Nenhuma tela disponível.'));return null}
  const shell=el('div','app-shell');
  const side=el('aside','app-sidebar');side.append(el('div','app-brand',project.name));const nav=el('nav','app-nav');project.screens.forEach(s=>{const b=el('button',s.id===screen.id?'active':'',s.name);b.dataset.previewScreen=s.id;nav.append(b)});side.append(nav);
  const main=el('main','app-main');main.append(el('h1','',screen.title||screen.name),el('div','sub',`${project.category.toUpperCase()} • ${project.style}`));(screen.components||[]).forEach(c=>main.append(componentNode(c)));shell.append(side,main);mountNode.append(shell);return screen.id;
}
