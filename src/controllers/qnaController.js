import { QnA } from '../models/index.js';
import defaultQnA from '../utils/default/q&a.json' assert { type: 'json' };

export default {
  restoreQnA: async (req, res) => {
    await QnA.insertMany(defaultQnA);
    return res.status(201).json({ success: true, message: "'Questions and Answers Restored Successfully!'" });
  },
};
