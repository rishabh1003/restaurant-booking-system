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
    userType: {
      type: String,
      default: userType.VENDOR,
    },
    status: {
      type: String,
      default: status.ACTIVE,
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
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

userModel.plugin(paginate);
module.exports = Mongoose.model("vendor", userModel, "vendor");

const admin = async () => {
  try {
    const user = await Mongoose.model("vendor", userModel).find({
      userType: userType.ADMIN,
    });
    //  console.log(user);
    if (user.length > 0) {
      console.log("admin already exists");
      return;
    } else {
      let obj = {
        userType: userType.ADMIN,
        firstName: "Rishabh",
        surName: "Gupta",
        userName: "rishabh1003",
        countryCode: "+91",
        mobileNumber: "7266842297",
        email: "rishabh.gupta@indicchain.com",
        dateOfBirth: "10-03-2001",
        password: bcrypt.hashSync("Mobiloitte@1"),
        address: "LDA ,Lucknow",
        profilePic: "",
      };

      await Mongoose.model("vendor", userModel).create(obj);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
admin();
