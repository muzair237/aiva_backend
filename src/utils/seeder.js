import mongoose from 'mongoose';
import { PERMISSIONS, ROLES, ADMIN } from '../models/index.js';
import helper from '../utils/helper.js';
import defaultPermissions from '../utils/default/defaultPermissions.json' assert { type: 'json' };

export default async function seedPRU() {
  console.log('Seeding Permissions...');
  for (const permission of defaultPermissions) {
    await PERMISSIONS.updateOne({ can: permission.can }, { $set: permission }, { upsert: true });
  }
  console.log('Permissions Seeded Successfully!');

  console.log('Seeding Role...');
  const permissions = await PERMISSIONS.find({});
  const permissionsIds = permissions.map(({ id }) => mongoose.Types.ObjectId.createFromHexString(id));
  await ROLES.updateOne(
    { type: 'SUPER_ADMIN' },
    { $set: { type: 'SUPER_ADMIN', description: 'Role for Super Admin', permissions: permissionsIds } },
    { upsert: true },
  );
  console.log('Role Seeded Successfully!');

  console.log('Seeding User...');
  const permissionsCan = permissions.map(({ can }) => can);
  await ADMIN.updateOne(
    { email: 'admin@aiva.com' },
    {
      $set: {
        name: 'Admin',
        email: 'admin@aiva.com',
        password: helper.hashPassword('1@2.comM'),
        role: 'SUPER_ADMIN',
        permissions: permissionsCan,
      },
    },
    { upsert: true },
  );
  console.log('Admin Seeded Successfully!');
}
