import { USER, FEEDBACK } from '../models/index.js';
import helper from '../utils/helper.js';

export default {
  createFeedback: async (req, res) => {
    const feedback = req.body;
    if (!feedback?.user_id || !feedback?.feedback) {
      return res.status(422).json({ success: false, message: 'Invalid Data!' });
    }
    await FEEDBACK.create(feedback);
    return res.status(201).json({ success: true, message: 'Feedback Recieved Successfully!' });
  },

  getAllFeedback: async (req, res) => {
    const { page, itemsPerPage, startDate, endDate, getAll, searchText, sort } = {
      ...req.query,
      ...helper.filterQuery(req),
    };

    const query = {};

    if (searchText) {
      query.$or = [
        { feedback: { $regex: searchText, $options: 'i' } },
        {
          user_id: {
            $in: (await helper.filterUsers(searchText)) ?? [],
          },
        },
      ];
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lt: end };
    }
    const sortOptions = helper.getSorting(sort, 'user_id.first_name');

    const totalFeedbacks = await FEEDBACK.countDocuments(query).exec();

    let feedbacks = [];
    feedbacks = await FEEDBACK.find(query)
      .populate({ path: 'user_id', model: USER, select: 'first_name last_name email' })
      .lean()
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
