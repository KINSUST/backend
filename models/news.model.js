const mongoose = require("mongoose");

// create newsTicker schema

const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      
      required: true,
      
      
    },
    fb_url: {
      type: String,
      required: true,
    },
  }
);

// export newsTicker
module.exports = mongoose.model("news", newsSchema);
