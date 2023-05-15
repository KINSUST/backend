const mongoose = require("mongoose");

// create administrator schema
const administratorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required!"],
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
    role: {
      type: String,
      required: [true, "Role is required!"],
      enum: ["moderator", "administrator"],
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required!"],
    },

    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Administrator", administratorSchema);
