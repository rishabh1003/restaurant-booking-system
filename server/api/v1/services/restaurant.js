import vendorModel from "../../../models/vendor";
import shopmodel from "../../../models/restaurants"

import status from '../../../enum/status';
import userType from "../../../enum/userType";

const restaurantS ={
    check2: async(Query)=>{
        return await shopmodel.findOne(Query);
      },  
      findID:async(query)=>{
        return await vendorModel.findById(query);
      },
      createUser: async (insertObj) => {
        return await shopmodel.create(insertObj);
      },
      deletes: async(query)=>{
       return await shopmodel.findByIdAndDelete(query);
      },
      updatedShop: async(query,obj)=>{
        return await shopmodel.findByIdAndUpdate(query,obj);
      },

      geonear: async(query)=>{
        return await shopmodel.aggregate(query);
      }

}
module.exports ={restaurantS};