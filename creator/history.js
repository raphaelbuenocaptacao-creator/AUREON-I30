(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.I30History=api;})(typeof window!=='undefined'?window:globalThis,function(){
  const KEY='aureon:i30:creator-history:v1';
  function valid(item){return item&&typeof item.id==='string'&&typeof item.type==='string'&&typeof item.idea==='string'&&Array.isArray(item.sections);}
  function loadCreations(storage){try{const parsed=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(parsed)?parsed.filter(valid):[];}catch{return [];}}
  function saveCreation(storage,item){const list=loadCreations(storage);const next=[item,...list.filter(x=>x.id!==item.id)].slice(0,60);storage.setItem(KEY,JSON.stringify(next));return next;}
  function removeCreation(storage,id){const next=loadCreations(storage).filter(x=>x.id!==id);storage.setItem(KEY,JSON.stringify(next));return next;}
  return {KEY,loadCreations,saveCreation,removeCreation};
});
