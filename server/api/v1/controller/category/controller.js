import Joi from "joi";
import  path from "path";
import apiError from '../../../../helper/apiError';
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import status from '../../../../enum/status'
import userType from "../../../../enum/userType";
import common from "../../../../helper/utils";


import bcrypt from "bcryptjs";

//**************services******************************** */
import {categoryS} from '../../services/categoryServices'

const {findID,findID2,createUser,deletes,findall}= categoryS;


//******************************************************* */


export class category{
     

    async createCategory(req,res,next){
        const validationSchema = Joi.object({
            shopId: Joi.string().required(),
            category: Joi.string().required(),
        });


        try {
            const validateBody = await validationSchema.validateAsync(req.body);

            const {shopId,category}=validateBody;

            const vendor = await findID2({ _id: req.userId });
            // console.log(admins)
            //  console.log(vendor);
            if (!vendor) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            } else if (vendor.status === status.BLOCK) {
                throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);

            }

            const shop= await findID({_id:shopId});

            if(!shop){
                throw apiError.notFound(responseMessage.NOT_FOUND);
            }

            
            const result=await createUser(validateBody);
           
            return res.json(new response(result,responseMessage.CATEGORY_CREATED));



            
        } catch (error) {
            return next(error);
        }
    }
     async updateCategory(req,res,next){
        
     }
    async deletecategory(req,res,next){
        

        try {
           
            const vendor = await findID2({ _id: req.userId });
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
           return res.json(new response(result,"category deleted successfuly "));

    }catch(error){
        return next(error)
    }
}


   async findCategory(req,res,next){
    try {
           
        const vendor = await findID2({ _id: req.userId });
        // console.log(admins)
        //  console.log(vendor);
        if (!vendor) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        } else if (vendor.status === status.BLOCK) {
            throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);

        }

        if(!req.query.id){
            throw apiError.invalid(responseMessage.invalid);
        }
        console.log(req.query.id)
        const result= await findall([{
            $match:{
               $expr: {shopId:req.query.id}
            }
        }],(error)=>{
            console.log(error);
        });
              
        return res.json(new response(result,"all categories shown"));
       

}catch(error){
    return next(error)
}
   }
}
export default new category;