import natural from 'natural';
let tokenizer = new natural.WordTokenizer();

export default {
  query: async (req, res) => {
    const query = req.body;
    if (!query) {
      return res.status(401).json({ success: false, message: 'please enter any query' });
    }

    if(query) {
      res.send("danish")
      const tokens = tokenizer.tokenize(query)
      try {
    // Query the database for matching keywords
    const keyword = await findKeyword(tokens);

    if (keyword) {
      // If a matching keyword is found, return the corresponding response
      return res.status(200).json({ success: true, message: keyword });
    } else {
      // If no matching keyword is found, return a default response
      return res.status(200).json({ success: true, message: 'Sorry, I couldn\'t understand your query' });
    }
  } catch (error) {
    // Handle any errors that occur during database query
    console.error('Error querying database:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
        console.log(tokenizer.tokenize("what is my university name"));
    }
  }
   
  }
