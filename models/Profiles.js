const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age:Number,
    gender: String,
    password: {
      type: String,
      // required: false,
    },
    status: {
      type: String,
      enum: ["Online", "Offline", "Available", "Busy", "Slepping..."],
      default: "Offline",
    },
    moderator: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "Planet Rocket",
    },
    institution: {
      type: String,
      default: "",
    },
    curso: {
      type:String,
      default:""
    },
    score: {
      type: Number,
      default: 0,
    },
    activateLink: {
      type: String,
      default: "none",
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    img: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmr_FKgCoFkoxhbzHlwhmLBpIKvkAepBMEjQ&usqp=CAU",
    },
    meetLink: String,
    table: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      default: "",
    },
    reports: {
      type: Array,
    },
    enhableContact: {
      type: Boolean,
      default: true,
    },
    classes:{
      type: Number,
      default: 0,
    },
    presences: {
      type: Number,
      default: 0,
    },

  },

  { collection: "profiles" }
);
const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
