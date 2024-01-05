import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // name:{
  //     type: String,
  //     required: [true,"Must provide a Name"],
  // },
  ID: {
    type: String,
    required: [true, "Must provide an ID"],
    unique: [true, "This ID is already in use"],
  },
  cash: {
    type: Number,
    required: [true, "Must provide a cash value"],
  },
  credit: {
    type: Number,
    required: [true, "Must provide a credit value"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
