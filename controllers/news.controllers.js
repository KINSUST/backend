const newsDocument = require("../models/news.model");
const customError = require("../utils/customError");
const {isValidObjectId}=require('mongoose')


/**
 * @description get all news data
 * @method GET 
 * @route  /api/v1/news-ticker
 * @access public
 */

const newsTicker = async (req, res,next) => {
  try {
    const result = await newsDocument.find();
    res.status(200).json({
      status:"success",
      data:result
    })
  } catch (error) {
    next(error)
    
  }
};

/**
 * @description add  news data
 * @method POST 
 * @route  /api/v1/news-ticker
 * @access private
 */

const createNews = async (req, res,next) => {
  try {
    const {title,fb_url} = req.body;
    const beforeDataCheck=await newsDocument.find()
    console.log(beforeDataCheck);
    if(beforeDataCheck?.length===1){
      throw customError(401,"Already has a news.Please delete before news")
    }
    if(!title){
      throw customError(400,'title is required!')
    }else if(!fb_url){
      throw customError(400, "Facebook URL is required!");
    }else{
      const result = await newsDocument.create(req.body);
      res.status(200).json({
        status:"success",
        result
      })
    }
    
  } catch (error) {
    next(error);
  }
};


/**
 * @description get single  news data
 * @method GET  
 * @route  /api/v1/news-ticker/:id
 * @access private
 */


const singleNews = async (req, res,next) => {
  try {
    const newsId = req.params.id;
    // invalid id check
    if (!isValidObjectId(newsId)) {
      throw customError("201", "invalid id");
    }
    const result = await newsDocument.findById(newsId);
    // empty data check
    if (!result) {
      throw customError("203", "No news data found");
    }
    // data send
    res.status(200).json({
      status:"success", result
    })
  } catch (error) {
    next(error);
  }
};


/**
 * @description delete single newsTicker data
 * @method DELETE  
 * @route  /api/v1/news-ticker/:id
 * @access private
 */

const deleteNews = async (req, res,next) => {
  try {
    const newsId = req.params.id;
    // invalid id check
    if (!isValidObjectId(newsId)) {
      throw customError("201", "invalid id");
    }
    const result = await newsDocument.findByIdAndDelete(newsId);
    res.status(200).json({
      status:"success",message:"successfully deleted."
    })
  } catch (error) {
    next(error);
  }
};

//export controllers

module.exports = {
  newsTicker,
  createNews,
  deleteNews,
  singleNews,
};
