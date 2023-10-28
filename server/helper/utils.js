import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken';
import Config from "config";
import cloudinary from 'cloudinary';
cloudinary.config({
  cloud_name:"dnkyiwf6v",
  api_key:"858887765751835",
  api_secret:"t3e6-fLUxNmRXN-3CtK9ZbvHHlE"
})

module.exports={
     getOTP:()=>{
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        return otp;
     },

     sendOTP: async(email,subject,html) => {
        let transporter = nodemailer.createTransport({
          host:"smtp.gmail.com",
          port:465,
          service: "gmail",
          auth: {
            user: "gupta.rishabh1003@gmail.com",
            pass: "ftafhrclanvcxelb",
          },
        });
        let mailOptions = {
          from: "gupta.rishabh1003@gmail.com",
          to: email,
          subject: subject,
          text:html,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            // console.log("OTP sent");
          }
        });
      }, 
      getToken: async (payload) => {
        var token = jwt.sign(payload, Config.get('jwtsecret'), { expiresIn: "24h" })
        return token;
      },

      getimageUrl:async(files)=>{
        const result= await cloudinary.v2.uploader.upload(files,(err)=>{
          
  

          if(err){
            console.log(err);
            return
          }

        })

        return result.secure_url;
}
}