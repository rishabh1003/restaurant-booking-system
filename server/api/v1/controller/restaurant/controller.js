import Joi from "joi";
import  path from "path";
import apiError from '../../../../helper/apiError';
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import status from '../../../../enum/status'
import userType from "../../../../enum/userType";
import common from "../../../../helper/utils";


import bcrypt from "bcryptjs";


//********services************** */
import {restaurantS} from "../../services/restaurant";

const{findID,check2,createUser,deletes,updatedShop,geonear}=restaurantS;

//********************************* */


export class shops{
    async createshop(req, res, next) {
        const validationSchema = Joi.object({
            name: Joi.string().required(),
            longitude: Joi.string().required(),
            address: Joi.string().required(),
            latitude: Joi.string().required(),

            image:Joi.string().required()



        });

        try {
            const validateBody = await validationSchema.validateAsync(req.body);

            const vendor = await findID({ _id: req.userId });
            // console.log(admins)
            //  console.log(vendor);
            if (!vendor) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            } else if (vendor.status === status.BLOCK) {
                throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);

            }

            const shop = await check2({ address:validateBody.address });
            if (shop) {
                throw apiError.conflict('shop already exists');
            }

        //    validateBody.vendormail=vendor.email;
        //    validateBody.vendorname=vendor.firstName;
        //     const long=parseFloat(validateBody.longitude);
        //     const lat=parseFloat(validateBody.latitude);
        //    validateBody.loc.coordinates=[long,lat];
        //     validateBody.image=common.getimageUrl(validateBody.image);

        const obj={
            name:validateBody.name,
            address:validateBody.address,
            loc:{
                coordinates:[parseFloat(validateBody.longitude),parseFloat(validateBody.latitude)]
            },
            image: await common.getimageUrl(req.body.image),
            vendormail:vendor.email,
            vendorname:vendor.firstName
        }
          
            const result=await createUser(obj);
            return res.json(new response(result,"shop successfully created"));




        } catch (error) {
            return next(error);
        }
    }


    async deleteShop(req,res,next){
        try {
            const vendor = await findID({ _id: req.userId });
            // console.log(admins)
            //  console.log(vendor);
            if (!vendor) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            } else if (vendor.status === status.BLOCK) {
                throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);

            }

            const id=req.query.id;

            if(!id){
                throw apiError.invalid(responseMessage.invalid);
            }

           const result= await deletes({_id:id});
            return res.json(new response(result,"shop successfully created"));
        } catch (error) {
            return next(error);
        }
    }

    async updateshop(req,res,next){
        try {
            
                const vendor = await findID({ _id: req.userId });
                // console.log(admins)
                //  console.log(vendor);
                if (!vendor) {
                    throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                } else if (vendor.status === status.BLOCK) {
                    throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
    
                }
            
                const id=req.query.id;

                if(!id){
                    throw apiError.invalid(responseMessage.invalid);
                }


                const update= await updatedShop({_id:id},{$set:req.body});
                return res.json(new response("shop updated successfully"));

        } catch (error) {
            return next(error)
        }
    }

    async getData(req,res,next){

        
        const validationSchema = Joi.object({
            
            longitude: Joi.string().required(),
            latitude: Joi.string().required()
         });

        try {
            const validateBody = await validationSchema.validateAsync(req.body);
            const {longitude,latitude}=validateBody;
            const vendor = await findID({ _id: req.userId });
                if (!vendor) {
                    throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                } else if (vendor.status === status.BLOCK) {
                    throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
    
                }

            //  console.log(vendor);
               

            const geoNear= await geonear([
                {
                    $geoNear:{
                        near:{
                            type:"Point",
                            coordinates:[parseFloat(longitude),parseFloat(latitude)],
                        },

                        key:"location",
                        distanceField:"dist-calculated",
                        maxDistance:parseFloat(1000)*1609,
                        spherical:true
                    }
                }

            ])

            console.log(geoNear)
            if(!geoNear){
                throw apiError.badRequest(responseMessage.NOT_FOUND)
            }

            return res.status(200).json({ data: geoNear, message: "Shops searched successfully" });

        }catch(error){
            return next(error)
        }
    }
}

export default  new shops;