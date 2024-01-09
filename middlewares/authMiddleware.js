import jwt from "jsonwebtoken";
import AuthUser from "../models/userModel.js";
import STATUS_CODE from "../constants/statusCode.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token
      req.user = await AuthUser.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(STATUS_CODE.UNAUTHORIZED).send("Not authorized");
    }
  }
  if (!token) {
    // res.status(STATUS_CODE.UNAUTHORIZED)
    // throw new Error("User is not authorized,  no token");
    res.status(STATUS_CODE.UNAUTHORIZED).send("Not authorized, no token");
  }
};
