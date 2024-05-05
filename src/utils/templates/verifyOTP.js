export default function OTPEmailTemp(values) {
  const message = `<!doctype html>
    <html
      lang="en"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:v="urn:schemas-microsoft-com:vml"
    >
  <head>
    <title>Welcome to AIVA</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>Document</title>
  </head>
  <body>
    <table
      class="body-wrap"
      style="
        font-family: Arial, sans-serif;
        box-sizing: border-box;
        font-size: 14px;
        width: 100%;
        background-color: transparent;
        margin: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      ">
      <tbody>
        <tr style="font-family: Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0">
          <td
            style="
              font-family: Arial, sans-serif;
              box-sizing: border-box;
              font-size: 14px;
              vertical-align: top;
              margin: 0;
            "
            valign="top"></td>
          <td
            class="container"
            width="600"
            style="
              font-family: Arial, sans-serif;
              box-sizing: border-box;
              font-size: 14px;
              vertical-align: top;
              display: block;
              max-width: 600px;
              clear: both;
              margin: 0 auto;
            "
            valign="top">
            <div
              class="content"
              style="
                font-family: Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
                max-width: 600px;
                display: block;
                margin: 0 auto;
                padding: 20px;
              ">
              <table
                class="main"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                itemprop="action"
                itemscope
                itemtype="http://schema.org/ConfirmAction"
                style="
                  font-family: Arial, sans-serif;
                  box-sizing: border-box;
                  font-size: 14px;
                  border-radius: 3px;
                  margin: 0;
                  border: none;
                ">
                <tbody>
                  <tr style="font-family: Arial, sans-serif; font-size: 14px; margin: 0">
                    <td
                      class="content-wrap"
                      style="
                        font-family: Arial, sans-serif;
                        box-sizing: border-box;
                        color: #495057;
                        font-size: 14px;
                        vertical-align: top;
                        margin: 0;
                        padding: 30px;
                        box-shadow: 0 3px 15px rgba(30, 32, 37, 0.06);
                        border-radius: 7px;
                        background-color: #fff;
                      "
                      valign="top">
                      <meta
                        itemprop="name"
                        content="Confirm Email"
                        style="font-family: Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0" />
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="font-family: Arial sansSerif; box-sizing: border-box; font-size: 14px; margin: 0">
                        <tbody>
                          <tr
                            style="font-family: Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0">
                            <td
                              class="content-block"
                              style="
                                font-family: Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top">
                              <div style="margin-bottom: 15px">
                              <h4>[Logo]</h4>
                                <!-- <img src="{logo_dark}" alt="" height="23" /> -->
                              </div>
                            </td>
                          </tr>
                          <tr
                            style="font-family: Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0">
                            <td
                              class="content-block"
                              style="
                                font-family: Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 20px;
                                line-height: 1.5;
                                font-weight: 500;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 10px;
                              "
                              valign="top">
                              Hey, ${values?.name}
                            </td>
                          </tr>
                          <tr
                            style="font-family: Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0">
                            <td
                              class="content-block"
                              style="
                                font-family: Arial, sans-serif;
                                color: #878a99;
                                box-sizing: border-box;
                                line-height: 1.5;
                                font-size: 15px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 10px;
                              "
                              valign="top">
                              Your One-Time Password (OTP) for your account is: <strong>${values?.otp}</strong>.
                            </td>
                          </tr>
                          <tr
                            style="font-family: Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0">
                            <td
                              class="content-block"
                              style="
                                font-family: Arial, sans-serif;
                                color: #878a99;
                                box-sizing: border-box;
                                line-height: 1.5;
                                font-size: 15px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 24px;
                              "
                              valign="top">
                              Please use this OTP to proceed with your authentication process. If you didn't request this OTP, please ignore this email.
                            </td>
                          </tr>

                          <tr
                            style="
                              font-family: Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                              border-top: 1px solid #e9ebec;
                            ">
                            <td
                              class="content-block"
                              style="
                                font-family: Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0;
                                padding-top: 15px;
                              "
                              valign="top">
                              <div style="display: flex; align-items: center">
                                <div style="margin-left: 8px">
                                  <span style="font-weight: 600"> Best Regards </span>
                                  <p style="font-size: 13px; margin-bottom: 0px; margin-top: 3px; color: #878a99">
                                    The Team
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
  return message;
}
