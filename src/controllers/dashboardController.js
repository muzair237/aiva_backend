import { USER, QnA, FEEDBACK, MESSAGE } from '../models/index.js';
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

    const messageQuery = { ...query, sender: { $ne: 'Virtual Assistant' } };
    const numOfQueriesAsked = await MESSAGE.countDocuments(messageQuery);

    const numOfFeedbacks = await FEEDBACK.countDocuments(query);

    const analytics = [
      { label: 'No. of Registered Users', value: numOfUsers, icon: 'ri-user-line' },
      {
        label: 'No. of Stored Questions',
        value: numOfStoredQuestions,
        icon: 'ri-questionnaire-line',
      },
      {
        label: 'No. of Queries Asked',
        value: numOfQueriesAsked,
        icon: 'ri-question-answer-line',
      },
      {
        label: 'No. of Feedbacks Received',
        value: numOfFeedbacks,
        icon: 'ri-feedback-line',
      },
    ];

    return res.status(200).json({
      success: true,
      message: 'Dashboard Cards Retrieved Successfully!',
      analytics,
    });
  },

  getRecentQueries: async (req, res) => {
    const { page, itemsPerPage } = {
      ...req.query,
      ...helper.filterQuery(req),
    };
    const query = { sender: { $ne: 'Virtual Assistant' } };

    const count = await MESSAGE.countDocuments(query);

    const recentQueries = await MESSAGE.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return res.status(200).json({
      message: 'Recent Queries Retrieveed Successfully!',
      success: true,
      ...helper.pagination(recentQueries, page, count, itemsPerPage),
    });
  },

  getTodayQueryCount: async (req, res) => {
    const todayQueryCount = await MESSAGE.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) },
      sender: { $ne: 'Virtual Assistant' },
    });

    return res
      .status(200)
      .json({ success: true, message: 'Today Query COunt Retrieved Successfully!', todayQueryCount });
  },

  getAgeGroups: async (req, res) => {
    const currentDate = new Date();
    const ageGroupData = await USER.aggregate([
      {
        $addFields: {
          age: {
            $floor: {
              $divide: [{ $subtract: [currentDate, '$DOB'] }, 1000 * 60 * 60 * 24 * 365.25],
            },
          },
        },
      },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 19, 26, 36, 51, 100],
          default: '51+',
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          _id: 0,
          ageGroup: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 19] }, then: '0-18' },
                { case: { $lt: ['$age', 26] }, then: '19-25' },
                { case: { $lt: ['$age', 36] }, then: '26-35' },
                { case: { $lt: ['$age', 51] }, then: '36-50' },
              ],
              default: '51+',
            },
          },
          count: 1,
        },
      },
    ]);

    // Initialize all age groups with zero count
    const ageGroups = {
      '0-18': 0,
      '19-25': 0,
      '26-35': 0,
      '36-50': 0,
      '51+': 0,
    };

    // Update the age groups with the actual counts from the database
    ageGroupData.forEach(group => {
      ageGroups[group.ageGroup] = group.count;
    });

    // Format the data for the pie chart
    const formattedData = Object.keys(ageGroups).map(ageGroup => ({
      name: ageGroup,
      value: ageGroups[ageGroup],
    }));

    return res.status(200).json({
      success: true,
      message: 'Age Group Distribution Retrieved Successfully!',
      data: formattedData,
    });
  },
};
