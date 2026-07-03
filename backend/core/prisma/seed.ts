import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed system roles.
 */
async function seedRoles() {
  const roles = [
    'ADMIN',
    'CUSTOMER',
    'VENDOR',
    'COURIER',
    'SHIPPING_COMPANY',
  ];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: {
        name: roleName,
      },
      update: {},
      create: {
        name: roleName,
      },
    });
  }

  console.log('✅ Roles seeded');
}

/**
 * Seed system permissions.
 */
async function seedPermissions() {
  const permissions = [
    // Users
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },

    // Roles
    { resource: 'roles', action: 'create' },
    { resource: 'roles', action: 'read' },
    { resource: 'roles', action: 'update' },
    { resource: 'roles', action: 'delete' },

    // Products
    { resource: 'products', action: 'create' },
    { resource: 'products', action: 'read' },
    { resource: 'products', action: 'update' },
    { resource: 'products', action: 'delete' },

    // Inventory
    { resource: 'inventory', action: 'read' },
    { resource: 'inventory', action: 'update' },

    // Orders
    { resource: 'orders', action: 'create' },
    { resource: 'orders', action: 'read' },
    { resource: 'orders', action: 'update' },
    { resource: 'orders', action: 'approve' },

    // Messages
    { resource: 'messages', action: 'read' },
    { resource: 'messages', action: 'reply' },

    // Stores
    { resource: 'stores', action: 'create' },
    { resource: 'stores', action: 'read' },
    { resource: 'stores', action: 'update' },
    { resource: 'stores', action: 'delete' },

    // Reports
    { resource: 'reports', action: 'read' },
    { resource: 'reports', action: 'export' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action: {
          resource: permission.resource,
          action: permission.action,
        },
      },
      update: {},
      create: {
        resource: permission.resource,
        action: permission.action,
      },
    });
  }

  console.log('✅ Permissions seeded');
}

/**
 * Seed role templates.
 */
async function seedRoleTemplates() {
  const templates = [
    {
      name: 'Store Manager',
      description: 'General store administration',
    },
    {
      name: 'Inventory Manager',
      description: 'Inventory and stock management',
    },
    {
      name: 'Product Manager',
      description: 'Catalog and product management',
    },
    {
      name: 'Customer Support',
      description: 'Customer communication and support',
    },
    {
      name: 'Marketing Manager',
      description: 'Marketing campaigns and promotions',
    },
    {
      name: 'Finance Manager',
      description: 'Financial reporting and analysis',
    },
    {
      name: 'Warehouse Supervisor',
      description: 'Warehouse and shipment supervision',
    },
  ];

  for (const template of templates) {
    await prisma.roleTemplate.upsert({
      where: {
        name: template.name,
      },
      update: {
        description: template.description,
      },
      create: {
        name: template.name,
        description: template.description,
      },
    });
  }

  console.log('✅ Role templates seeded');
}

/**
 * Helper function.
 */
async function assignTemplatePermission(
  templateName: string,
  resource: string,
  action: string,
) {
  const template = await prisma.roleTemplate.findUnique({
    where: {
      name: templateName,
    },
  });

  const permission = await prisma.permission.findUnique({
    where: {
      resource_action: {
        resource,
        action,
      },
    },
  });

  if (!template || !permission) {
    return;
  }

  await prisma.roleTemplatePermission.upsert({
    where: {
      roleTemplateId_permissionId: {
        roleTemplateId: template.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleTemplateId: template.id,
      permissionId: permission.id,
    },
  });
}

/**
 * Seed template-permission mapping.
 */
async function seedTemplatePermissions() {
  const mappings = [
    // Store Manager
    ['Store Manager', 'stores', 'read'],
    ['Store Manager', 'stores', 'update'],
    ['Store Manager', 'products', 'read'],
    ['Store Manager', 'products', 'create'],
    ['Store Manager', 'products', 'update'],
    ['Store Manager', 'orders', 'read'],
    ['Store Manager', 'orders', 'update'],
    ['Store Manager', 'inventory', 'read'],
    ['Store Manager', 'reports', 'read'],

    // Inventory Manager
    ['Inventory Manager', 'products', 'read'],
    ['Inventory Manager', 'inventory', 'read'],
    ['Inventory Manager', 'inventory', 'update'],
    ['Inventory Manager', 'reports', 'read'],

    // Product Manager
    ['Product Manager', 'products', 'read'],
    ['Product Manager', 'products', 'create'],
    ['Product Manager', 'products', 'update'],

    // Customer Support
    ['Customer Support', 'messages', 'read'],
    ['Customer Support', 'messages', 'reply'],
    ['Customer Support', 'orders', 'read'],

    // Marketing Manager
    ['Marketing Manager', 'products', 'read'],
    ['Marketing Manager', 'reports', 'read'],

    // Finance Manager
    ['Finance Manager', 'orders', 'read'],
    ['Finance Manager', 'reports', 'read'],
    ['Finance Manager', 'reports', 'export'],

    // Warehouse Supervisor
    ['Warehouse Supervisor', 'inventory', 'read'],
    ['Warehouse Supervisor', 'inventory', 'update'],
    ['Warehouse Supervisor', 'products', 'read'],
  ] as const;

  for (const mapping of mappings) {
    await assignTemplatePermission(
      mapping[0],
      mapping[1],
      mapping[2],
    );
  }

  console.log('✅ Template permissions seeded');
}

/**
 * Main entrypoint.
 */
async function main() {
  await seedRoles();

  await seedPermissions();

  await seedRoleTemplates();

  await seedTemplatePermissions();

  console.log('✅ Seeding completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });