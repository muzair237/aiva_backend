import { ADMIN, ADMIN_JWT } from '../models/index.js';
import helper from '../utils/helper.js';

export default {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials!' });
    }
    let user = await ADMIN.findOne({ email });
    if (!user || !helper.comparePassword(password, user?.password)) {
      return res.status(404).json({ success: false, message: 'Incorrect Email or Password!' });
    }

    user = user.toObject();
    delete user.password;

    const token = helper.generateJWTToken({ id: user?._id, email });
    const { currentDateTime, oneHourAfterDateTime } = helper.getJWTExpirationTime();
    await ADMIN_JWT.findOneAndUpdate(
      {
        user_id: user?._id,
      },
      {
        user_id: user?._id,
        token,
        iat: currentDateTime,
        exp: oneHourAfterDateTime,
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
    await ADMIN_JWT.findOneAndDelete({ user_id: user?._id });
    return res.status(200).json({ success: true, message: 'Logged Out Successfully!' });
  },
};
