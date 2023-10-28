import Joi from "joi";
import apiError from "../../../../helper/apiError";
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import status from "../../../../enum/status";
import userType from "../../../../enum/userType";
import common from "../../../../helper/utils";
import { userServices } from "../../services/adminServices";
import bcrypt from "bcryptjs";
import userModel from "../../../../models/vendor";
import { Types } from "mongoose";

const { check2, findID, createUser, finduser, findAndPageinate } = userServices;
export class adminController {
  async adminlogin(req, res, next) {
    var validationSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    try {
      const validatedBody = await validationSchema.validateAsync(req.body);
      const { email, password } = validatedBody;
      const user = await check2(
        { email: email },
        { userType: { $in: userType.ADMIN } }
      );

      if (!user) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      } else if (user.status == status.BLOCK) {
        throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
      }

      const ismatch = bcrypt.compareSync(password, user.password);

      if (!ismatch) {
        throw apiError.invalid(responseMessage.INVALID_CREDENTIALS);
      }

      let token = await common.getToken({
        _id: user._id,
        email: user.email,
        userType: user.userType,
      });

      console.log(token);
      return res.json(new response(token, responseMessage.LOGIN));
    } catch (error) {
      return next(error);
    }
  }

  async createVendor(req, res, next) {
    const validationSchema = Joi.object({
      firstName: Joi.string().required(),
      surName: Joi.string().required(),

      mobileNumber: Joi.string().required(),

      email: Joi.string().required(),
    });

    try {
      const validateBody = await validationSchema.validateAsync(req.body);

      const admins = await findID({ _id: req.userId });
      // console.log(admins)

      if (!admins) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      } else if (admins.status === status.BLOCK) {
        throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
      }

      const vendor = await check2(
        { email: validateBody.email },
        { userType: userType.VENDOR, userType: { $ne: status.BLOCK } }
      );
      if (vendor) {
        throw apiError.conflict("vendor already exists");
      }

      validateBody.userName =
        validateBody.firstName.slice(0, 4) +
        validateBody.mobileNumber.slice(-4);
      const pawd =
        validateBody.firstName + "@" + validateBody.mobileNumber.slice(0, 5);
      await common.sendOTP(
        validateBody.email,
        "vendor default credentials",
        `'email:${validateBody.email},
                                                                                      password:${pawd}`
      );
      validateBody.password = bcrypt.hashSync(pawd, 10);
      await createUser(validateBody);
      return res.json(new response("vendor successfully created"));
    } catch (error) {
      return next(error);
    }
  }

  async getData(req, res, next) {
    try {
      let userResult = await finduser(
        { _id: req.userId },
        {
          password: 0,
          _id: 0,
          otpVerified: 0,
          userType: 0,
          status: 0,
          createdAt: 0,
          updatedAt: 0,
        }
      );

      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      return res.json(new response(userResult, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  async getAllvendors(req, res, next) {
    try {
      const admins = await findID({ _id: req.userId });
      // console.log(admins)

      if (!admins) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      } else if (admins.status === status.BLOCK) {
        throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
      }
      let userResult = await findAndPageinate({
        $and: [{ userType: userType.VENDOR }, { status: status.ACTIVE }],
      });

      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      return res.json(new response(userResult, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }
}

export default new adminController();
