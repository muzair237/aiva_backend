import { QnA, MESSAGE } from '../models/index.js';
import natural from 'natural';
import { removeStopwords } from 'stopword';

export default {
  askQuery: async (req, res) => {
    const user = req.user.toObject();
    let { query } = req.body;

    query = query.toLowerCase();

    if (!query) {
      return res.status(401).json({ success: false, message: 'Please enter any query' });
    }

    await MESSAGE.create({
      message: query,
      userId: user._id,
      sender: user?.first_name,
    });

    const tokenizer = new natural.WordTokenizer();
    let tokens = tokenizer.tokenize(query);
    tokens = removeStopwords(tokens);

    const qna = await QnA.find({ keywords: { $in: tokens } });
    if (!qna || qna.length === 0) {
      return res.status(404).json({ success: false, message: 'Could not find any answer' });
    } else {
      let maxMatchCount = 0;
      let bestMatchIndex = -1;

      for (let i = 0; i < qna.length; i++) {
        const keywords = qna[i].keywords;
        let matchCount = 0;

        for (let j = 0; j < keywords.length; j++) {
          if (tokens.includes(keywords[j])) {
            matchCount++;
          }
        }

        if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount;
          bestMatchIndex = i;
        }
      }

      await MESSAGE.create({
        message: qna[bestMatchIndex].answer,
        userId: user._id,
        sender: 'Virtual Assistant',
      });

      if (bestMatchIndex !== -1) {
        return res.status(200).json({ success: true, answer: qna[bestMatchIndex].answer });
      } else {
        return res.status(404).json({ success: false, message: 'Could not find any answer' });
      }
    }
  },

  getChat: async (req, res) => {
    const { id } = req.params;

    const chat = await MESSAGE.find({ userId: id }).sort({ createdAt: 1 });

    const transformedMessages = chat.map((msg, index) => ({
      id: index + 1,
      roomId: index + 1,
      createdAt: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      message: msg.message,
      sender: msg.sender,
    }));

    return res.status(200).json({ success: true, chat: transformedMessages });
  },
};
