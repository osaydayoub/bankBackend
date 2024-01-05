import STATUS_CODE from "../constants/statusCode.js";
import User from "../models/bankModel.js";

//Controller to get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    next(error);
  }
};

// Controller to get user by ID
export const getUserById = async (req, res, next) => {
  try {
    // const user = await User.findById(req.params.id);
    const user = await User.find({ ID: req.params.id });
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No such user in the database");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

// Controller to create a new user
export const createUser = async (req, res, next) => {
  try {
    const { ID, cash, credit } = req.body;
    const newUser = await User.create({ ID, cash, credit });
    res.status(STATUS_CODE.CREATED).send(newUser);
  } catch (error) {
    next(error);
  }
};

// Controller to delete a user by id
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Find the user
    // const user = await User.findById(userId);
    const user = await User.find({ ID: userId });
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No such user in the db");
    }
    // Delete the user
    await User.deleteOne({ _id: user._id });
    res.send(`User with id ${userId} was deleted successfully`);
  } catch (error) {
    next(error);
  }
};

//@des    filter the users ,return users with amount of cash more than cashMoreThan
//@route  GET /api/v1/bank/filter/moreThan/?chash=#
///filter/moreThan/?chash=100
export const filteredUsers = async (req, res, next) => {
  const cashMoreThan = Number(req.query.cash);
  // res.send('filteredUsers');
  try {
    if (cashMoreThan === undefined) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("query parameter (chash) is required");
    }
    const filteredUsers = await User.find({ cash: { $gte: cashMoreThan } });

    // console.log(filteredUsers)
    res.send(filteredUsers);
  } catch (error) {
    next(error);
  }
};

// //@des    deposit cash to a user. (by the user's ID and amount of cash)
// //@route  Put /api/v1/bank/depositCash/?id=&amount=  query parameters(id & amount)
// export const depositCash = async (req, res, next) => {
//   try {
//     if (req.query.amount === undefined || req.query.id === undefined) {
//       res.status(STATUS_CODE.BAD_REQUEST);
//       throw new Error("add (id ,amount)  as a query parameters");
//     }
//     const amount = Number(req.query.amount);
//     const userId = req.query.id;
//     const user = await User.findById(userId);
//     // const user = await User.find({ ID: userId });
//     if (!user) {
//       res.status(STATUS_CODE.NOT_FOUND);
//       throw new Error("No such user in the db");
//     }
//     let newCach = user.cash + amount;
//     await User.updateOne(
//       { _id: user._id },
//       {
//         $set: { cash: newCach },
//       }
//     );
//     res.send("deposit cash to a user done! ");
//   } catch (error) {
//     next(error);
//   }
// };

// //@des    withdraw money from a user. (by the user's ID and amount of cash)
// //@route  Put /api/v1/bank/withdrawMoney/?id=&amount=  query parameters(id & amount)
// export const withdrawMoney = async (req, res, next) => {
//     const userId = req.query.id;
//     const amount = Number(req.query.amount);
//     try {
//         if (userId === undefined || amount === undefined) {
//             res.status(STATUS_CODE.BAD_REQUEST)
//             throw new Error("query parameters (id, amount) are required")
//         }
//         const users = readUsersFromFile();
//         const index = users.findIndex(u => u.ID === userId)
//         if (index === -1) {
//             res.status(STATUS_CODE.NOT_FOUND)
//             throw new Error("User was not found!")
//         }

//         let possibleWithdraw = users[index].cash + users[index].credit
//         if (possibleWithdraw - amount < 0) {
//             res.status(STATUS_CODE.BAD_REQUEST)
//             throw new Error("The total amount of withdraw can't exceed the sum of cash and credit")
//         }

//         let sum = users[index].cash - amount;
//         let newCach = (sum >= 0) ? sum : 0;
//         let newCredit = (sum >= 0) ? users[index].credit : users[index].credit + sum;
//         const updatedUser = { ...users[index], cash: newCach, credit: newCredit }
//         users[index] = updatedUser;
//         writeUsersToFile(users)
//         res.send(updatedUser)
//     } catch (error) {
//         next(error)
//     }
// }

// // transferMoney
// //@des    withdraw money from a user. (by the user's ID and amount of cash)
// //@route  Put /api/v1/bank/transferMoney?idFrom=&idTo=&amount=  query parameters(idFrom & idTo & amount)
// export const transferMoney = async (req, res, next) => {
//     const idFrom = req.query.idFrom;
//     const idTo = req.query.idTo;
//     const amount = Number(req.query.amount);
//     try {
//         if (idFrom === undefined || idTo === undefined || amount === undefined) {
//             res.status(STATUS_CODE.BAD_REQUEST)
//             throw new Error("query parameters (idFrom, idTo, amount) are required")
//         }
//         const users = readUsersFromFile();
//         const indexFrom = users.findIndex(u => u.ID === idFrom)
//         if (indexFrom === -1) {
//             res.status(STATUS_CODE.NOT_FOUND)
//             throw new Error(`User idFrom=${idFrom} was not found!`)
//         }

//         const indexTo = users.findIndex(u => u.ID === idTo)
//         if (indexTo === -1) {
//             res.status(STATUS_CODE.NOT_FOUND)
//             throw new Error(`User idTo=${idTo} was not found!`)
//         }

//         let possibleWithdraw = users[indexFrom].cash + users[indexFrom].credit
//         if (possibleWithdraw - amount < 0) {
//             res.status(STATUS_CODE.BAD_REQUEST)
//             throw new Error("The total amount of transfer money can't exceed the sum of cash and credit")
//         }

//         let sum = users[indexFrom].cash - amount;
//         let newCach = (sum >= 0) ? sum : 0;
//         let newCredit = (sum >= 0) ? users[indexFrom].credit : users[indexFrom].credit + sum;
//         const updatedUserFrom = { ...users[indexFrom], cash: newCach, credit: newCredit }
//         users[indexFrom] = updatedUserFrom;

//         let newCreditTo = users[indexTo].credit + amount;
//         const updatedUserTo = { ...users[indexTo], credit: newCreditTo }
//         users[indexTo] = updatedUserTo;

//         writeUsersToFile(users)
//         res.send([updatedUserFrom, updatedUserTo])
//     } catch (error) {
//         next(error)
//     }
// }

// //@des    update a user's credit (only positive numbers)
// //@route  Put /api/v1/bank/updateCredit/?id=&newCredit=  query parameter(id & newCredit)
// export const updateUserCredit = async (req, res, next) => {
//     const userId = req.query.id;
//     const newCredit = Number(req.query.newCredit);
//     try {
//         const users = readUsersFromFile();
//         const index = users.findIndex(u => u.ID === userId)
//         if (index === -1) {
//             res.status(STATUS_CODE.NOT_FOUND)
//             throw new Error("User was not found!")
//         }
//         if (newCredit === undefined) {
//             res.status(STATUS_CODE.BAD_REQUEST)
//             throw new Error("add new credit value as a query newCredit!")
//         }
//         if (newCredit <= 0) {
//             res.status(STATUS_CODE.BAD_REQUEST)
//             throw new Error("credit value can only be a positive number")
//         }
//         const updatedUser = { ...users[index], credit: newCredit }
//         users[index] = updatedUser;
//         writeUsersToFile(users)
//         res.send(updatedUser)
//     } catch (error) {
//         next(error)
//     }
// }

