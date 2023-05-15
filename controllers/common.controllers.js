const userModel = require("../models/user.model");
const verifyTokenModel = require("../models/verifyToken.model");
const CreateToken = require("../utils/CreateToken");
const randomCode = require("../utils/randomCode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
const administratorModel = require("../models/administrator.model");

/**
 * @description password recover mail send
 * @method POST
 * @route api/v1/recover
 * @access public
 */
const passwordRecover = async (req, res, next) => {

  // random code generate
  const generateCode = randomCode(4);
  // hash code
  const saltForCode = bcrypt.genSaltSync(10);
  const hashCode = bcrypt.hashSync(generateCode, saltForCode);
  try {
    // email check
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      throw customError(401, "Email not found");
    }
    // delete before data
    const userDelete = await verifyTokenModel.findOneAndDelete({
      email: req.body.email,
    });

    const userData = {
      email: req.body.email,
      code: hashCode,
    };

    /**
     *  details: create token
     * expire: expire in 5s
     */
    const token = CreateToken(userData, "300s");

    const result = await verifyTokenModel.create({
      token,
      code: hashCode,
      email: req.body.email,
    });
    // code send to email
    // sendMail("rejoyanislam0014@gmail.com", generateCode);
    console.log(generateCode);
    const { code, ...temporaryData } = result._doc;

    res
      .cookie("recoverToken", token, {
        expires: new Date(Date.now() + 900000),

        // maxAge: 7*24*60*60*1000,
      })
      .status(200)
      .json({
        status: "success",
        data: temporaryData,
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @description code match with email code
 * @method POST
 * @route api/v1/code-check
 * @access public
 */

const codeCheck = async (req, res, next) => {
  // random code generate
  const generateCode = randomCode(4);

  try {
    // extract token
    const token =
      req.headers?.authorization?.split(" ")[1] || req.cookies.recoverToken;

    // token verify & data extract
    const temToken = jwt?.verify(token, process.env.SECRET_CODE);

    // register token check
    const temData = await verifyTokenModel.findOne({ email: temToken.email });

    //secret code check
    const codeCheck = bcrypt.compareSync(req.body.code, temData.code);

    // if  wrong secret code
    if (!codeCheck) {
      throw customError(401, "Wrong Code");
    }

    const tokenData = {
      email: temToken.email,
    };

    // create token for password change
    const tokenForPasswordChange = CreateToken(tokenData, "1d");

    // password change token create
    const data = await verifyTokenModel.create({
      token: tokenForPasswordChange,
      code: generateCode,
      email: temToken.email,
    });

    //delete temporary token
    if (data) {
      await verifyTokenModel.findOneAndDelete({ email: temToken.email });
    }

    res
      .clearCookie("recoverToken")
      .cookie("codeToken", token, {
        expires: new Date(Date.now() + 900000),

        // maxAge: 7*24*60*60*1000,
      })
      .status(200)
      .json({
        status: "success",
        result: data,
      });
  } catch (error) {
    // if jwt expired show code expired
    if (error.message === "jwt expired") {
      error.message = "Code Expired";
    }
    next(error);
  }
};
/**
 * @description password change
 * @method POST
 * @route api/v1/password-change
 * @access public
 */

const passwordChange = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  try {
    // extract token
    const token =
      req.headers?.authorization?.split(" ")[1] || req.cookies.codeToken;

    // token verify & data extract
    const temToken = jwt?.verify(token, process.env.SECRET_CODE);

    // register token check
    const temData = await verifyTokenModel.findOne({ email: temToken.email });

    //hash password
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    // user create
    const data = await userModel.findOneAndUpdate(
      { email: temData.email },
      {
        $set: {
          password: hashPassword,
        },
      },
      { runValidators: true }
    );

    //delete temporary token
    if (data) {
      await verifyTokenModel.findOneAndDelete({ email: temToken.email });
    }

    res.status(200).json({
      status: "success",
      result: data,
    });
  } catch (error) {
    // if jwt expired show code expired
    if (error.message === "jwt expired") {
      error.message = "Time Failed";
    }
    next(error);
  }
};

/**
 * @description register token
 * @method POST
 * @route api/v1/account/register
 * @access public
 */

const registerToken = async (req, res, next) => {
  // code generate & create hash code
  const generateCode = randomCode(4);
  const salt = bcrypt.genSaltSync(10);
  const saltForCode = bcrypt.genSaltSync(10);
  const hashCode = bcrypt.hashSync(generateCode, saltForCode);
  try {
    //hash password
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    // find register person is user or admin

    let searchByEmail = "";
    if (req.baseUrl === "/api/v1/users") {
      searchByEmail = await userModel.findOne({ email: req.body.email });
    }
    if (req.baseUrl === "/api/v1/admin") {
      searchByEmail = await administratorModel.findOne({
        email: req.body.email,
      });
    }

    if (searchByEmail) {
      throw customError(401, "You have already register!");
    }
    // verify token data delete
    await verifyTokenModel.findOneAndDelete({ email: req.body.email });


    const userData = {
      ...req.body,
      password: hashPassword,
      code: hashCode,
    };
    // create token
    const token = CreateToken(userData, "300s");

    const result = await verifyTokenModel.create({
      token,
      code: hashCode,
      email: req.body.email,
    });
    // sendMail("rejoyanislam0014@gmail.com", generateCode);
    console.log(generateCode);
    const { code, ...temporaryData } = result._doc;

    res
      .cookie("registerToken", token, {
        expires: new Date(Date.now() + 900000), 
      })
      .status(200)
      .json({
        status: "success",
        result: temporaryData,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {

  codeCheck,
  passwordRecover,
  passwordChange,
  registerToken
};
