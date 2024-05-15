import { USER, QnA } from '../models/index.js';
import helper from '../utils/helper.js';

export default {
  getDashboardCards: async (req, res) => {
    const { startDate, endDate } = {
      ...req.query,
      ...helper.filterQuery(req),
    };

    const query = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lt: end };
    }

    const numOfUsers = await USER.countDocuments(query);
    const numOfStoredQuestions = await QnA.countDocuments(query);
    const numOfAdmins = await USER.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Dashboard Cards Retrieved Successfully!',
      analytics: { numOfUsers, numOfStoredQuestions, numOfAdmins },
    });
  },
};
