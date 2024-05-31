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
  await ROLES.updateOne(
    { type: 'SUPER_ADMIN' },
    {
      $set: {
        type: 'SUPER_ADMIN',
        description: 'Role for Super Admin',
        permissions: permissions
          .filter(permission => permission.group === 'ADMIN')
          .map(({ _id }) => new mongoose.Types.ObjectId(_id)),
      },
    },
    { upsert: true },
  ),
    await ROLES.updateOne(
      { type: 'USER' },
      {
        $set: {
          type: 'USER',
          description: 'Role for User',
          permissions: permissions
            .filter(permission => permission.group === 'USER')
            .map(({ _id }) => new mongoose.Types.ObjectId(_id)),
        },
      },
      { upsert: true },
    );
  console.log('Role Seeded Successfully!');

  console.log('Seeding Admin...');
  // const permissionsCan = ;
  const roles = await ROLES.find({ type: 'SUPER_ADMIN' });
  await ADMIN.updateOne(
    { email: 'admin@aiva.com' },
    {
      $set: {
        name: 'Admin',
        email: 'admin@aiva.com',
        password: helper.hashPassword('1@2.comM'),
        roles: [roles[0]._id],
        permissions: permissions?.map(({ can }) => can),
      },
    },
    { upsert: true },
  );
  console.log('Admin Seeded Successfully!');
}
