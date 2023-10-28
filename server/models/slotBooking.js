import mongoose from "mongoose";

const slots= new mongoose.Schema({

    date:{
      type:String 
    },

    slot:[
        {

            startTime:{
                type:String
            },
            endTime:{
                type:String
            },

            is_booked:{
                type:Boolean,
                default:true
            },
            
        }
    ],

    // day:{ 
    //   type:String
    // },


    shopId:{
        type:mongoose.Types.ObjectId,
        ref:"Location"
    },
},{
    timestamps:true
})


export default mongoose.model('slot',slots,'slot');