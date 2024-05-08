import natural from 'natural';
import { QnA } from '../models/index.js';

export default {
  askQuery: async (req, res) => {
    const { query } = req.body;

    if (!query) {
      return res.status(401).json({ success: false, message: 'Please Enter any Query!' });
    }

    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(query);
    const matchingQuestions = await QnA.find({ keywords: { $in: tokens } });

    return res.status(200).json({ success: true, tokens, matchingQuestions });
  },
};
