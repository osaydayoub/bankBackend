import mongoose from "mongoose";
//Authentication

const authUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "This email is already in use"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  {
    timestamps: true,
  }
);

const AuthUser = mongoose.model("AuthUser", authUserSchema);

export default AuthUser;
