import categoryModel from "../../../models/category"
import shopmodel from "../../../models/restaurants"
import vendorModel from "../../../models/vendor";

const categoryS={
    findID:async(query)=>{
        return await shopmodel.findById(query);
      },
    findID2:async(query)=>{
        return await vendorModel.findById(query);
    },
    findID3:async(query)=>{
        return await categoryModel.findById(query);
    },
    createUser: async (insertObj) => {
        return await categoryModel.create(insertObj);
      },
      deletes: async(query)=>{
        return await categoryModel.findByIdAndDelete(query);
       },

       findall: async(query)=>{
        return await categoryModel.aggregate(query);
       }
}

module.exports={categoryS};