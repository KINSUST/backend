const postDocument = require("../models/post.model");
const { unlinkSync } = require("fs");
const path = require("path");
const customError = require("../utils/customError");
const postModel = require("../models/post.model");
const imageMulter = require("../middlewares/photoUpload.middleware");
const { isValidObjectId } = require("mongoose");
const queryFunction = require("../utils/queryFunction");
const { log } = require("console");
const checkImage = require("../utils/imagesCheck");

/**
 * @description get all post  data
 * @method GET
 * @route  /api/v1/post
 * @access public
 */

const allPost = async (req, res, next) => {
  try {
    const { queries, filters } = queryFunction(req);

    const post = await postModel
      .find(filters)
      .skip(queries.skip)
      .limit(queries.limit)
      .sort(queries.sortBy);
    if (post.length < 1) {
      throw customError(200, "No post data has founded");
    }

    // page , total count
    const total = await postModel.countDocuments(filters);
    const pages = Math.ceil(total / queries.limit);
    res.status(200).json({
      status: "success",
      total,
      pages,
      data: post,
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
        const post = await postModel.create({
          ...req.body,
          photo: req?.file?.filename,
        });
        res.status(200).json({
          status: "success",
          data:post,
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
      throw customError(404, "No post found");
    }

    res.status(200).json({
      status: "success",
      data: post,
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
      throw customError(400, "No post found");
    }
    

    // find image in folder & delete
    checkImage("post").find((image) => image === post?.photo) &&
      unlinkSync(
        path.join(__dirname, `../public/images/post/${post?.photo}`)
      );
    const result = await postModel
      .findOneAndDelete({slug})
     
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

const updatePost = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const post = await postModel.findOne().where("slug").equals(slug);
    // post slug validation check

    if (!post) {
      throw customError(404, "No post found");
    }


    const result = await postDocument.findOneAndUpdate(
      { slug },
      {
        $push: { comment: req?.body?.comment },
        $set: { slug: req?.body?.slug },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: result,
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
