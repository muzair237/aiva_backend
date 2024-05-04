import { USER, USER_JWT, ROLES } from '../models/index.js';
import { validateSignUpPayload } from '../utils/payloadValidation.js';
import helper from '../utils/helper.js';

export default {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials!' });
    }
    let user = await USER.findOne({ email });
    if (!user || !helper.comparePassword(password, user?.password)) {
      return res.status(404).json({ success: false, message: 'Incorrect Email or Password!' });
    }

    user = user.toObject();
    delete user.password;

    const token = helper.generateJWTToken({ id: user?._id, email });
    const { iat, exp } = helper.decryptToken(token);
    await USER_JWT.findOneAndUpdate(
      {
        user_id: user?._id,
      },
      {
        user_id: user?._id,
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
      user,
    });
  },

  logout: async (req, res) => {
    const user = req.user;
    await USER_JWT.findOneAndDelete({ user_id: user?._id });
    return res.status(200).json({ success: true, message: 'Logged Out Successfully!' });
  },

  signUp: async (req, res) => {
    const { error } = validateSignUpPayload(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = req.body;

    const isUserExist = await USER.findOne({ email: user?.email });
    if (isUserExist) return res.status(409).json({ success: false, message: 'A User with this Email Already Exists!' });

    const hashedPassword = helper.hashPassword(user?.password);

    const role = await ROLES.findOne({ type: 'USER' }).select('_id');

    await USER.create({
      ...user,
      role,
      password: hashedPassword,
    });

    return res.status(201).json({ success: true, message: 'Signed Up Successfully!' });
  },
  
  getAllUsers: async (req, res) => {
    const { page, itemsPerPage, getAll, searchText, sort } = {
      ...req.query,
      ...helper.filterQuery(req),
    };

    const query = {
      $and: [],
    };
    query.$and.push({
      $or: [
        { first_name: { $regex: new RegExp(searchText, 'i') } },
        { last_name: { $regex: new RegExp(searchText, 'i') } },
        { email: { $regex: new RegExp(searchText, 'i') } },
      ],
    });

    const sortOptions = helper.getSorting(sort, 'first_name');

    const totalUsers = await USER.countDocuments(query).exec();

    let users = [];
    users = await USER.find(query)
      .lean()
      .collation({ locale: 'en', strength: 2 })
      .sort(sortOptions)
      .skip((+page - 1) * +itemsPerPage)
      .limit(+itemsPerPage)
      .exec();

    return res.status(200).json({
      success: true,
      message: 'Users Retrieved Successfully!',
      ...helper.pagination(users, +page, totalUsers, +itemsPerPage, getAll),
    });
  },
};
