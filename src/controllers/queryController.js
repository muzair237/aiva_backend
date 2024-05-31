import natural from 'natural';
import { QnA } from '../models/index.js';

export default {
  askQuery: async (req, res) => {
    const stopWords = ['is', 'a', 'out', 'are', 'am', 'of', 'in'];

    // function removeStopWords(query) {
    //     // Define stop words (you can customize this array as needed)
    //     // Tokenize the query

    //     // Remove stop words from tokens

    //     // Return the processed tokens as a string
    //     return tokens.join(' ');
    // }

    // Example usage:
    let { query } = req.body;
    // Convert query to lowercase
    query = query.toLowerCase();
    //  return res.send(query);
    if (!query) {
      return res.status(401).json({ success: false, message: 'Please enter any query' });
    }
    const tokenizer = new natural.WordTokenizer();
    let tokens = tokenizer.tokenize(query);
    tokens = tokens.filter(token => !stopWords.includes(token));
    // const sanitizedQuery = removeStopWords(quetokensry);

    // return res.send(sanitizedQuery)
    // Find documents that contain any of the words in the tokens array
    let qna = await QnA.find({ keywords: { $in: tokens } });
    // return res.send(qna);
    if (!qna || qna.length === 0) {
      return res.status(404).json({ success: false, message: 'Could not find any answer' });
    } else {
      let maxMatchCount = 0;
      let bestMatchIndex = -1;

      // Iterate over the matched questions and find the one with the maximum matching keywords
      for (let i = 0; i < qna.length; i++) {
        const keywords = qna[i].keywords;
        let matchCount = 0;

        // Count the number of matched keywords for the current question
        for (let j = 0; j < keywords.length; j++) {
          if (tokens.includes(keywords[j])) {
            matchCount++;
          }
        }

        // Update the best match if the current question has more matches
        if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount;
          bestMatchIndex = i;
        }
      }

      // If there was at least one match, return the answer of the question with the maximum matching keywords
      if (bestMatchIndex !== -1) {
        return res.status(200).json({ success: true, answer: qna[bestMatchIndex].answer });
      } else {
        return res.status(404).json({ success: false, message: 'Could not find any answer' });
      }
    }
  },
};
