import { PERMISSIONS, ROLES } from '../models/index.js';
import helper from '../utils/helper.js';

export default {
  createPermission: async (req, res) => {
    const { route, description, can, parent, group } = req.body;

    if (!can || !route || !description || !parent || !group) {
      return res.status(400).json({
        message: 'Invalid Information!',
        success: false,
      });
    }
    if (await PERMISSIONS.findOne({ can })) {
      return res.status(400).json({
        message: `A Permission with the 'Can', '${can}' already exists `,
        success: false,
      });
    }
    const permission = await PERMISSIONS.create({
      route,
      description,
      can: can.toLowerCase(),
      parent,
      group,
    });

    return res.status(200).json({
      message: 'Permission Created Successfully',
      success: true,
      permission,
    });
  },

  getAllPermissions: async (req, res) => {
    const { page, itemsPerPage, getAll, startDate, endDate, searchText, sort, type } = {
      ...req.query,
      ...helper.filterQuery(req),
    };
    const query = {};

    if (type) {
      query.group = type;
    }

    if (searchText) {
      query.$or = [
        { can: { $regex: searchText, $options: 'i' } },
        { route: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sorting = helper.getSorting(sort, 'can');

    const count = await PERMISSIONS.countDocuments(query);

    let finalQuery = PERMISSIONS.find();

    if (Object.keys(query).length > 0) {
      finalQuery = finalQuery.where(query);
    }

    if (getAll === 'true') {
      finalQuery = finalQuery.skip(0).limit(count);
    } else {
      finalQuery = finalQuery.skip((page - 1) * itemsPerPage).limit(itemsPerPage);
    }

    const permissions = await finalQuery.sort(sorting);

    return res.status(200).json({
      success: true,
      message: 'Permissions fetched successfully',
      ...helper.pagination(permissions, page, count, itemsPerPage),
    });
  },

  getUniqueParents: async (req, res) => {
    const query = { $and: [{ parent: { $eq: '$' } }] };
    const parentPermissions = await PERMISSIONS.find(query);
    return res.status(200).json({
      success: true,
      message: 'Parent Permissions fetched successfully',
      parentPermissions,
    });
  },

  updatePermission: async (req, res, next) => {
    const { id } = req.params;
    const { route, description, can, parent } = req.body;
    if (!can || !route || !description || !parent) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data!',
      });
    }
    const isPresent = await PERMISSIONS.findOne({ can });
    if (isPresent && isPresent?._id?.toString() !== id) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate can not allowed',
      });
    }
    await PERMISSIONS.findByIdAndUpdate(id, {
      $set: { route, description, can, parent },
    });
    return res.status(200).json({
      success: true,
      message: 'Permission Updated Successfully',
    });
  },

  deletePermission: async (req, res) => {
    const { id } = req.params;
    const deletedPermission = await PERMISSIONS.findByIdAndDelete(id);
    await ROLES.updateMany(
      {
        permissions: { $in: [id] },
      },
      { $pull: { permissions: id } },
    );
    return res.status(200).json({
      success: true,
      message: 'Permission deleted successfully',
      deletedPermission,
    });
  },
};
