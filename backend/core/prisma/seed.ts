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
 *
 * Permission model:
 * Resource + Action
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
 * Main seed entrypoint.
 */
async function main() {
  await seedRoles();

  await seedPermissions();

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