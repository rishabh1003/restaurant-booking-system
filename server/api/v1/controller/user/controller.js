import Joi from "joi";
import apiError from '../../../../helper/apiError';
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import status from '../../../../enum/status'
import userType from "../../../../enum/userType";
import common from "../../../../helper/utils";
import { userServices } from "../../services/userServices"
import bcrypt from "bcryptjs";
const { checkUserExists, createUser, check, update ,finduser,findID,findones} = userServices;

// import Express from "express";
// const app = Express();

// app.use(Express.json());
export class userController {


  async userSignUp(req, res, next) {
    const validationSchema = Joi.object({
      firstName: Joi.string().required(),
      surName: Joi.string().required(),
      countryCode: Joi.string().required(),
      mobileNumber: Joi.string().required(),
      dateOfBirth: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),

    });
    try {
      const validateBody = await validationSchema.validateAsync(req.body);
      const { email, mobileNumber, firstName } = validateBody;
      validateBody.otp = common.getOTP();
      console.log(typeof (validateBody.otp));
      validateBody.otpExpireTime = Date.now() + 180000;
      validateBody.userName = firstName.slice(0, 4) + mobileNumber.slice(-4);
      validateBody.password = bcrypt.hashSync(validateBody.password);
      // const {email}=req.body;
      const userInfo = await checkUserExists(email, mobileNumber);


      if (userInfo) {
        if (userInfo.email == req.body.email) {
          throw apiError.conflict(responseMessage.EMAIL_EXIST);
        }
        else if (userInfo.mobileNumber == validateBody.mobileNumber) {
          throw apiError.conflict(responseMessage.MOBILE_ALREADY_EXIST);
        }
      }

      else if (req.body.password !== req.body.confirmPassword) {
        throw apiError.conflict('Password and confirm password does not match');
      }

      //  console.log(validateBody)
      await common.sendOTP(req.body.email, "otp verification ", `<p>your otp is ${validateBody.otp}</p>`);

      await createUser(validateBody);

      return res.status(201).json({
        responsecode: 201,
        responseMesssage: "user signup successfull"
      })

    } catch (error) {
      console.log("Error", error)
      return next(error);
    }


  }



  async otpVerification(req, res, next) {
    const validateResult = Joi.object({
      email: Joi.string().required(),
      otp: Joi.string().required()
    })

    try {
      const validateBody = await validateResult.validateAsync(req.body);

      const userInfo = await check(validateBody.email);

      if (!userInfo) {
        throw apiError.notFound("user not found");
      }

      if (validateBody.otp === userInfo.otp) {
        if (userInfo.otpExpireTime < Date.now()) {
          throw apiError.badRequest(responseMessage.OTP_EXPIRED)
        } else {
          await update({ email: userInfo.email }, { $set: { otpVerified: true }, $unset: { otp: 1, otpExpireTime: 1 } })
          throw res.status(200).json({
            responsecode: 200,
            responseMessage: "otp verified successfully "
          })
        }
      } else {
        throw apiError.badRequest(responseMessage.INVALID_OTP);
      }


    } catch (error) {
      console.log("Error", error)
      return next(error);
    }
  }

  async emailVerify(req,res,next){
    try {
      const email=req.params.email;
      console.log(email);
      const query={email:email,email_verified:{$ne:true}}
      const obj={$set:{email_verified:true}};
      const verify= await findones(query,obj);
        console.log(verify);
        if(!verify){
          throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }

        return res.json(new response("email verified successfully "));
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    let validationSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    })
    try {
      let validateBody = await validationSchema.validateAsync(req.body);
      const { email, password } = validateBody;

      const userResult = await check(email);

      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      } else if (userResult.status == status.BLOCK) {
        throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
      }

      const ismatch = await bcrypt.compare(password, userResult.password);

      if (!ismatch) {
        throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
      }

      if (userResult.otpVerified === false) {
        throw apiError.unauthorized("otp not verified please verify then login")
      }

      const token= await common.getToken({_id:userResult._id,email:userResult.email,userType:userResult.userType});
   console.log(token)
     return res.json(new response(token,responseMessage.LOGIN))

    } catch (error) {
          return next(error);
    }

  }

  async getData(req,res,next){
        try {
          let userResult = await finduser({_id:req.userId},{password:0,_id:0,otpVerified:0,userType:0,status:0,createdAt:0,updatedAt:0});

          if (!userResult){
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
          }
          return res.json(new response(userResult,responseMessage.USER_DETAILS))
        } catch (error) {
          return next(error);
        }
  }

  async resendOTP(req,res,next){
    var validationSchema = Joi.object({
      email: Joi.string().required(),
      
    });
    try {
      const validatedBody = await validationSchema.validateAsync(req.body);
      const {email}=validatedBody;

     var userResult= await check(email);

      if (!userResult) {
      throw apiError.notFound(responseMessage.USER_NOT_FOUND);
  } 

      validatedBody.otp= common.getOTP();
      validatedBody.otpExpireTime = Date.now() + 180000;
      await common.sendOTP(email, "otp verification ", `<p>your otp is ${validatedBody.otp}</p>`);
      await common.sendsms(`your otp is ${validatedBody.otp} send by rishabh`)
      const updatedResult=await update({email:email},{$set:{otp:validatedBody.otp,otpExpireTime:validatedBody.otpExpireTime}})
      return res.json(new response(updatedResult,responseMessage.OTP_SEND));
         
      
    } catch (error) {
      return next(error);
    }
  }


  async forgetPassword(req,res,next){
    const validationSchema = Joi.object({
     
      email: Joi.string().required(),
      otp:Joi.string().required(),
      newpassword:Joi.string().required(),
      confirmNewPassword: Joi.string().required(),

    });

    try {
      const validateBody = await validationSchema.validateAsync(req.body);

      const {email,newpassword,confirmNewPassword,otp}=validateBody;

        const user= await check(email);

        if(!user){
          throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }

        if(user.otp===otp){
          if(newpassword===confirmNewPassword){
           if(user.otpExpireTime<Date.now()){
            throw apiError.badRequest(responseMessage.OTP_EXPIRED)
           } else{
              const insertpwd= bcrypt.hashSync(newpassword);
              await findones({email:user.email,status:{$ne:status.BLOCK}},{$set:{password:insertpwd},$unset:{otp:1,otpExpireTime:1}});
              return res.json(new response("password changed successfully"));
           }
          }else{
            throw apiError.invalid("type correct password");
          }
        }else{
          throw apiError.badRequest(responseMessage.INVALID_OTP);
        }
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req,res,next){
    const validationSchema = Joi.object({
     
      
      password:Joi.string().required(),
      newpassword:Joi.string().required(),
      confirmNewPassword: Joi.string().required(),

    });

    try {
      const validateBody = await validationSchema.validateAsync(req.body);
        
       const {password,newpassword,confirmNewPassword}=validateBody;

       const user= await findID({_id:req.userId});

       if (!user){
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
       }

       if(password===newpassword){
        throw apiError.conflict("newpassword is similar to old password");

       }

       if(newpassword===confirmNewPassword){
           const insertpwd=bcrypt.hashSync(newpassword);
           await update({email:user.email},{$set:{password:insertpwd}});
          
           return res.json(new response("password changed successfully"));
          }

    } catch (error) {
      return next(error);
    }
  }

  async editprofile(req,res,next){
    const validationSchema = {
      firstName: Joi.string().optional(),
      surName: Joi.string().optional(),
      countryCode: Joi.string().optional(),
      mobileNumber: Joi.string().optional(),
      email: Joi.string().optional(),
      dateOfBirth: Joi.string().optional(),
      address: Joi.string().optional(),
      
  };

  try {
    let validatedBody = await Joi.validate(req.body, validationSchema);
     let userResult= await findID({_id:req.userId});

     if (!userResult) {
      throw apiError.notFound(responseMessage.USER_NOT_FOUND);
  }

    const upadteuser= await update({email:userResult.email},{$set:validatedBody})

    return res.json(new response(upadteuser, responseMessage.PROFILE_UPDATED));

      
  } catch (error) {
    return next(error);
  }
  }

async sendsms(req,res,next){
  const validationSchema = {

    mobileNumber: Joi.string().required(),
  };
      try {
      let validatedBody = await Joi.validate(req.body, validationSchema);
      const {mobileNumber}=validatedBody;
      
      validate

      
           


      } catch (error) {
        
      }
}




}


export default new userController();