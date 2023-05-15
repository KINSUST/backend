const nodemailer = require("nodemailer");
const customError = require("./customError");

const sendMail = async (to, code) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: { 
        user: "kinsustweb03@gmail.com",
        pass: "nazvhkwsijduxhai",
      },
    });

    await transport.sendMail({
      from: `KIN A Voluntary Organization <${"kinsustweb03@gmail.com"}> `,
      to: to,
      subject: "Password Change",
      html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SMS</title>
  </head>
  <body style="background-color: #f4f3f3">
    <div
      style="
    width: fit-content;
    margin: auto;
    margin-top: 30px;
      "
    >
      <div
        class="main-container"
        style="
          width: 400px;
          height: 190px;
          background-color: #e7ebea;
          padding: 15px;
          border-radius: 5px;
        "
      >
        <div class="mail-header">
          <img
            src="https://kinsust.org/wp-content/uploads/2021/05/kin-logo-01.png"
            alt=""
            style="width: 100px"
          />
          <hr
            style="
              color: gray;
              background-color: #cfcbcb;
              height: 1px;
              border: none;
              margin: 0px;
              padding: 0;
            "
          />
        </div>
        <div class="mail-body" style="font-size: 20px">
          <p
            style="
              margin: 0;
              padding: 8px 4px;
              font-weight: 600;
              text-align: center;
            "
          >
            Welcome to KIN
          </p>
          <p style="margin: 0; padding: 4px">
            Verification Code :
            <span
              style="
                padding: 8px 12px;
                border: 1px solid #a2cae2;
                border-radius: 4px;
                background-color: #a2cae2;
                font-weight: 700;
                letter-spacing: 6px;
              "
              >${code}</span
            >
          </p>
          <p style="text-align: center"></p>
          <p style="margin: 0; padding: 4px">The Code expired in 10 minutes.</p>
        </div>
      </div>
    </div>
  </body>
</html>





  
  `,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
