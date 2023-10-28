import Mongoose from "mongoose";
import userType from "../enum/userType";
import status from "../enum/status";
import bcrypt from "bcryptjs";
import paginate from "mongoose-paginate-v2";


var userModel = new Mongoose.Schema(
  {
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    surName: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
   
    
    userName: {
      type: String,
    },

    otpExpireTime: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

userModel.plugin(paginate);
module.exports = Mongoose.model("user", userModel, "user");