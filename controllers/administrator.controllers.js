const { isValidObjectId } = require("mongoose");
const customError = require("../utils/customError");
const bcrypt = require("bcryptjs");
const imageMulter = require("../middlewares/photoUpload.middleware");
const { unlinkSync } = require("fs");
const path = require("path");

const administratorModel = require("../models/administrator.model");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const randomCode = require("../utils/randomCode");
const verifyTokenModel = require("../models/verifyToken.model");
const CreateToken = require("../utils/CreateToken");

/**
 * @description get all Administrator data
 * @method GET
 * @route  /api/v1/Administrator
 * @access public
 */

const allAdministrator = async (req, res, next) => {
  try {
    const Administrator = await administratorModel.find();
    if (Administrator.length < 1) {
      throw customError(200, "No administrator data has founded");
    }

    res.status(200).json({
      status: "success",
      data: Administrator,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @description create advisor data
 * @method POST
 * @route  /api/v1/Administrator
 * @access private
 */

const createAdministrator = async (req, res, next) => {
  try {
    // Administrator check is already register or not
    const existAdministrator = await administratorModel.findOne({
      email: req.body.email,
    });

    // Administrator email check
    if (existAdministrator) {
      throw customError(404, "Email already exits!");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword =
      req.body.password && bcrypt.hashSync(req.body.password, salt);

    const administrator = await administratorModel.create({
      ...req.body,
      password: hashPassword,
    });

    res.status(201).json({
      status: "success",
      data: administrator,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description get single administrator data
 * @method GET
 * @route  /api/v1/administrator/:id
 * @access private
 */

const singleAdministrator = async (req, res, next) => {
  try {
    const administratorId = req.params.id;

    // administrator id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid administratorID");
    }
    const administrator = await administratorModel.findById(userId);
    if (!administrator) {
      throw customError(400, "No administrator data has found");
    }
    res.status(200).json({
      status: "success",
      result: administrator,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description delete single Administrator data
 * @method DELETE
 * @route  /api/v1/administrator/:id
 * @access private
 */

const deleteSingleAdministrator = async (req, res, next) => {
  try {
    const administratorId = req.params.id;
    // administrator id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid administratorID");
    }
    // administrator check
    const administrator = await administratorModel.findById(administratorId);
    if (!administrator) {
      throw customError(400, "No administrator has founded");
    }
    // freeze administrator account
    const allRole = await administratorModel.find({});
    if (allRole[0]._id == req.params.id) {
      throw customError(200, "You can't delete this account");
    }
    // image delete
    if (administrator?.photo) {
      unlinkSync(
        path.join(__dirname, `../public/images/administrator/${user.photo}`)
      );
    }

    // data delete
    const result = await administratorModel.findByIdAndDelete(administratorId);

    res.status(200).json({
      status: "success",
      message: "successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description update single administrator data
 * @method PUT / PATCH
 * @route  /api/v1/administrator/:id
 * @access private
 */

const updateSingleAdministrator = async (req, res, next) => {
  imageMulter(req, res, async (err) => {
    if (err) {
      next(err);
    } else {
      try {
        const administratorId = req.params.id;
        // administrator id validation check
        if (!isValidObjectId(req.params.id)) {
          throw customError(400, "Invalid administratorID");
        }
        // Administrator check
        const administratorData = await administratorModel.findById(
          administratorId
        );
        if (!administratorData) {
          throw customError(400, "No administrator has founded");
        }

        const administrator = await administratorModel.findByIdAndUpdate(
          administratorData,
          {
            $set: {
              ...req.body,
              photo: req?.file?.filename,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        if (administrator && administratorData.photo && req.file) {
          unlinkSync(
            path.join(
              __dirname,
              `../public/images/administrator/${administratorData.photo}`
            )
          );
        }
        res.status(200).json({
          status: "success",
          data: administrator,
        });
      } catch (error) {
        next(error);
      }
    }
  });
};

/**
 * @description administrator login
 * @method POST
 * @route api/v1/administrator/login
 * @access private
 */

const administratorLogin = async (req, res, next) => {
  try {
    const login_administrator = await administratorModel.findOne({
      email: req.body.email,
    });
    // administrator email check
    if (!login_administrator) {
      throw customError(404, "You have not register yet.");
    }

    const passwordCheck =
      req.body.password &&
      bcrypt.compareSync(req.body.password, login_administrator.password);

    // password check
    if (!passwordCheck) {
      throw customError(404, "wrong password");
    }

    // create token
    const token = jwt.sign(
      { _id: login_administrator._id, role: login_administrator.role },
      process.env.SECRET_CODE,
      { expiresIn: "1d" }
    );
    const { email, role, ...login_info } = login_administrator._doc;

    // user data send
    res
      .cookie("access_token", token, {
        expires: new Date(Date.now() + 900000),

        // maxAge: 7*24*60*60*1000,
      })
      .status(200)
      .json({
        status: "success",
        token,
        data: login_info,
      });
  } catch (error) {
    next(error);
  }
};

// logged user data
const getLoggedInAdministrator = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    // check token
    if (!token) {
      throw customError(401, "you are not authorized");
    }

    const loginUser = jwt.verify(token, process.env.SECRET_CODE) || null;

    // login token validation check
    if (!loginUser) {
      throw customError(404, "invalid token");
    }

    // login user data
    const user = await administratorModel.findById(loginUser._id);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description logout
 * @method GET
 * @route api/v1/administrator/logout
 * @access private
 */
const logout = async (req, res, next) => {
  try {
    // remove cookie
    res.clearCookie("access_token").status(200).json({
      status: "successfully logout",
    });
  } catch (error) {
    next(error);
  }
};

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
    const user = await administratorModel.findOne({ email: req.body.email });

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
    const data = await administratorModel.findOneAndUpdate(
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
module.exports = {
  passwordChange,
  codeCheck,
  allAdministrator,
  singleAdministrator,
  deleteSingleAdministrator,
  updateSingleAdministrator,
  createAdministrator,
  administratorLogin,
  getLoggedInAdministrator,
  logout,
  passwordRecover,
};
