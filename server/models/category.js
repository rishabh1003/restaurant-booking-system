import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


const Userschema= new mongoose.Schema({
    shopId:{
        type: mongoose.Types.ObjectId,
        ref:"Location"
    },
    category:{
        type:String
    }
},{timestamps:true});

Userschema.plugin(aggregatePaginate);
export default mongoose.model('category',Userschema,"category");

