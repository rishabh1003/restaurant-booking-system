import Joi from "joi";
import  path from "path";
import apiError from '../../../../helper/apiError';
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import status from '../../../../enum/status'
import userType from "../../../../enum/userType";
import common from "../../../../helper/utils";
import { userServices } from "../../services/adminServices"
import bcrypt from "bcryptjs";
import userModel from "../../../../models/vendor"
import {Types} from 'mongoose'
import fs from 'fs'
import { get } from "config";

const { check2, findID, createUser ,check,finduser,update,findones} = userServices;


export class vendorController {
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
    
        //   if (userResult.otpVerified === false) {
        //     throw apiError.unauthorized("otp not verified please verify then login")
        //   }
    
          const token = await common.getToken({ _id: userResult._id, email: userResult.email, userType: userResult.userType });
          console.log(token)
          return res.json(new response(token, responseMessage.LOGIN))
    
        } catch (error) {
          return next(error);
        }
    
      }


      async viewprofile(req,res,next){
        try {
            let userResult = await finduser({ _id: req.userId }, { password: 0, _id: 0, otpVerified: 0, userType: 0, status: 0, createdAt: 0, updatedAt: 0 });
      
            if (!userResult) {
              throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            return res.json(new response(userResult, responseMessage.USER_DETAILS))
          } catch (error) {
            return next(error);
          }
      }


      async resendOTP(req, res, next) {
        var validationSchema = Joi.object({
          email: Joi.string().required()
        })
        try {
          const validatedBody = await validationSchema.validateAsync(req.body);
          const { email } = validatedBody;
    
          var userResult = await check2({email:email},{userType:userType.VENDOR});
    
          if (!userResult) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
          }
    
          validatedBody.otp = common.getOTP();
          validatedBody.otpExpireTime = Date.now() + 180000;
          await common.sendOTP(email, "otp verification ", `<p>your otp is ${validatedBody.otp}</p>`);
    
          const updatedResult = await update({ email: email }, { $set: { otp: validatedBody.otp, otpExpireTime: validatedBody.otpExpireTime } })
          return res.json(new response(updatedResult, responseMessage.OTP_SEND));
    
    
        } catch (error) {
          return next(error);
        }
      }

      async resetpassword(req,res,next){
        const validationSchema = Joi.object({
            password: Joi.string().required(),
            newpassword: Joi.string().required(),
            confirmNewPassword: Joi.string().required()      
          });
      
          try {
            const validatedBody = await validationSchema.validateAsync(req.body);
            
      
            
      
            const user = await findID({ _id: req.userId });
      
            if (!user) {
              throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
      
            if ( validatedBody.password ===  validatedBody.newpassword) {
              throw apiError.conflict("newpassword is similar to old password");
      
            }
      
            if ( validatedBody.newpassword ===  validatedBody.confirmNewPassword) {
              const insertpwd = bcrypt.hashSync( validatedBody.newpassword);
              await update({ email: user.email }, { $set: { password: insertpwd } });
      
              return res.json(new response("password changed successfully"));
            }
      
          } catch (error) {
            return next(error);
          }
      }

      async editprofile(req,res,next){
        const validationSchema = Joi.object({
            firstName: Joi.string().optional(),
            surName: Joi.string().optional(),
            countryCode: Joi.string().optional(),
            mobileNumber: Joi.string().optional(),
            email: Joi.string().optional(),
            dateOfBirth: Joi.string().optional(),
            address: Joi.string().optional(),
      
          })
        try {
            const validateBody= await validationSchema.validateAsync(req.body);
            let userResult = await findID({ _id: req.userId });

      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }

      if(validateBody.email && validateBody.mobileNumber){
        const change=  await check2({$and:[

            {$or:[
             {email:validateBody.email},
             {mobileNumber:validateBody.mobileNumber}
            ]},
    
            {_id:{$ne:userResult._id}},
            {Status:{$ne:"Deleted"}},
          ]})


          if(change){
            if(change.email===validateBody.email){
                throw apiError.badRequest(responseMessage.EMAIL_ALREADY_EXIST)
          }
      
          else if(change.mobile===validateBody.mobileNumber){
            throw apiError.badRequest(responseMessage.MOBILE_ALREADY_EXIST)
          }
          }

          await common.sendOTP(validateBody.email,"edit profile",`profile edited successfully`)
          await findones({_id:userResult._id},{$set:req.body});
          return res.json(new response("profile edited successfully"));
      }else if (validateBody.email && !validateBody.mobileNumber){
            const change = await check2({
                $and: [
    
    
                  {email: validateBody.email },
    
                  { _id: { $ne: userResult._id } },
                  { Status: { $ne: "Deleted" } },
                ]
              })

              if(change){
                if(change.email===validateBody.email){
                    throw apiError.badRequest(responseMessage.EMAIL_ALREADY_EXIST)
              }
            }
            await common.sendOTP(validateBody.email,"edit profile",`profile edited successfully`)
            await findones({_id:userResult._id},{$set:req.body});
            return res.json(new response("profile edited successfully"));

      }else if(validateBody.mobileNumber && !validateBody.email){
        const change = await check2({
            $and: [


                {mobileNumber:validateBody.mobileNumber},

              { _id: { $ne: userResult._id } },
              { Status: { $ne: "Deleted" } },
            ]
          })

          if(change){
            if(change.mobile===validateBody.mobileNumber){
                throw apiError.badRequest(responseMessage.MOBILE_ALREADY_EXIST)
              }
        }


        await common.sendOTP(validateBody.email,"edit profile",`profile edited successfully`)
            await findones({_id:userResult._id},{$set:req.body});
            return res.json(new response("profile edited successfully"));

          
      }else if(!validateBody.mobileNumber && !validateBody.email){
        await common.sendOTP(validateBody.email,"edit profile",`profile edited successfully`)
        await findones({_id:userResult._id},{$set:req.body});
        return res.json(new response("profile edited successfully"));
      }
        } catch (error) {
            return next(error);
        }
      }


      async imageUpload(req,res,next){
            try {
                let userResult = await findID({ _id: req.userId });

                if (!userResult) {
                  throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                }  
                 const file=req.body.image;
                
                    const geturl= await common.getimageUrl(file);

                    if(!geturl){
                      throw apiError.badRequest("image required"); 
                    }
                await update({email:userResult.email},{$set:{ profilePic:geturl}});
                return res.json(new response("profile photo uploaded successfully"));
            } catch (error) {
                return next(error);
            }
      }


      //************************************** shop created by vendor*************************** */
}

export default new vendorController;
