const mongoose = require("mongoose");

//create schema

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    slug: {
      type: String,
      required: [true, "slug is required!"],
    },
    photo: {
      type: String,
      required:[true,'Photo is required!']
    },
    comment: {
      type: Array,
      default: [],
    },

    banner: {
      type: String,
    },
    details: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// create users collecting(auto plural)
module.exports = mongoose.model("post", postSchema);
