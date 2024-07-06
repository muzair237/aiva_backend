import { USER, USER_JWT, ROLES, PERMISSIONS } from '../models/index.js';
import { validateSignUpPayload } from '../utils/payloadValidation.js';
import helper from '../utils/helper.js';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../utils/cloudinaryConfig.js';

cloudinary.config(cloudinaryConfig);

export default {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials!' });
    }
    let user = await USER.findOne({ email }).populate({ path: 'role', model: ROLES, select: 'type' });
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

    const role = await ROLES.findOne({ type: 'USER' });

    const permissions = await PERMISSIONS.find({ _id: { $in: role?.permissions } });
    const permissionsIds = permissions.map(({ can }) => can);

    let newUser = await USER.create({
      ...user,
      role: role?._id,
      password: hashedPassword,
      permissions: permissionsIds,
    });
    newUser = newUser.toObject();
    delete newUser.password;

    const token = helper.generateJWTToken({ id: newUser?._id, email: newUser?.email });
    const { iat, exp } = helper.decryptToken(token);
    await USER_JWT.findOneAndUpdate(
      {
        user_id: newUser?._id,
      },
      {
        user_id: newUser?._id,
        token,
        iat,
        exp,
      },
      {
        upsert: true,
      },
    );

    return res.status(201).json({ success: true, message: 'Signed Up Successfully!', user: newUser, token });
  },

  getAllUsers: async (req, res) => {
    const { page, itemsPerPage, startDate, endDate, getAll, searchText, sort } = {
      ...req.query,
      ...helper.filterQuery(req),
    };

    const query = {};

    if (searchText) {
      query.$or = [
        { first_name: { $regex: searchText, $options: 'i' } },
        { last_name: { $regex: searchText, $options: 'i' } },
        {
          $expr: {
            $regexMatch: { input: { $concat: ['$first_name', ' ', '$last_name'] }, regex: new RegExp(searchText, 'i') },
          },
        },
        { email: { $regex: searchText, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lt: end };
    }

    const sortOptions = helper.getSorting(sort, 'first_name');

    const totalUsers = await USER.countDocuments(query).exec();

    let users = [];
    users = await USER.find(query)
      .lean()
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

  sendOTP: async (req, res) => {
    const { email } = req.body;
    const user = await USER.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: 'Invalid User' });
    }

    const otp = helper.generateOTP();
    // eslint-disable-next-line no-mixed-operators
    const otpTimestamp = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = {
      token: otp,
      otpTimestamp,
    };
    await user.save();

    await helper.sendEmail(email, `${user?.first_name} ${user?.last_name}`, otp);
    return res.status(200).json({ success: true, message: 'OTP Sent Successfully to your Email!' });
  },

  verifyOTP: async (req, res) => {
    const { email, otp } = req.body;

    const user = await USER.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid User!' });
    }

    if (user?.otp?.token !== otp || user?.otp?.otpTimestamp < Date.now()) {
      return res.status(401).json({ success: false, message: 'Invalid OTP or OTP has Expired!' });
    }
    res.status(200).json({ success: true, message: 'OTP Verified Successfully!' });
  },

  updatePassword: async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await USER.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid User!' });
    }

    const hashedPassword = helper.hashPassword(newPassword);
    user.password = hashedPassword;
    user.otp.token = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password Updated Successfully!' });
  },

  updateUser: async (req, res, next) => {
    const { id } = req.params;

    const { email } = req.body;

    const userEmail = await USER.findOne({ email });
    if (userEmail && userEmail._id.toString() !== id) {
      return res.status(400).json({ success: false, message: 'Email you Provided is Already in Use!' });
    }

    const payload = req.body;
    const counter = await USER.findOne({ _id: id });

    let updatedUser;

    if (counter) {
      const user = {};
      Object.keys(payload).forEach(element => {
        if (element === 'password') {
          payload[element] = helper.hashPassword(payload[element]);
        }
        user[element] = payload[element];
      });

      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`,
          );
          user.profile_picture = result.secure_url;
        } catch (err) {
          console.error(err);
          return next({ code: 500, success: false, message: 'Error in Uploading Image!' });
        }
      }

      updatedUser = await USER.findOneAndUpdate({ _id: id }, { $set: { ...user } }, { new: true }).lean();
      delete updatedUser.password;
      delete updatedUser.permissions;
      delete updatedUser.otp;
    }

    return res.status(200).json({ success: true, message: 'User Information Updated Successfully', updatedUser });
  },
};
