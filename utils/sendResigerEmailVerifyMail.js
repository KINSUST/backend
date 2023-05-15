const nodemailer = require("nodemailer");
const customError = require("./customError");

const sendRegisterEmailVerifyEmail = async (to, code) => {
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
    <title>RESET PASSWORD</title>
  </head>
  <body>
    <main
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #fff;
        padding: 6px; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      "
    >
      <div style="margin: auto; width: fit-content">
        <div style="max-width: 500px">
          <figure style="margin: auto; text-align: center">
            <img
              src="https://password-reset-email.netlify.app/KIN%20Logo%20black-01.png"
              alt=""
              style="width: 140px"
            />
          </figure>
          <p
            style="
              text-align: center;
              font-size: 24px;
              margin: 0px;
              padding-bottom: 12px;
            "
          >
            Create a account in KIN
          </p>
        </div>
        <div
          class="main-container"
          style="
            max-width: 500px;
            background-color: #fff;
            border: 1px solid rgb(186, 185, 185);
            padding: 15px;
            border-radius: 5px;
          "
        >
          <div class="mail-header"></div>
          <div class="mail-body" style="font-size: 18px">
            <p
              style="
                text-align: center;
                margin: 0px;
                padding-bottom: 8px;
                font-size: 20xp;
                font-weight: 600;
              "
            >
              KIN register email verify
            </p>
            <p
              style="
                margin: 0;
                padding: 4px;
                text-align: justify;
                font-size: 15px;
              "
            >
              We received a request to create a account.To verify your email
              address, please use the following verification code:
            </p>

            <p style="text-align: center">
              <span
                style="
                  margin: 0px;
                  font-size: 25px;
                  font-weight: 900;
                  letter-spacing: 6px;
                "
                >${code}</span
              >
            </p>
            <p
              style="
                margin: 0;
                padding: 4px;

                font-size: 15px;
              "
            >
              Thanks, <br />
              KIN a voluentary organization, SUST
            </p>
          </div>
        </div>
      </div>
    </main>
  </body>
</html>



  
  `,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendRegisterEmailVerifyEmail;
