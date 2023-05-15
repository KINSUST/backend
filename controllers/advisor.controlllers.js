const { isValidObjectId } = require("mongoose");
const customError = require("../utils/customError");

const imageMulter = require("../middlewares/photoUpload.middleware");
const { unlinkSync } = require("fs");
const path = require("path");

const advisorModel = require("../models/advisor.model");
const { log } = require("console");
const queryFunction = require("../utils/queryFunction");
const checkImage = require("../utils/imagesCheck");

/**
 * @description get all advisors data
 * @method GET
 * @route  /api/v1/advisors
 * @access public
 */  


const allAdvisor = async (req, res, next) => {
  const { queries, filters } = queryFunction(req);

  try {
    const advisors = await advisorModel
      .find(filters)
      .skip(queries.skip)
      .limit(queries.limit)
      .sort(queries.sortBy);
    if (advisors.length < 1) {
      throw customError(200, "No user data has founded");
    }
    // page , total count
    const total = await advisorModel.countDocuments(filters);
    const pages = Math.ceil(total / queries.limit);
    res.status(200).json({
      status: "success",
      total,
      pages,
      data: advisors,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @description create advisor data
 * @method POST
 * @route  /api/v1/advisors
 * @access private
 */  


const createAdvisor = async (req, res, next) => {
  imageMulter(req, res, async (err) => {
    if (err) {
      next(err);
    } else {
      try {
        // advisor check is already register or not
        const existAdvisor = await advisorModel.findOne({
          email: req.body.email,
        });

        // advisor email check
        if (existAdvisor) {
          throw customError(404, "Email already exits!");
        }
        console.log(req.file);
        const user = await advisorModel.create({
          ...req.body,
          photo: req?.file?.filename,
        });

        res.status(201).json({
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
 * @description get single advisor data
 * @method GET
 * @route  /api/v1/advisors/:id
 * @access private
 */

const singleAdvisor = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // advisor id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid advisorID");
    }
    const advisor = await advisorModel.findById(userId);
    if (!advisor) {
      throw customError(400, "No advisor data has found");
    }
    res.status(200).json({
      status: "success",
      result: advisor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description delete single advisor data
 * @method DELETE
 * @route  /api/v1/advisors/:id
 * @access private
 */

const deleteSingleAdvisor = async (req, res, next) => {
  try {
    const advisorId = req.params.id;
    // advisor id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid advisorID");
    }
    // advisor check
    const advisor = await advisorModel.findById(advisorId);
    if (!advisor) {
      throw customError(400, "No advisor has founded");
    }
    // find image in folder & delete
    checkImage("advisors").find((image) => image === advisor?.photo) &&
      unlinkSync(
        path.join(__dirname, `../public/images/advisors/${advisor?.photo}`)
      );

    // data  delete from database
    const result = await advisorModel.findByIdAndDelete(advisorId);

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

const updateSingleAdvisor = async (req, res, next) => {
  imageMulter(req, res, async (err) => {
    if (err) {
      next(err);
    } else {
      try {
        const advisorId = req.params.id;
        // advisor id validation check
        if (!isValidObjectId(req.params.id)) {
          throw customError(400, "Invalid advisorID");
        }

        // user check
        const advisorData = await advisorModel.findById(advisorId);
        if (!advisorData) {
          throw customError(400, "No advisor has founded");
        }

        const advisor = await advisorModel.findByIdAndUpdate(
          advisorId,
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
        if (advisor && advisorData?.photo && req.file) {
          unlinkSync(
            path.join(
              __dirname,
              `../public/images/advisors/${advisorData?.photo}`
            )
          );
        }
        res.status(200).json({
          status: "success",
          result: advisor,
        });
      } catch (error) {
        next(error);
      }
    }
  });
};

module.exports = {
  allAdvisor,
  createAdvisor,
  singleAdvisor,
  deleteSingleAdvisor,
  updateSingleAdvisor,
};
