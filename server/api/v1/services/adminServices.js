import userModel from "../../../models/vendor";
import status from '../../../enum/status';
import userType from "../../../enum/userType";


const userServices ={
    checkUserExists: async (email,mobileNumber) => {
        let query = {$and:[{status:{$ne:status.DELETE}},{$or:[{mobileNumber:mobileNumber},{email:email}]},{status:{$ne:status.BLOCK}}] }
        return await userModel.findOne(query);
      },
      createUser: async (insertObj) => {
        return await userModel.create(insertObj);
      },

      check: async(email)=>{
        return await userModel.findOne({email:email})
      },

      update: async(query,updateobj)=>{
        return await userModel.updateOne(query,updateobj,{new:true})
      },

      finduser:async (...args)=>{
        return await userModel.findById(args[0],args[1]);
      },

      findID:async(query)=>{
        return await userModel.findById(query);
      },

      findones:async(query,obj)=>{
        return await userModel.findOneAndUpdate(query,obj,{new:true});
      },
      check2: async(Query)=>{
        return await userModel.findOne(Query);
      },
      check3: async(Query)=>{
        return await userModel.find(Query);
      },

      findAndPageinate: async(query)=>{
          try {

            const page=1;
            const limit=5;
          const  options={
              page: page,
              limit: limit
            }

          return await userModel.paginate(query,options);

          } catch (error) {
            console.log(error)
          }
      }

      
}

module.exports ={userServices};