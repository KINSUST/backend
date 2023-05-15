const path = require("path");
const fs = require("fs");

const directoryPath = path.join(__dirname, "../public/images");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    console.log("Error getting directory information.");
  } else {
    files.forEach(function (file) {
      console.log(file);
    });
  }
});