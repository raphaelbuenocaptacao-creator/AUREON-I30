(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.I30Catalog=api;})(typeof window!=='undefined'?window:globalThis,function(){
  const CREATION_TYPES=[
    {id:'appIdea',label:'Criar Aplicativo',icon:'▦',primary:true,description:'Transforme sua ideia em um blueprint completo de app pronto para construir.'},
    {id:'saas30',label:'30 ideias de SaaS',icon:'30',description:'Explore 30 oportunidades de SaaS a partir da sua ideia.'},
    {id:'prompt',label:'Prompt',icon:'⌘',description:'Prompt completo e estruturado para IA.'},
    {id:'brand',label:'Nome / Marca',icon:'◆',description:'Nomes, slogan, posicionamento e direção.'},
    {id:'offer',label:'Oferta',icon:'$',description:'Promessa, benefícios, objeções e CTA.'},
    {id:'salesPage',label:'Página de venda',icon:'▤',description:'Estrutura completa da página por seções.'},
    {id:'post',label:'Post',icon:'✦',description:'Gancho, legenda, CTA e hashtags.'},
    {id:'reels',label:'Roteiro Reels/TikTok',icon:'▶',description:'Cenas, falas, textos de tela e CTA.'},
    {id:'video',label:'Vídeo',icon:'◉',description:'Pacote de produção com cenas, narração e prompt de render.'},
    {id:'ad',label:'Anúncio',icon:'↗',description:'Headline, corpo, CTA e variações.'},
    {id:'contentPlan',label:'Plano de conteúdo',icon:'☷',description:'Pilares, calendário, ideias e CTAs.'},
    {id:'launchStrategy',label:'Estratégia de lançamento',icon:'⚡',description:'Pré-lançamento, canais, conteúdos e métricas.'}
  ];
  function getCreationType(id){return CREATION_TYPES.find(x=>x.id===id)||null;}
  return {CREATION_TYPES,getCreationType};
});
