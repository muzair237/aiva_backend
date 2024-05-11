import { ADMIN, ADMIN_JWT, PERMISSIONS, ROLES } from '../models/index.js';
import helper from '../utils/helper.js';
import mongoose from 'mongoose';

export default {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials!' });
    }
    let admin = await ADMIN.findOne({ email });
    if (!admin || !helper.comparePassword(password, admin?.password)) {
      return res.status(404).json({ success: false, message: 'Incorrect Email or Password!' });
    }

    admin = admin.toObject();
    delete admin.password;

    const token = helper.generateJWTToken({ id: admin?._id, email });
    const { iat, exp } = helper.decryptToken(token);
    await ADMIN_JWT.findOneAndUpdate(
      {
        user_id: admin?._id,
      },
      {
        user_id: admin?._id,
        token,
        iat,
        exp,
      },
      {
        upsert: true,
      },
    );
    return res.status(200).json({
      success: true,
      message: 'Logged In Successfully!',
      token,
      admin,
    });
  },

  logout: async (req, res) => {
    const admin = req.admin;
    await ADMIN_JWT.findOneAndDelete({ user_id: admin?._id });
    return res.status(200).json({ success: true, message: 'Logged Out Successfully!' });
  },

  createAdmin: async (req, res) => {
    const admin = req.body;

    const isAdmin = await ADMIN.findOne({ email: admin?.email });
    if (isAdmin) {
      return res.status(400)({
        success: false,
        message: 'Email you provided is already in use',
      });
    }

    const roles = await ROLES.find({
      _id: { $in: admin?.roles.map(i => new mongoose.Types.ObjectId(i)) },
    });

    let permissions_find_array = roles.map(r => r.permissions.flat()).flat();
    permissions_find_array = permissions_find_array.map(permission => new mongoose.Types.ObjectId(permission));

    const permissions = await PERMISSIONS.find({
      _id: { $in: permissions_find_array },
    });
    admin.permissions = permissions.map(i => i.can);

    const new_admin_request = admin;
    new_admin_request.password = helper.hashPassword(new_admin_request.password);
    const newAdmin = await ADMIN.create(new_admin_request);

    return res.status(200).json({
      message: 'Admin Created Sucessfully!',
      success: true,
      data: newAdmin,
    });
  },

  updateAdmin: async (req, res, next) => {
    const { id } = req.params;

    const { email, roles } = req.body;

    const adminEmail = await ADMIN.findOne({ email });
    if (adminEmail && adminEmail._id.toString() !== id) {
      return res.status(400).json({ success: false, message: 'Email you Provided is Already in Use!' });
    }

    const payload = req.body;
    const counter = await ADMIN.findOne({ _id: id });

    if (counter) {
      const admin = {};
      Object.keys(payload).forEach(element => {
        if (element === 'password') {
          payload[element] = helper.hashPassword(payload[element]);
        }
        admin[element] = payload[element];
      });

      if (roles) {
        const newRoles = await ROLES.find({
          _id: { $in: roles.map(i => new mongoose.Types.ObjectId(i)) },
        });

        let permissions_find_array = newRoles.map(r => r.permissions.flat()).flat();
        permissions_find_array = permissions_find_array.map(permission => new mongoose.Types.ObjectId(permission));

        const permissions = await PERMISSIONS.find({
          _id: { $in: permissions_find_array },
        });
        admin.permissions = permissions.map(i => i.can);
      }

      await ADMIN.findOneAndUpdate({ _id: id }, { $set: { ...admin } });
    }

    return res.status(200).json({ success: true, message: 'Admin updated' });
  },

  getAllAdmins: async (req, res) => {
    const { page, itemsPerPage, startDate, endDate, searchText, sort, type } = {
      ...req.query,
      ...helper.filterQuery(req),
    };
    const query = {};

    if (type) {
      query.roles = type;
    }

    if (searchText) {
      query.$or = [{ name: { $regex: searchText, $options: 'i' } }, { email: { $regex: searchText, $options: 'i' } }];
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lt: end };
    }

    const count = await ADMIN.countDocuments(query);

    const sorting = helper.getSorting(sort, 'name');

    const admins = await ADMIN.find(query)
      .populate({ path: 'roles', model: ROLES, select: 'type' })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort(sorting);

    return res.status(200).json({
      message: 'Admins fetched successfully',
      success: true,
      ...helper.pagination(admins, page, count, itemsPerPage),
    });
  },

  getUniqueRoles: async (req, res) => {
    const uniqueRoles = await ROLES.find({}).select('type');
    return res.status(200).json({ success: true, uniqueRoles });
  },

  deleteAdmin: async (req, res) => {
    const { id } = req.params;

    const admin = await ADMIN.findById(id);

    if (!admin) return res.status(404).json({ success: false, message: 'Admin Not Found!' });

    await ADMIN.deleteOne({
      _id: id,
    });

    return res.status(200).json({ success: true, message: 'Admin Deleted Successfully!' });
  },
};
