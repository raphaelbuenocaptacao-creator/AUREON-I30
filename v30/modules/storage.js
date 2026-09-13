export const STORAGE_KEY='aureon:v30:projects:v1';
const valid = p => p && typeof p==='object' && typeof p.id==='string' && typeof p.name==='string' && Array.isArray(p.screens) && Array.isArray(p.entities) && Array.isArray(p.files);
export function loadProjects(storage){
  try{ const parsed=JSON.parse(storage.getItem(STORAGE_KEY)||'[]'); return Array.isArray(parsed)?parsed.filter(valid):[]; }catch{return [];}
}
export function saveProject(storage,project){
  const all=loadProjects(storage); const idx=all.findIndex(p=>p.id===project.id); const copy=structuredClone(project);
  if(idx>=0) all[idx]=copy; else all.unshift(copy);
  storage.setItem(STORAGE_KEY,JSON.stringify(all)); return copy;
}
export function removeProject(storage,projectId){ const all=loadProjects(storage).filter(p=>p.id!==projectId); storage.setItem(STORAGE_KEY,JSON.stringify(all)); return all; }
