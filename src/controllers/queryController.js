import natural from 'natural';
import { QnA} from '../models/index.js';

export default {
 askQuery: async (req, res) => {
    let {query} = req.body;
    if (!query) {
        return res.status(401).json({ success: false, message: 'Please enter any query' });
    }

    // Convert query to string if necessary
    // query = query.toString();

    // Tokenize the query
    let tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(query);
//    res.send(tokens)
    // Find documents that contain any of the words in the tokens array
    let qna = await QnA.find({ keywords: { $in: tokens } });
    if (!qna || qna.length === 0) {
        return res.status(404).json({ success: false, message: 'Could not find any answer' });
    } else {
        // Assuming QnA.answer is the field containing the answer in your document
        return res.status(200).json({ success: true, answer: qna[0].answer });
    }
}

  }
