import mongoose from 'mongoose';
import { PERMISSIONS, ROLES, ADMIN } from '../models/index.js';
import helper from '../utils/helper.js';
import defaultAdminPermissions from '../utils/default/defaultAdminPermissions.json' assert { type: 'json' };
import defaultUserPermissions from '../utils/default/defaultUserPermissions.json' assert { type: 'json' };

async function seedPermissions() {
  const adminPermissions = [];
  const userPermissions = [];

  for (const permission of defaultAdminPermissions) {
    const adminPermission = await seedPermission(PERMISSIONS, permission);
    adminPermissions.push(adminPermission);
  }

  for (const permission of defaultUserPermissions) {
    const userPermission = await seedPermission(PERMISSIONS, permission);
    userPermissions.push(userPermission);
  }

  return { adminPermissions, userPermissions };
}

async function seedPermission(model, permission) {
  return model.updateOne({ can: permission.can }, { $set: permission }, { upsert: true });
}

async function seedRoles(adminPermissions, userPermissions) {
  const adminPermissionsIds = adminPermissions.map(({ upsertedId }) => new mongoose.Types.ObjectId(upsertedId));
  const userPermissionsIds = userPermissions.map(({ upsertedId }) => new mongoose.Types.ObjectId(upsertedId));

  await seedRole('SUPER_ADMIN', 'Role for Super Admin', adminPermissionsIds);
  await seedRole('USER', 'Role for User', userPermissionsIds);
}

async function seedRole(type, description, permissions) {
  await ROLES.findOneAndUpdate({ type }, { $set: { type, description, permissions } }, { upsert: true, new: true });
}

async function seedAdmin(adminPermissions) {
  const adminPermissionsCan = adminPermissions.map(({ can }) => can);

  await ADMIN.findOneAndUpdate(
    { email: 'admin@aiva.com' },
    {
      $set: {
        name: 'Admin',
        email: 'admin@aiva.com',
        password: helper.hashPassword('1@2.comM'),
        role: 'SUPER_ADMIN',
        permissions: adminPermissionsCan,
      },
    },
    { upsert: true },
  );
}

export default async function seedPRU() {
  try {
    const { adminPermissions, userPermissions } = await seedPermissions();
    await seedRoles(adminPermissions, userPermissions);
    await seedAdmin(adminPermissions);
  } catch (error) {
    console.error('Error seeding PRU:', error);
  }
}
