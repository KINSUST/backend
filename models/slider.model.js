const mongoose = require("mongoose");

//create slider schema

const sliderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "slider title is required!"],
    },
    photo: {
      type: String,
      required: [true, "slider photo is required!"],
    },
    index:{
      type:Number,
      default:99
    }
  },
  {
    timestamps: true,
  }
);

// create slider collection
module.exports = mongoose.model("slider", sliderSchema);
