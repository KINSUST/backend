const programDocument = require("../models/program.model");
const { unlinkSync } = require("fs");
const path = require("path");
const programModel = require("../models/program.model");
const imageMulter = require("../middlewares/photoUpload.middleware");
const customError = require("../utils/customError");
const { isValidObjectId } = require("mongoose");
const { log } = require("console");
const queryFunction = require("../utils/queryFunction");
const checkImage = require("../utils/imagesCheck");

/**
 * @description get all programs data
 * @method GET
 * @route  /api/v1/program
 * @access public
 */

const allProgram = async (req, res,next) => {
  const { queries, filters } = queryFunction(req);
  try {
    const result = await programModel
      .find(filters)
      .skip(queries.skip)
      .limit(queries.limit)
      .sort(queries.sortBy);

    if (result.length < 1) {
      throw customError(200, "No program data has founded");
    }
    // page , total count
    const total = await programModel.countDocuments(filters);
    const pages = Math.ceil(total / queries.limit);

    res.status(200).json({
      status: "success",
      pages,
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

/**
 * @description add new program data
 * @method POST 
 * @route  /api/v1/program
 * @access private
 */ 

const createProgram = async (req, res,next) => {
 

   imageMulter(req, res, async (err) => {
     try {
      if (err) {
        next(err);
      } else {
         
        const result = await programModel.create({
          ...req.body,photo: req?.file?.filename,
        });
        res.status(200).json({
          status: "success",
          result,
        });
      }
     } catch (error) {
      next(error);
     }
   });

};
 
/**
 * @description set single program data
 * @method GET 
 * @route  /api/v1/program/:id
 * @access private
 */ 

const singleProgram = async (req, res,next) => {
  try {
    // program id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid programID");
    }
    const result = await programModel.findById(req.params.id);
    if (!result) {
      throw customError(400, "No program data has found");
    }
    res.status(200).json({
      status: "success",
      result,
    });
  } catch (error) {
    next(error);
  } 
};

/**
 * @description delete single program data
 * @method DELETE  
 * @route  /api/v1/program/:id
 * @access private
 */ 

const deleteProgram = async (req, res,next) => {
  try {
    const singleProgram = req.params.id;
    // program id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid programID");
    }
    const program = await programModel.findById(req.params.id);
    // program data check
    if (!program) {
      throw customError(400, "No program data has founded");
    }

    // find image in folder & delete
    checkImage("program").find((image) => image === program?.photo) &&
      unlinkSync(
        path.join(__dirname, `../public/images/program/${program?.photo}`)
      );

   

    const result = await programDocument.findByIdAndDelete(singleProgram);
    res.status(200).json({
      status: "success",
      message: "successfully deleted",
    });
  } catch (error) {
    next(error);
  }
}; 

/**
 * @description update single program data
 * @method PUT / PATCH 
 * @route  /api/v1/program/:id
 * @access private
 */ 

const updateProgram = async (req, res, next) => {
  
    imageMulter(req, res, async (err) => {
      try {
        if (err) {
          next(err);
        } else {
          // program id validation check
          if (!isValidObjectId(req.params.id)) {
            throw customError(400, "Invalid programID");
          }
          const program = await programModel.findById(req.params.id);
          // slider check
          if (!program) {
            throw customError(400, "No program data has founded");
          }

          const result = await programModel.findByIdAndUpdate(
            req.params.id,
            { $set: { ...req.body, photo: req?.file?.filename } },
            { new: true, runValidators: true }
          );
          if (result && req.file) {
            unlinkSync(
              path.join(__dirname, `../public/images/program/${program.photo}`)
            );
          }

          res.status(200).json({
            status: "success",
            result,
          });
        }
      } catch (error) {
        next(error)
      }
    });
  
};






//export controllers
module.exports = {
  allProgram,
  createProgram,
  singleProgram,
  deleteProgram,
  updateProgram
};
