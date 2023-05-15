const mongoose = require("mongoose");

// create user schema
const userSchema = mongoose.Schema(
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

    gender: {
      type: String,
      lowercase: true,
      required: [true, "Gender is required!"],
      enum: ["male", "female"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required!"],
    },
    cell: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB-", "AB+", "O+", "O-"],
    },
    age: {
      type: Number,
    },
    location: {},
    feedback: {},

    index: {
      type: Number,
      default: 99999,
    },

    fb: {
      type: String,
    },
    instagram: {
      type: String,
    },

    isEC: {
      status: {
        type: Boolean,
        default: false,
      },
      year: {
        type: String,
        default:null
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
