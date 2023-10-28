import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
import paginate from "mongoose-paginate-v2";
const Userschema= new mongoose.Schema({
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref:"category"
    },
    product:{
        type:String
    },

   rates:{
   type:[Number]
   },

   likes:[{

    type:mongoose.Types.ObjectId,
    ref:"user"

   }],

    Pimage:{
        type:String
    }
},{timestamps:true});
Userschema.plugin(paginate)
Userschema.plugin(aggregatePaginate);
export default mongoose.model('product',Userschema,"product");
