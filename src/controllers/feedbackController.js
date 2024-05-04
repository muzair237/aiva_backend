import { FEEDBACK } from '../models/index.js';
import helper from '../utils/helper.js';

export default {
  createFeedback: async (req, res) => {
    const feedback = req.body;
    await FEEDBACK.create(feedback);
    return res.status(201).json({ success: true, message: 'Feedback Recieved Successfully!' });
  },

  getAllFeedback: async (req, res) => {
    const { page, itemsPerPage, getAll, searchText, sort } = {
      ...req.query,
      ...helper.filterQuery(req),
    };

    const query = {
      $and: [],
    };
    query.$and.push({
      $or: [{ comment: { $regex: new RegExp(searchText, 'i') } }],
    });

    const sortOptions = helper.getSorting(sort, 'comment');

    const totalFeedbacks = await FEEDBACK.countDocuments(query).exec();

    let feedbacks = [];
    feedbacks = await FEEDBACK.find(query)
      .lean()
      .collation({ locale: 'en', strength: 2 })
      .sort(sortOptions)
      .skip((+page - 1) * +itemsPerPage)
      .limit(+itemsPerPage)
      .exec();

    return res.status(200).json({
      success: true,
      message: 'Feedbacks Retrieved Successfully!',
      ...helper.pagination(feedbacks, +page, totalFeedbacks, +itemsPerPage, getAll),
    });
  },
};
