const { isValidObjectId } = require("mongoose");
const customError = require("../utils/customError");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const imageMulter = require("../middlewares/photoUpload.middleware");
const { unlinkSync } = require("fs");
const path = require("path");

const sendMail = require("../utils/sendMail");
const verifyTokenModel = require("../models/verifyToken.model");
const CreateToken = require("../utils/CreateToken");

const queryFunction = require("../utils/queryFunction");
const randomCode = require("../utils/randomCode");
const sendPasswordResetEmail = require("../utils/sendPassordResetEmail");
const { log } = require("console");
const sendRegisterEmailVerifyEmail = require("../utils/sendResigerEmailVerifyMail");

/**
 * @description get all users data
 * @method GET
 * @route  /api/v1/users
 * @access public
 */

const allUser = async (req, res, next) => {
  const { queries, filters } = queryFunction(req);
  try {
    const users = await userModel
      .find(filters)
      .skip(queries.skip)
      .limit(queries.limit)
      .sort(queries.sortBy);
    if (users.length < 1) {
      throw customError(200, "No user data has founded");
    }

    // page , total count
    const total = await userModel.countDocuments(filters);
    const pages = Math.ceil(total / queries.limit);
    res.status(200).json({
      status: "success",
      total,
      pages,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description register token
 * @method POST
 * @route api/v1/user/:id
 * @access public
 */
const registerByToken = async (req, res, next) => {
  const generateCode = randomCode(4)
  const salt = bcrypt.genSaltSync(10);
  
  try {
    const saltForCode = bcrypt.genSaltSync(10);
    

    const searchByEmail = await userModel.findOne({ email: req.body.email });

    if (searchByEmail) {
      throw customError(401, "You have already register!");
    }
    // before token delete
     await verifyTokenModel.findOneAndDelete({ email: req.body.email });
    //hash password
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    const hashCode = bcrypt.hashSync(generateCode, saltForCode);

    const userData = {
      ...req.body,
      password: hashPassword,
      code: hashCode,
    };
    // create token
    const token = CreateToken(userData, "600s");

    const result = await verifyTokenModel.create({
      token,
      code: hashCode,
      email: req.body.email,
    });

    sendRegisterEmailVerifyEmail(req.body.email, generateCode);
    console.log(generateCode);
    const { code, ...temporaryData } = result._doc;

    res.status(200).json({
      status: "success",
      result: temporaryData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description   user register
 * @method GET
 * @route api/v1/user/:id
 * @access public
 */
const userRegister = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.headers?.authorization?.split(" ")[1] || req.cookies.registerToken;
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
    // if all is ok
    const { code, iat, exp, ...temporaryData } = temToken;

    // user create
    const data = await userModel.create(temporaryData);
    // //delete temporary token
    if (data) {
      await verifyTokenModel.findOneAndDelete({ email: temToken.email });
    }

    res.status(200).json({
      status: "success",
      result: data,
    });
  } catch (error) {
    if (error.message === "jwt expired") {
      error.message = "Code expired";
    }
    next(error);
  }
};

/**
 * @description create user data
 * @method POST
 * @route  /api/v1/users
 * @access private
 */
// registerUser

// user create by admin
const createUser = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.headers?.authorization?.split(" ")[1] || req.cookies.registerToken;

    // token verify & data extract
    const temToken = jwt?.verify(token, process.env.SECRET_CODE);
    console.log(temToken.role);
    if (!temToken.role === "administrator" || !temToken.role === "moderator") {
      throw customError(401, "Only admin can add user");
    }

    // user check is already register or not
    const login_user = await userModel.findOne({ email: req.body.email });

    // user email check
    if (login_user) {
      throw customError(404, "Email already exits!");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword =
      req.body.password && bcrypt.hashSync(req.body.password, salt);

    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
    });
    // await sendMail(user.email,"Verify")
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description get single user data
 * @method GET
 * @route  /api/v1/users/:id
 * @access private
 */

const singleUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // user id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid userID");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      throw customError(400, "No user data has found");
    }
    res.status(200).json({
      status: "success",
      result: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description delete single user data
 * @method DELETE
 * @route  /api/v1/users/:id
 * @access private
 */

const deleteSingleUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // user id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid userID");
    }
    // user check
    const user = await userModel.findById(userId);
    if (!user) {
      throw customError(400, "No user has founded");
    }
    // image delete
    unlinkSync(path.join(__dirname, `../public/images/users/${user.photo}`));
    // data delete
    const result = await userModel.findByIdAndDelete(userId);

    res.status(200).json({
      status: "success",
      message: "successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description update single user data
 * @method PUT / PATCH
 * @route  /api/v1/users/:id
 * @access private
 */

const updateSingleUser = async (req, res, next) => {
  imageMulter(req, res, async (err) => {
    if (err) {
      next(err);
    } else {
      try {
        
        const userId = req.params.id;
        // user id validation check
        if (!isValidObjectId(req.params.id)) {
          throw customError(400, "Invalid userID");
        }
        // user check
        const userData = await userModel.findById(userId);
        if (!userData) {
          throw customError(400, "No user has founded");
        }

        const { password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashPassword =
          password && bcrypt.hashSync(req.body.password, salt);
          
        // json parse
        const EcDATA = req.body.isEc && JSON.parse(req.body.isEc);
        
        const user = await userModel.findByIdAndUpdate(
          userId,
          {
            $set: {
              ...req.body,
              "isEC.status": EcDATA && Boolean([EcDATA.status]),
              "isEC.year": EcDATA && String([EcDATA.year]),
              photo: req?.file?.filename,
              password:  hashPassword,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        if (user && userData.photo && req.file) {
          unlinkSync(
            path.join(__dirname, `../public/images/users/${userData.photo}`)
          );
        }
        res.status(200).json({
          status: "success",
          result: user,
        });
      } catch (error) {
        next(error);
      }
    }
  });
};

/**
 * @description login  user data
 * @method POST
 * @route api/v1/user/login
 * @access private
 */
const loginUser = async (req, res, next) => {
  try {
    const login_user = await userModel.findOne({ email: req.body.email });

    // user email check
    if (!login_user) {
      throw customError("404", "You have not register yet.");
    }

    const passwordCheck = bcrypt.compareSync(
      req.body.password,
      login_user.password
    );

    // password check
    if (!passwordCheck) {
      throw customError(404, "wrong password");
    }

    // create token
    const token = jwt.sign({ _id: login_user._id }, process.env.SECRET_CODE, {
      expiresIn: "1d",
    });
    const { gender, password, photo, cell, index, isEC, ...login_info } =
      login_user._doc;

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
        user: login_info,
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @description logout
 * @method GET
 * @route api/v1/user/logout
 * @access private
 */
const logoutUser = async (req, res, next) => {
  try {
    // remove cookie
    res.clearCookie("access_token").status(200).json({
      status: "successfully logout",
    });
    console.log("last");
  } catch (error) {
    next(error);
  }
};

// logged user data
const getLoggedInUser = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    // check token

    if (!token) {
      throw customError(401, "you are not authorized");
    }

    const login_user = jwt.verify(token, process.env.SECRET_CODE) || null;

    // login token validation check
    if (!login_user) {
      throw customError(404, "invalid token");
    }

    // login user data
    const user = await userModel.findById(login_user._id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};


// code check
const userVerifyCodeCheck = async (req, res, next) => {
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
    const token = CreateToken(userData, "600s");

    const result = await verifyTokenModel.create({
      token,
      code: hashCode,
      email: req.body.email,
    });
    // code send to email
    sendPasswordResetEmail(req.body.email,generateCode)

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
 * @description forgotten password change
 * @method POST
 * @route api/v1/password-change
 * @access public
 */

const forgottenPasswordChange = async (req, res, next) => {
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
 * @description  password change in login user
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
    const verifyToken = jwt?.verify(token, process.env.SECRET_CODE);

    // register token check

    const userData = await userModel.findById(verifyToken._id);
    if (!userData) {
      throw customError(401, "Invalid Email Address");
    }

    //hash password
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    // user create
    const data = await userModel.findOneAndUpdate(
      { email: userData.email },
      {
        $set: {
          password: hashPassword,
        },
      },
      { runValidators: true }
    );


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
  allUser,
  createUser,
  getLoggedInUser,
  singleUser,
  deleteSingleUser,
  updateSingleUser,
  loginUser,
  logoutUser,
  userRegister,
  registerByToken,
  userVerifyCodeCheck,
  passwordRecover,forgottenPasswordChange,passwordChange }
