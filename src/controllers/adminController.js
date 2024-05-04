import { ADMIN, ADMIN_JWT } from '../models/index.js';
import helper from '../utils/helper.js';

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
};
