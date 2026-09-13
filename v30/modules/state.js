export function createEmptyProject(overrides = {}) {
  const now = new Date().toISOString();
  return {
    id: overrides.id || `v30-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    name: overrides.name || 'Novo App',
    description: overrides.description || '',
    category: overrides.category || 'saas',
    targetUser: overrides.targetUser || 'Usuário',
    style: overrides.style || 'futuristic-dark',
    stack: overrides.stack || 'vanilla-pwa',
    features: [...(overrides.features || [])],
    screens: [...(overrides.screens || [])],
    entities: [...(overrides.entities || [])],
    integrations: [...(overrides.integrations || [])],
    files: [...(overrides.files || [])],
    history: [...(overrides.history || [])],
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now
  };
}
