import natural from 'natural';
import { QnA, MESSAGE } from '../models/index.js';

export default {
  askQuery: async (req, res) => {
    const user = req.user.toObject();
    const { query } = req.body;
    if (!query) {
      return res.status(401).json({ success: false, message: 'Please enter any query' });
    }

    await MESSAGE.create({
      message: query,
      userId: user._id,
      sender: user?.first_name,
    });

    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(query);
    const qna = await QnA.find({ keywords: { $in: tokens } });

    await MESSAGE.create({
      message: qna[0].answer,
      userId: user._id,
      sender: 'Virtual Assistant',
    });

    if (!qna || qna.length === 0) {
      return res.status(404).json({ success: false, message: 'Could not find any answer' });
    } else {
      return res.status(200).json({ success: true, answer: qna[0].answer });
    }
  },

  getChat: async (req, res) => {
    const { id } = req.params;

    const chat = await MESSAGE.find({ userId: id }).sort({ createdAt: 1 });

    const transformedMessages = chat.map((msg, index) => ({
      id: index + 1,
      roomId: index + 1,
      createdAt: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), // Format the time
      message: msg.message,
      sender: msg.sender,
    }));

    return res.status(200).json({ success: true, chat: transformedMessages });
  },
};
