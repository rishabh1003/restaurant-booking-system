import Joi from "joi";
import  path from "path";
import apiError from '../../../../helper/apiError';
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import status from '../../../../enum/status'
import userType from "../../../../enum/userType";
import common from "../../../../helper/utils";


//******************Services***************** */

import {ProductS} from '../../services/productservices'
import { throws } from "assert";

const {findID,findID2,createUser,paginate,populate,findID3,findID4,update}=ProductS;

//******************************************* */


export class productController{

    async createProduct(req,res,next){
        const validationSchema = Joi.object({
            categoryId: Joi.string().required(),
            product: Joi.string().required(),
            half: Joi.string().required(),
            full: Joi.string().required(),
            image: Joi.string().required(),

        });


        try {
            const validateBody = await validationSchema.validateAsync(req.body);

            const {categoryId,product,half,full,image}=validateBody;

            const vendor = await findID({ _id: req.userId });
            // console.log(admins)
            //  console.log(vendor);
            if (!vendor) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            } else if (vendor.status === status.BLOCK) {
                throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);

            }

            const category= await findID2({_id:categoryId});

            if(!category){
                throw apiError.notFound(responseMessage.NOT_FOUND);
            }
              
            const obj={
                categoryId:categoryId,
                product:product,
                rates:[parseInt(half),parseInt(full)],
                Pimage:await common.getimageUrl(req.body.image)

            }

            
            const result=await createUser(obj);
           
            return res.json(new response(result,responseMessage.CATEGORY_CREATED));



            
        } catch (error) {
            return next(error);
        }
    }


    async deleteProduct(req,res,next){
        try {
            const vendor = await findID({ _id: req.userId });

            if (!vendor) {
              throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            } else if (vendor.status === status.BLOCK) {
              throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
            }

            const id = req.query.id;

            if (!id) {
              throw apiError.invalid(responseMessage.invalid);
            }

            const content = await this.deleteProduct(id); 

             return res.json(
               new response(content, "dleted successfully")
             );
        } catch (error) {
            return next(error);
        }


    }


   async  getAllProduct(req,res,next){

    try {

         const vendor = await findID({ _id: req.userId });
         if (!vendor) {
           throw apiError.notFound(responseMessage.USER_NOT_FOUND);
         } else if (vendor.status === status.BLOCK) {
           throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
         }

         const products = await paginate({});

         if(!products){
            throw apiError.notFound(responseMessage.PRODUCT_NOT_FOUND);
         }
   return res.json(new response(products,responseMessage.SUCCESS))
         
    } catch (error) {
       return next(error);
    }
      

       
   }



   async getProductwithcategoryAndShop(req,res,next){
       const validationSchema = Joi.object({
        id: Joi.string().required()
       });

       try {
             const value = await validationSchema.validateAsync(req.query);
         const vendor = await findID({ _id: req.userId });
         if (!vendor) {
           throw apiError.notFound(responseMessage.USER_NOT_FOUND);
         } else if (vendor.status === status.BLOCK) {
           throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);
         }

   
        
         const productset= await populate(value.id);
         
         if(!productset){
              throw apiError.notFound(responseMessage.PRODUCT_NOT_FOUND);
         }

          return res.json(new response(productset, responseMessage.SUCCESS));

           
       } catch (error) {
          return next(error);
       }
   }



   async likedAndDisliked(req,res,next){
            const validationSchema = Joi.object({
              productid: Joi.string().required(),
           
            });
            
            try {
              const value = await validationSchema.validateAsync(req.query);




              const user= await findID3({_id:req.userId});
                 
                 if(!user){
                  throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                 }

                 const product= await findID4({_id:value.productid});

                 if(!product){
                  throw apiError.notFound(responseMessage.PRODUCT_NOT_FOUND);
                 }
                    const {id}= user;
                 if(product.likes.includes(id)){
                   await update({_id:value.productid},{$pull:{likes:{$in:[id]}}});
                   return res.json(new response("user disliked the product"));

                 }else{
                  await update({_id:value.productid},{$addToSet:{likes:id}});

                  return res.json(new response("user liked the product"));
                 }

               
            } catch (error) {
              return next(error);
            }
   }
}

export default new productController;