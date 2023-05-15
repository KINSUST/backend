const { unlinkSync } = require("fs");
const path = require("path");
const customError = require("../utils/customError");
const { isValidObjectId } = require("mongoose");
const imageMulter = require("../middlewares/photoUpload.middleware");
const sliderModel = require("../models/slider.model");
const queryFunction = require("../utils/queryFunction");
const checkImage = require("../utils/imagesCheck");

/**
 * @description get all sliders data
 * @method GET
 * @route  /api/v1/slider
 * @access public
 */

const getAllSlider = async (req, res, next) => {
  const { queries, filters }=queryFunction(req)
  try {
    const result = await sliderModel
      .find()
      .skip(queries.skip)
      .limit(queries.limit)
      .sort(queries.sortBy);

    if (result.length < 1) {
      throw customError(200, "No slider data has founded");
    }
    // page , total count
    const total = await sliderModel.countDocuments(filters);
    const pages = Math.ceil(total / queries.limit);
    res.status(200).json({
      status: "success",
      pages,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description get single slider data
 * @method GET
 * @route  /api/v1/slider/:id
 * @access private
 */

const singleSlider = async (req, res, next) => {
  try {
    // user id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid sliderID");
    }
    const result = await sliderModel.findById(req.params.id);
    if (!result) {
      throw customError(400, "No slider data has found");
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
 * @description add slider data
 * @method POST
 * @route  /api/v1/slider
 * @access private
 */

const addSlider = async (req, res, next) => {
  imageMulter(req, res, async (err) => {
    try {
      if (err) {
        next(err);
      } else {
        const result = await sliderModel.create({
          ...req.body,
          photo: req?.file?.filename,
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
 * @description delete single slider data
 * @method DELETE
 * @route  /api/v1/slider
 * @access private
 */

const deleteSlider = async (req, res, next) => {
  try {
    const singleSlider = req.params.id;

    // slider id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid sliderID");
    }
    const sliderData = await sliderModel.findById(singleSlider);
    // slider check
    if (!sliderData) {
      throw customError(400, "No slider has founded");
    }

    // find image in folder & delete
    checkImage("slider").find((image) => image === sliderData?.photo) &&
      unlinkSync(
        path.join(__dirname, `../public/images/slider/${sliderData?.photo}`)
      );
    

    const result = await sliderModel.findByIdAndDelete(singleSlider);
    res.status(200).json({
      status: "success",
      message: "successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @description update single slider data
 * @method PUT/PATCH
 * @route  /api/v1/slider
 * @access private
 */

const updateSlider = async (req, res, next) => {
    imageMulter(req, res, async (err) => {
      if (err) {
        next(err);
      } else {
       try {
         // slider id validation check
         if (!isValidObjectId(req.params.id)) {
           throw customError(400, "Invalid sliderID");
         }
         const slider = await sliderModel.findById(req.params.id);
         // slider check
         if (!slider) {
           throw customError(400, "No slider has founded");
         }

         const result = await sliderModel.findByIdAndUpdate(
           req.params.id,
           { $set: { ...req.body, photo: req?.file?.filename } },
           { new: true, runValidators: true }
         );
         if (result && req.file) {
           unlinkSync(
             path.join(__dirname, `../public/images/slider/${slider.photo}`)
           );
         }

         res.status(200).json({
           status: "success",
           result,
         });
       } catch (error) {
        next(error)
       }
      }
    });
 
};

// export slider
module.exports = {
  getAllSlider,
  singleSlider,
  addSlider,
  deleteSlider,
  updateSlider,
};
