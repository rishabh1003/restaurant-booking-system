import vendorModel from '../../../models/vendor'
import categoryModel from '../../../models/category'
import productModel from '../../../models/product'
import userModel from '../../../models/user'


const ProductS={
    findID:async(query)=>{
        return await vendorModel.findById(query);
    },

    findID2:async(query)=>{
        return await categoryModel.findById(query);
    },

    findID3:async(query)=>{
        return await userModel.findById(query);
    },

    findID4: async(query)=>{
       return await productModel.findById(query);
    },

    createUser: async (insertObj) => {
        return await productModel.create(insertObj);
      },

      deleteProduct: async(id)=>{
         return await productModel.findByIdAndDelete({_id:id}); 
      },

      paginate: async (query)=>{
        try {
            const options={
                page:parseInt(1),
                limits:parseInt(5)
            }

            const data = await productModel.paginate(query,options)
            return data;
        } catch (error) {
              console.log(error)
              return error;
        }
      },


      populate: async (id)=>{
          return productModel.findOne({_id:id}).populate({
            path:"categoryId",
            populate:{
                path:"shopId"
            }
          })
      },

      update: async(id,obj)=>{
        return await productModel.updateOne(id,obj,{new:true});
      }

      
}

module.exports ={ProductS}