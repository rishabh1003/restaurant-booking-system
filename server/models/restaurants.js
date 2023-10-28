import Mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
const locationSchema = new Mongoose.Schema({
    name: { type: String },
    address: { type: String },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default:[0,0]
        
      }
    },
    image:{
        type:String
    },

  vendormail: {
    type: String
  }, vendorname: {
    type: String
  }

  },{
    timestamps:true
  });

locationSchema.plugin(aggregatePaginate);
locationSchema.index({location:"2dsphere"})

  const location = Mongoose.model('Location',locationSchema,'Location');

  module.exports=location;