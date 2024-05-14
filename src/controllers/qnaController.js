import { QnA } from '../models/index.js';
import defaultQnA from '../utils/default/q&a.json' assert { type: 'json' };
import helper from '../utils/helper.js';

export default {
  restoreQnA: async (req, res) => {
    await QnA.insertMany(defaultQnA);
    return res.status(201).json({ success: true, message: "'Questions and Answers Restored Successfully!'" });
  },

  getAllQuestions: async (req, res) => {
    const { page, itemsPerPage, startDate, endDate, searchText, sort, type } = {
      ...req.query,
      ...helper.filterQuery(req),
    };
    const query = {};

    if (type) {
      query.roles = type;
    }

    if (searchText) {
      query.$or = [
        { question: { $regex: searchText, $options: 'i' } },
        { answer: { $regex: searchText, $options: 'i' } },
        { keywords: { $in: [new RegExp(searchText, 'i')] } },

      ];
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lt: end };
    }

    const count = await QnA.countDocuments(query);

    const sorting = helper.getSorting(sort, 'question');

    const admins = await QnA.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort(sorting);

    return res.status(200).json({
      message: 'Questions fetched successfully',
      success: true,
      ...helper.pagination(admins, page, count, itemsPerPage),
    });
  },
};
