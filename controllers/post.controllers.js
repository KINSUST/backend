
const postDocument = require("../models/post.model");
const { unlinkSync } = require("fs");
const path = require("path");
const customError = require("../utils/customError");
const postModel = require("../models/post.model");
const imageMulter = require("../middlewares/photoUpload.middleware");
const { isValidObjectId } = require("mongoose");

/**
 * @description get all post  data
 * @method GET  
 * @route  /api/v1/post
 * @access public
 */

const allPost = async (req, res, next) => {
  try {
    const size = parseInt(req.query.size);
    const page = parseInt(req.query.page);

    const result = await postModel
      .find()
      .sort({ _id: -1 })
      .skip(size * page)
      .limit(size);
    if (result.length < 1) {
      throw customError(200, "No program data has founded");
    }

    const count = await postModel.estimatedDocumentCount();
    res.status(200).json({
      status: "success",
      total_document: count,
      result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description add new post  data
 * @method POST   
 * @route  /api/v1/post
 * @access private
 */

const createPost = async (req, res, next) => {
  imageMulter(req, res, async (err) => {
    try {
      if (err) {
        next(err);
      } else {
        const result = await postModel.create({
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
 * @description get single post  data
 * @method GET   
 * @route  /api/v1/post/:slug
 * @access private
 */

const singlePost = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const post = await postModel.findOne().where("slug").equals(slug);
    // post slug validation check

    if (!post) {
      throw customError(400, "Invalid slug");
    }

    res.status(200).json({
      status: "success",
      result: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description delete single post  data
 * @method DELETE    
 * @route  /api/v1/post/:slug
 * @access private
 */

const deletePost = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const post = await postModel.findOne().where("slug").equals(slug);
    // post slug validation check
    if (!post) {
      throw customError(400, "Invalid slug");
    }
    unlinkSync(path.join(__dirname, `../public/images/post/${post.photo}`));
    const result = await postDocument
      .findOneAndDelete()
      .where("slug")
      .equals(slug);
    res.status(200).json({
      status: "success",
      message: "successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description update single post  data
 * @method PUT / PATCH  
 * @route  /api/v1/post/:slug
 * @access private
 */

const updatePost = async (req, res,next) => {
  try {
    const id = req.params.id;
    // post id validation check
    if (!isValidObjectId(req.params.id)) {
      throw customError(400, "Invalid postID");
    }
    const post= await postModel.findById(req.params.id);
    // slider check
    if (!post) {
      throw customError(400, "No post data has founded");
    }
    const data = req.body.comment;
    const result = await postDocument.findByIdAndUpdate(
      req.params.id,
      {
        $push:{comment:data},
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: result,
    });
  } catch (error) {
    next(error);
  }
};

//export controllers

module.exports = {
  allPost,
  updatePost,
  createPost,
  singlePost,
  deletePost,
};
