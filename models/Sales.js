const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const SalesSchema = new Schema(
  {
    hashed_token: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    institution:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    }
  },
  { collection: "sales" }
);

const Sales = mongoose.model("Sales", SalesSchema);

module.exports = Sales;
