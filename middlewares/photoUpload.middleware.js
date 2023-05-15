const multer = require("multer");
const path = require("path");
const customError = require("../utils/customError");
const { log } = require("console");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // image file size limit
    const fileSize = parseInt(req.headers["content-length"]);
    // if (fileSize > 500000) {
    //   cb(customError(400, "Maximum image size 500KB"));
    //   return false;
    // }
    

    //slider
    if (req.baseUrl == "/api/v1/slider") {
      if (fileSize > 1200000) {
        cb(customError(400, "Maximum image size 1.2MB"));
        return false;
      }
      cb(null, "public/images/slider");

    }
    // program
    if (req.baseUrl == "/api/v1/program") {
      if (fileSize > 1000000) {
        cb(customError(400, "Maximum image size 1MB"));
        return false;
      }
      cb(null, "public/images/program");
    }
    // administrator
    if (req.baseUrl == "/api/v1/administrator") {
      if (fileSize > 400000) {
        cb(customError(400, "Maximum image size 400KB"));
        return false;
      }
      cb(null, "public/images/administrator");
    }
    // advisor
    if (req.baseUrl == "/api/v1/advisors") {
      if (fileSize > 1000000) {
        cb(customError(400, "Maximum image size 1MB"));
        return false;
      }
      cb(null, "public/images/advisors");
    }
    // users
    if (req.baseUrl == "/api/v1/users") {
      if (fileSize > 400000) {
        cb(customError(400, "Maximum image size 400KB"));
        return false;
      }

    
      cb(null, "public/images/users");
    }

    // post
    if (req.baseUrl == "/api/v1/post") {
    
      cb(null, "public/images/post");
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "_" +
        Math.ceil(Math.random() * 100000) +
        "_" +
        file.originalname
    );
  },
});

const photoFilter = (req, file, cb) => {
  // image extension fixed
  const supportedImageExtension = /(png|jpg|jpeg|webp)/;
  const fileExtension = path.extname(file.originalname);
  if (supportedImageExtension.test(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG/JPG/JPEG/WEBP image accepted"));
  }
};

const imageMulter = multer({
  storage: imageStorage,
  fileFilter: photoFilter,
}).single("photo");

module.exports = imageMulter;
