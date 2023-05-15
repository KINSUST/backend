const { isValidObjectId } = require("mongoose");
const subscriberModel = require("../models/subscriber.model");
const customError = require("../utils/customError");
const queryFunction = require("../utils/queryFunction");

/**
 * @description get all subscriber data
 * @method GET
 * @route  /api/v1/subscriber
 * @access private
 */

const allSubscriber = async (req, res, next) => {
  const { queries, filters } = queryFunction(req);
  try {
    const result = await subscriberModel
      .find(filters)
      .skip(queries.skip)
      .limit(queries.limit)
      .sort(queries.sortBy);
    if (result.length < 1) {
      throw customError(400, "No subscriber data has founded");
    }
    // page , total count
    const total = await subscriberModel.countDocuments(filters);
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
 * @description add  subscriber
 * @method POST
 * @route  /api/v1/subscriber
 * @access public
 */

const addSubscriber = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subscriber = await subscriberModel.findOne({ email });
    if (subscriber) {
      throw customError(400, "You have already subscribe.");
    }
    const result = await subscriberModel.create(req.body);
    res.status(200).json({
      status: "success",
      result,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @description add  subscriber
 * @method POST
 * @route  /api/v1/subscriber
 * @access public
 */

const updateSubscriber = async (req, res, next) => {
  try {
    
    const id = req.params.id;
    // advisor id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid subscriberID");
    }

    // user check
    const subscriberData = await subscriberModel.findById(id);
    if (!subscriberData) {
      throw customError(400, "No subscriber has founded");
    }
    const subscriber = await subscriberModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      result: subscriber,
    });
  } catch (error) {
    next(error);
  }
};


const deleteSubscriber=async(req,res,next)=>{
try {
    const id = req.params.id;
    // advisor id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid subscriber ID");
    }
    // advisor check
    const subscriber = await subscriberModel.findById(id);
    if (!subscriber) {
      throw customError(400, "No subscriber has founded");
    }
    

    // data  delete from database
    const result = await subscriberModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "successfully deleted",
    });
  } catch (error) {
    next(error);
  }
}

//export controllers

module.exports = {
  allSubscriber,
  addSubscriber,
  updateSubscriber,
  deleteSubscriber
};
