import natural from 'natural';
import { QnA } from '../models/index.js';

export default {
  askQuery: async (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(401).json({ success: false, message: 'Please enter any query' });
    }

    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(query);
    const qna = await QnA.find({ keywords: { $in: tokens } });
    if (!qna || qna.length === 0) {
      return res.status(404).json({ success: false, message: 'Could not find any answer' });
    } else {
      return res.status(200).json({ success: true, answer: qna[0].answer });
    }
  },
};
