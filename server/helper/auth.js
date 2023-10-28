import jwt from 'jsonwebtoken';
import Config from 'config';
import status from '../enum/status';


module.exports={
    auth:async(req,res,next)=>{
        try {
          const token=req.headers['authorization'];
          // console.log(token)
        if(!token){
          return res.status(404).json({responseCode: 404,
            responseMessage: "token not found",})
        }

        // const userToken= await user.find({_id:token._id});

        // if (userToken){
          jwt.verify(token,Config.get('jwtsecret'),async(err,result)=>{
               if (err){
                return res.status(501).json({
                  responseCode:501,
            responseMessage: "access denied"
                })
               }

              //  const result2= await findOne({_id:result._id});

              //   if(!result2){
              //     return res.status(404).json({
              //       responseCode: 404,
              //       responseMessage: "USER NOT FOUND"
              //     })
              //  } else if(result2.status == "BLOCKED"){
              //   return res.status(403).json({
              //     responseCode: 403,
              //     responseMessage: "You have been blocked by admin ."
              //   })
              //  }
              //  else if(result2.status == "DELETED") {
              //   return res.status(402).json({
              //     responseCode: 402,
              //     responseMessage: "Your account has been deleted by admin ."
              //   })
              //  }
               if(result && result._id){
                req.userId=result._id;
                return next();
               }
          })
        // }
        } catch (error) {
          console.log(error);
      res.status(501).json({
        responseCode: 501,
        responseMessage: "internal server error",
        responseResult: error,
      });
        }
  },


}


