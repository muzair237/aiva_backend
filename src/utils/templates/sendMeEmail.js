const createMessage = contact => {
  const { name, email, message } = contact;

  const subject = `New Message from ${name}`;

  const textContent = `
Dear Muhammad Uzair,

You have received a new message. Below are the details of the sender:

Name: ${name}
Email: ${email}

Message:
${message}

Thank you for your attention.

Best regards,
The Team`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message Notification</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      color: #333;
    }
    .container {
      width: 100%;
      max-width: 650px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #4A90E2;
      font-size: 26px;
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 10px;
    }
    .details {
      margin: 20px 0;
      padding: 20px;
      background-color: #f9f9f9;
      border-left: 4px solid #4A90E2;
      border-radius: 5px;
    }
    .details p {
      margin: 5px 0;
    }
    .details strong {
      color: #333;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      color: #999;
    }
    .footer a {
      color: #4A90E2;
      text-decoration: none;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background-color: #4A90E2;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #357ABD;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>New Message from ${name}</h1>
    <p>You have received a new message. Below are the details of the sender:</p>

    <div class="details">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br />${message}</p>
    </div>

    <p>If you need to take any action, feel free to respond to the sender directly.</p>
    <p>Regards</p>
    <p>Muhammad Uzair</p>
  </div>
</body>
</html>`;

  return { subject, textContent, htmlContent };
};

export default createMessage;
