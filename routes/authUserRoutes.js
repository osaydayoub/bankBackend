import express from "express";
import { getMe, loginUser, registerUser } from "../controllers/authUserController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login",loginUser );


router.use(protect);
// private routes
router.get('/me',getMe)


export default router;
