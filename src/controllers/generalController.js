import createPortfolioMessage from '../utils/templates/sendMeEmail.js';
import helper from '../utils/helper.js';

export default {
  sendMeEmail: async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const { subject, textContent, htmlContent } = createPortfolioMessage(req.body);

    await helper.sendMeEmail({
      to: null,
      subject,
      textContent,
      htmlContent,
    });

    res.status(201).json({ success: true, message: 'Email Recieved Successfully!' });
  },
};
