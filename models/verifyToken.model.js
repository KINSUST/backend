
const mongoose =require('mongoose')

const verifyToken = mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token is required"],
    },
    code: {
      type: String,
      required: [true, "code is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports= mongoose.model("VerifyToken", verifyToken);
