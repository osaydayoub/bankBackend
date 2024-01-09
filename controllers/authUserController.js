import STATUS_CODE from "../constants/statusCode.js";
import AuthUser from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//The user here is an admin user who has permission access to the app.

// @desc     Register new user
// @route    POST /api/v1/users
// @access   Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Please add all fields");
    }
    const userExists = await AuthUser.findOne({ email });
    if (userExists) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("User already exists");
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Creat authUser
    const user = await AuthUser.create({
      name,
      email,
      password: hashedPassword,
    });
    if (user) {
      res.status(STATUS_CODE.CREATED).send({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Authenticate a user
// @route    POST /api/v1/users/login
// @access   Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await AuthUser.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.send({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Get  user data
// @route    GET /api/v1/users/me
// @access   Private
export const getMe = async (req, res, next) => {
  try {
    const {_id,name,email}=await AuthUser.findById(req.user.id)
    res.status(STATUS_CODE.OK).send({
      id:_id,
      name,
      email
    });
  } catch (error) {
    next(error);
  }
};

//Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
