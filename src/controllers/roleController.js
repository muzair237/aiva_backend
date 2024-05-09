import { PERMISSIONS, ROLES, ADMIN } from '../models/index.js';
import helper from '../utils/helper.js';

export default {
  createRole: async (req, res) => {
    const { type, description, permissions } = req.body;

    const isPresent = await ROLES.findOne({ type });

    if (isPresent) {
      return res.status(409).json({
        code: 409,
        message: 'Role exists with this same type',
        success: false,
      });
    }

    if (!type || !description || !permissions) {
      return res.status(400).json({
        code: 400,
        message: 'Data is invalid',
        success: false,
      });
    }

    let newPermissions = await PERMISSIONS.find({
      can: { $in: permissions },
    }).select('_id');

    newPermissions = [...new Set(newPermissions.map(e => e._id).flat())];

    await ROLES.create({
      type,
      description,
      permissions: newPermissions,
    });

    return res.status(200).json({
      message: 'Role Created Successfully',
      success: true,
      data: newPermissions,
    });
  },

  getAllRoles: async (req, res, next) => {
    const { page, itemsPerPage, startDate, endDate, searchText, sort } = {
      ...req.query,
      ...helper.filterQuery(req),
    };
    const query = {};

    if (searchText) {
      query.$or = [
        { type: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lt: end };
    }

    const count = await ROLES.countDocuments(query);

    const sorting = helper.getSorting(sort, 'type');

    const roles = await ROLES.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort(sorting);

    return res.status(200).json({
      message: 'Roles fetched successfully',
      success: true,
      ...helper.pagination(roles, page, count, itemsPerPage),
    });
  },

  updateRole: async (req, res) => {
    const { id } = req.params;

    const adminWithThisRole = await ADMIN.find({ roles: { $in: id } }).select('_id');

    const { type, description, permissions } = req.body;

    const isPresent = await ROLES.findOne({ type });

    if (isPresent && isPresent._id.toString() !== id) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate type not allowed',
      });
    }

    if (!type && !description && !permissions) {
      res.status(400).json({
        success: false,
        mmessage: 'Data is invalid',
      });
    }
    let newPermissions = await PERMISSIONS.find({
      can: { $in: permissions },
    });
    const permissionToAddInAdmin = newPermissions.map(e => e.can);

    newPermissions = newPermissions.map(e => e._id).flat();

    adminWithThisRole.forEach(async _ => {
      await ADMIN.findByIdAndUpdate(_, { $set: { permissions: permissionToAddInAdmin } });
    });

    await ROLES.findByIdAndUpdate(id, {
      type,
      description,
      permissions: newPermissions,
    });

    return res.status(200).json({
      success: true,
      message: 'Role updated Successfully',
    });
  },

  deleteRole: async (req, res) => {
    const { id } = req.params;

    const role = await ROLES.findByIdAndDelete(id);

    if (!role) {
      return res.status(409).json({
        success: true,
        message: 'Role not found!',
      });
    }

    await ADMIN.updateMany({ roles: id }, { $pull: { roles: id } });

    return res.status(200).json({
      success: true,
      message: 'Role deleted Successfully',
    });
  },

  getPermissions: async (req, res) => {
    const permissions = await PERMISSIONS.find();
    return res.status(200).json({
      success: true,
      message: 'Permissions fetched successfully',
      permissions,
    });
  },
};
