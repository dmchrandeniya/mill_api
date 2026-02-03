export const SYSTEM_PERMISSIONS = [
  // users
  { key: 'users.read', desc: 'Read users' },
  { key: 'users.write', desc: 'Create/update users' },

  // roles & permissions
  { key: 'roles.read', desc: 'Read roles' },
  { key: 'roles.write', desc: 'Manage roles & permissions' },

  // inventory (future)
  { key: 'inventory.read', desc: 'Read inventory' },
  { key: 'inventory.write', desc: 'Manage inventory' },

  // reports
  { key: 'reports.read', desc: 'View reports' },

  // system
  { key: 'system.admin', desc: 'Full system access' },
] as const;
