const mongoose = require("mongoose");

// create advisor schema
const advisorSchema = mongoose.Schema(
  {
    name: {
      type: String, 
      trim: true,
      required: [true, "Name is required!"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required!"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    cell: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    website: {
      type:String
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

module.exports = mongoose.model("Advisor", advisorSchema);
