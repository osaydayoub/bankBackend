import express from "express";
import { createUser, deleteUser, depositCash, filteredUsers, getAllUsers, getUserById, transferMoney, updateUserCredit, withdrawMoney } from "../controllers/bankController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Route to get all users
router.get("/", getAllUsers);

//Route to get a single user by ID
router.get("/:id", getUserById);

//Route filter the users ,can fetch users by the amount of cash they have
router.get('/filter/moreThan', filteredUsers)



// router.use(protect);
// Private routes

//Route to creat a new user
router.post("/", createUser);

//Route deposit cash to a user. (by the user's ID and amount of cash)
router.put('/depositCash', depositCash)

//Route withdraw money from a user. (by the user's ID and amount of money)
router.put('/withdrawMoney', withdrawMoney)

//Route to update an existing user's credit
router.put('/updateCredit', updateUserCredit)

//Route transfer money from one user to another with credit
router.put('/transferMoney', transferMoney)

//Route to delete a user
router.delete('/:id', deleteUser)

export default router;
