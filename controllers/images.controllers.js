

const {unlinkSync}=require('fs')
// advisors images

const checkImage = require("../utils/imagesCheck")
const path = require('path')

const advisorsImages=async(req,res,next)=>{
    try {
        const allImages = checkImage("advisors")
        res.status(200).json({
            status:"success",
            data:allImages
        })
    } catch (error) {
        next(error)
    }
}

// single advisor image delete
const advisorsImageDelete=async(req,res,next)=>{
    const {name}=req.params
    try {
        unlinkSync(
          path.join(__dirname, `../public/images/advisors/${name}`)
        );
        res.status(200).json({
            status:"success",
            message:"successfully deleted"
        })
    } catch (error) {
        next(error)
    }
}
const slidersImages=async(req,res,next)=>{
    try {
        const allImages = checkImage("slider")
        res.status(200).json({
            status:"success",
            data:allImages
        })
    } catch (error) {
        next(error)
    }
}

// single advisor image delete
const slidersImageDelete=async(req,res,next)=>{
    const {name}=req.params
    try {
        unlinkSync(
          path.join(__dirname, `../public/images/slider/${name}`)
        );
        res.status(200).json({
            status:"success",
            message:"successfully deleted"
        })
    } catch (error) {
        next(error)
    }
}

// programs images
const programImages=async(req,res,next)=>{
    try {
        const allImages = checkImage("program")
        res.status(200).json({
            status:"success",
            data:allImages
        })
    } catch (error) {
        next(error)
    }
}

// single advisor image delete
const programImageDelete=async(req,res,next)=>{
    const {name}=req.params
    try {
        unlinkSync(
          path.join(__dirname, `../public/images/program/${name}`)
        );
        res.status(200).json({
            status:"success",
            message:"successfully deleted"
        })
    } catch (error) {
        next(error)
    }
}
// programs images
const usersImages=async(req,res,next)=>{
    try {
        const allImages = checkImage("program")
        res.status(200).json({
            status:"success",
            data:allImages
        })
    } catch (error) {
        next(error)
    }
}

// single advisor image delete
const usersImageDelete=async(req,res,next)=>{
    const {name}=req.params
    try {
        unlinkSync(
          path.join(__dirname, `../public/images/program/${name}`)
        );
        res.status(200).json({
            status:"success",
            message:"successfully deleted"
        })
    } catch (error) {
        next(error)
    }
}




module.exports ={
    advisorsImages,advisorsImageDelete,slidersImageDelete,slidersImages,programImageDelete,programImages,usersImageDelete,usersImages
}