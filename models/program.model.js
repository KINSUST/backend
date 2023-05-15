const mongoose = require("mongoose");

//create program schema
const programSchema = mongoose.Schema(
  {
    photo: {
      type: String,
      required: [true, "Program photo is required!"],
    },
    fb_url: {
      type: String,
      required: [true, "Facebook url is required!"],
    },
    title: {
      type: String,
      required: [true, "Program title is required!"],
    },
    location: {
      type: String,
  
    },
  },
  {
    timestamps: true,
  }
);

// create program collection
module.exports = mongoose.model("program", programSchema);
