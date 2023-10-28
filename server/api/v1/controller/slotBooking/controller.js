import Joi from "joi";
import  path from "path";
import apiError from '../../../../helper/apiError';
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import status from '../../../../enum/status'
import userType from "../../../../enum/userType";
import common from "../../../../helper/utils";
import { zonedTimeToUtc } from "date-fns-tz"; 
//*******************services****************** */
import {slots} from "../../services/slotBooking"
const {findID,create,findID2,operation}= slots;
//********************************************** */

export class slotBooking{
    

  async createSlot(req,res,next){
    
      
    function createTimeSlots() {
        var startTime = new Date();
        startTime.setHours(9, 0, 0, 0); // Set the start time to midnight
      
        var endTime = new Date();
        endTime.setHours(17, 0, 0, 0); // Set the end time to 11:59:59.999 PM
      
        var timeSlots = [];
      
        while (startTime <= endTime) {
          var timeSlot = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });     
            timeSlots.push(timeSlot);
         
          startTime.setMinutes(startTime.getMinutes() + 15); // Increment time by 15 minutes
        }
      
        return timeSlots;
      }
        let validateSchema= Joi.object({
            shopId:Joi.string().required(),
            start:Joi.string().required(),
            end:Joi.string().required(),
            
        })

        try {
           const value= await validateSchema.validateAsync(req.body) ;
            
           const vendor= await findID({_id:req.userId});
           if (!vendor) {
            throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
        } else if (vendor.status === status.BLOCK) {
            throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);

        }
        
         let {shopId,start,end}=value;
           
         
          var startDate=new Date(start);
            
          var endDate=new Date(end);
        
        // console.log(startDate+" "+endDate)
          // console.log(typeof(startDate.getDay()))
        
          while(startDate<=endDate){
        
           if(startDate.getDay()===1 || startDate.getDay()===4){
              startDate.setDate(startDate.getDate()+1)
             //continue;
           }else{
             
            //  (startDate.getDate(),startDate.getDay())

             let timeSlots = createTimeSlots();

          let arr=[];

          for(let i=0 ;i<(timeSlots.length)-1;i++){
            if(timeSlots[i]==='01:00 pm' || timeSlots[i]==='01:15 pm'||timeSlots[i]==='01:30 pm' || timeSlots[i]==='01:45 pm'){
             
              continue;
            }else{

              
               let obj={};

               obj.startTime=timeSlots[i];
               obj.endTime=timeSlots[i+1];
               obj.is_booked=true;

               arr.push(obj);
            }
           
        }

           let obj1={
            shopId:shopId,
            slot:arr,
            date:startDate
            
           }

           
          await create(obj1);



              startDate.setDate(startDate.getDate()+1)
           }
           
          }
          
        
         
          
    
          
         return res.json(new response("slots created"))

        } catch (error) {
            return next(error);
        }
  }



  async bookSlot(req,res,next){


    try {

      const user = await findID2({_id:req.userId});
     if (!user) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        } else if (user.status === status.BLOCK) {
            throw apiError.notFound(responseMessage.USER_BLOCKED_ADMIN);

        }


        

     

        
    } catch (error) {
      return next(error)
    }
  }

}

export default new slotBooking;


// function createTimeSlots() {
//   var startTime = new Date();
//   startTime.setHours(9, 0, 0, 0); // Set the start time to midnight

//   var endTime = new Date();
//   endTime.setHours(17, 0, 0, 0); // Set the end time to 11:59:59.999 PM

//   var timeSlots = [];

//   while (startTime <= endTime) {
//     var timeSlot = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });     
//       timeSlots.push(timeSlot);
   
//     startTime.setMinutes(startTime.getMinutes() + 15); // Increment time by 15 minutes
//   }

//   return timeSlots;
// }

// var timeSlots = createTimeSlots();

// // console.log(timeSlots)

// for(let i=0 ;i<(timeSlots.length)-1;i++){
//     if(timeSlots[i]=='01:00 PM' || timeSlots[i]=='01:15 PM'||timeSlots[i]=='01:30 PM' || timeSlots[i]=='01:45 PM'){
//      continue;
//     }else{
//        console.log(timeSlots[i]+"--"+timeSlots[i+1]);
//     }
   
// }


// function days(){
//   var startDate=new Date('July 8, 2023');
//     startTime.setHours(9, 0, 0, 0);
//   var endDate=new Date('July 20,2023');

// // console.log(startDate+" "+endDate)
//   // console.log(typeof(startDate.getDay()))

//   while(startDate<=endDate){

//    if(startDate.getDay()===1 || startDate.getDay()===4){
//       startDate.setDate(startDate.getDate()+1)
//      //continue;
//    }else{
     
//      console.log(startDate.getDate(),startDate.getDay())
//       startDate.setDate(startDate.getDate()+1)
//    }
   
//   }
  
// }