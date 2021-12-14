const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikesSchema = new Schema(
  {
    group: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    institution:{
      type: String,
      required: true,
    }
  },
  { collection: "likes" }
);

const Likes = mongoose.model("Likes", LikesSchema);

module.exports = Likes;
