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
      timeStamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      sender: user?.first_name,
    });

    const tokenizer = new natural.WordTokenizer();
    let tokens = tokenizer.tokenize(query);
    tokens = removeStopwords(tokens);

    console.log(tokens);

    const qna = await QnA.find({ keywords: { $in: tokens } });
    if (!qna || qna.length === 0) {
      const response = await MESSAGE.create({
        message: 'Could not find any answer',
        userId: user._id,
        timeStamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        sender: 'Virtual Assistant',
      });
      return res.status(200).json({ success: true, response });
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

      let finalAnswer;
      if (bestMatchIndex !== -1) {
        finalAnswer = qna[bestMatchIndex].answer;
      } else {
        finalAnswer = "Couldn't find any answer!";
      }

      const response = await MESSAGE.create({
        message: finalAnswer,
        userId: user._id,
        timeStamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        sender: 'Virtual Assistant',
      });
      return res.status(200).json({ success: true, response });
    }
  },

  getChat: async (req, res) => {
    const { id } = req.params;

    const chat = await MESSAGE.find({ userId: id }).sort({ createdAt: 1 });

    const transformedMessages = chat.map((msg, index) => ({
      id: index + 1,
      roomId: index + 1,
      timeStamp: msg.timeStamp,
      message: msg.message,
      sender: msg.sender,
    }));

    return res.status(200).json({ success: true, chat: transformedMessages });
  },
};
