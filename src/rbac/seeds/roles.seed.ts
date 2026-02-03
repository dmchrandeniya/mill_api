export const SYSTEM_ROLES = {
  OWNER: {
    name: 'Owner',
    permissions: ['system.admin'],
  },
  ADMIN: {
    name: 'Admin',
    permissions: [
      'users.read',
      'users.write',
      'roles.read',
      'roles.write',
      'inventory.read',
      'inventory.write',
      'reports.read',
    ],
  },
  STAFF: {
    name: 'Staff',
    permissions: [
      'inventory.read',
      'reports.read',
    ],
  },
} as const;
