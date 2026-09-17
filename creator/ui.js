(function(){
  const catalog=window.I30Catalog, generators=window.I30Generators, history=window.I30History;
  if(!catalog||!generators||!history){console.error('I30 Creator: módulos não carregados');return;}
  const $=s=>document.querySelector(s);
  const hub=$('#creatorHub'), input=$('#creatorIdeaInput'), grid=$('#creatorTypeGrid'), resultBox=$('#creatorResult'), resultTitle=$('#creatorResultTitle'), resultSections=$('#creatorResultSections'), copyBtn=$('#creatorCopyBtn'), backBtn=$('#creatorBackBtn'), currentIdea=$('#creatorCurrentIdea'), historyBtn=$('#creatorHistoryBtn'), historyPanel=$('#creatorHistoryPanel'), historyList=$('#creatorHistoryList');
  let current=null;
  function showMessage(text){const el=$('#creatorMessage');if(el){el.textContent=text;el.hidden=!text;}}
  function renderCatalog(){
    if(!grid)return;
    grid.replaceChildren();
    catalog.CREATION_TYPES.forEach(type=>{
      const b=document.createElement('button');b.type='button';b.className=`creator-type${type.primary?' creator-type-primary':''}`;b.dataset.type=type.id;b.setAttribute('aria-label',`${type.label}: ${type.description}`);
      const icon=document.createElement('span');icon.className='creator-type-icon';icon.textContent=type.icon;
      const title=document.createElement('strong');title.textContent=type.label;
      const desc=document.createElement('small');desc.textContent=type.description;
      if(type.primary){const badge=document.createElement('em');badge.className='creator-primary-badge';badge.textContent='PRINCIPAL';b.append(badge);}
      b.append(icon,title,desc);grid.appendChild(b);
    });
  }
  function setIdea(value){if(!input)return;input.value=String(value||'').slice(0,500);if(currentIdea)currentIdea.textContent=input.value?`Ideia: ${input.value}`:'Escolha o que você quer criar';}
  function create(type){
    const idea=input?.value.trim()||'';
    if(!idea){showMessage('Escreva sua ideia acima e depois toque em Criar Aplicativo.');input?.focus();input?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    showMessage('');
    if(type==='saas30'){
      const legacy=$('#topicInput'), form=$('#ideaForm');
      if(legacy&&form){legacy.value=idea.slice(0,80);hub?.classList.add('hidden');$('#hero')?.classList.remove('hidden');form.requestSubmit();}
      else showMessage('O motor de 30 SaaS não carregou. Atualize a página e tente novamente.');
      return;
    }
    try{current=generators.generateCreation({type,idea,context:{}});history.saveCreation(localStorage,current);renderResult(current);}catch(error){console.error(error);showMessage(error.message||'Não foi possível gerar agora.');}
  }
  function renderResult(item){current=item;hub?.querySelector('.creator-start')?.classList.add('hidden');resultBox?.classList.remove('hidden');if(resultTitle)resultTitle.textContent=item.title;if(resultSections){resultSections.replaceChildren();item.sections.forEach(section=>{const article=document.createElement('article');const h=document.createElement('h3');h.textContent=section.heading;const p=document.createElement('p');p.textContent=section.content;article.append(h,p);resultSections.append(article);});}window.scrollTo({top:Math.max(0,(hub?.offsetTop||0)-16),behavior:'smooth'});}
  async function copy(){if(!current)return;try{await navigator.clipboard.writeText(current.plainText);copyBtn.textContent='COPIADO ✓';setTimeout(()=>copyBtn.textContent='COPIAR RESULTADO',1500);}catch{showMessage('Não consegui copiar automaticamente. Selecione o texto do resultado.');}}
  function reset(){current=null;resultBox?.classList.add('hidden');hub?.querySelector('.creator-start')?.classList.remove('hidden');showMessage('');setTimeout(()=>input?.focus(),50);}
  function renderHistory(){const items=history.loadCreations(localStorage);historyList?.replaceChildren();if(!historyList)return;if(!items.length){const p=document.createElement('p');p.className='creator-empty';p.textContent='Nenhuma criação salva ainda.';historyList.append(p);return;}items.slice(0,30).forEach(item=>{const b=document.createElement('button');b.type='button';b.className='creator-history-item';const s=document.createElement('strong');s.textContent=item.title;const m=document.createElement('small');m.textContent=`${item.type} · ${item.idea}`;b.append(s,m);b.onclick=()=>{historyPanel?.classList.add('hidden');setIdea(item.idea);renderResult(item);};historyList.append(b);});}
  function toggleHistory(){renderHistory();historyPanel?.classList.toggle('hidden');}
  function prefillFromQuery(){try{const q=new URLSearchParams(location.search).get('idea');if(q)setIdea(q);}catch{}}
  renderCatalog();prefillFromQuery();
  grid?.addEventListener('click',event=>{const button=event.target.closest('.creator-type');if(button&&grid.contains(button)){event.preventDefault();create(button.dataset.type);}});
  input?.addEventListener('input',()=>setIdea(input.value));copyBtn?.addEventListener('click',copy);backBtn?.addEventListener('click',reset);historyBtn?.addEventListener('click',toggleHistory);$('#creatorHistoryClose')?.addEventListener('click',()=>historyPanel?.classList.add('hidden'));
})();
