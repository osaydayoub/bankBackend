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
    const user = await User.findOne({ ID: req.params.id });
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
    const userId = req.params.id;
    if (userId === undefined) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("add id as a parameter");
    }
    // Find the user
    // const user = await User.findById(userId);
    const user = await User.findOne({ ID: userId });
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

//@des    deposit cash to a user. (by the user's ID and amount of cash)
//@route  Put /api/v1/bank/depositCash/?id=&amount=  query parameters(id & amount)
export const depositCash = async (req, res, next) => {
  try {
    if (req.query.amount === undefined || req.query.id === undefined) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(`add (id=${id} ,amount=${amount})  as a query parameters`);
    }
    const amount = Number(req.query.amount);
    const userId = req.query.id;
    // const user = await User.findById(userId);
    const user = await User.findOne({ ID: userId });
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No such user in the db");
    }
    let newCach = user.cash + amount;
    await User.updateOne(
      { _id: user._id },
      {
        $set: { cash: newCach },
      }
    );
    const updatedUser = await User.findById(user._id);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};

//@des    withdraw money from a user. (by the user's ID and amount of cash)
//@route  Put /api/v1/bank/withdrawMoney/?id=&amount=  query parameters(id & amount)
export const withdrawMoney = async (req, res, next) => {
  try {
    if (req.query.amount === undefined || req.query.id === undefined) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("query parameters (id, amount) are required");
    }
    const userId = req.query.id;
    const amount = Number(req.query.amount);
    // const user = await User.findById(userId);
    const user = await User.findOne({ ID: userId });
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No such user in the db");
    }

    let possibleWithdraw = user.cash + user.credit;
    if (possibleWithdraw - amount < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "The total amount of withdraw can't exceed the sum of cash and credit"
      );
    }

    let sum = user.cash - amount;
    let newCach = sum >= 0 ? sum : 0;
    let newCredit = sum >= 0 ? user.credit : user.credit + sum;
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          cash: newCach,
          credit: newCredit,
        },
      }
    );
    const updatedUser = await User.findById(user._id);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};

// transferMoney
//@des    Transfer money from one user to another . (by the user's ID and amount of cash)
//@route  Put /api/v1/bank/transferMoney?idFrom=&idTo=&amount=  query parameters(idFrom & idTo & amount)
export const transferMoney = async (req, res, next) => {
  try {
    if (
      req.query.idFrom === undefined ||
      req.query.idTo === undefined ||
      req.query.amount === undefined
    ) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("query parameters (idFrom, idTo, amount) are required");
    }
    const idFrom = req.query.idFrom;
    const idTo = req.query.idTo;
    const amount = Number(req.query.amount);

    // const userFrom = await User.findById(idFrom);
    const userFrom = await User.findOne({ ID: idFrom });
    if (!userFrom) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error(`User idFrom=${idFrom} was not found!`);
    }

    const userTo = await User.findOne({ ID: idTo });
    if (!userTo) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error(`User with idTo=${idTo} was not found!`);
    }

    let possibleWithdraw = userFrom.cash + userFrom.credit;
    if (possibleWithdraw - amount < 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "The total amount of transfer money can't exceed the sum of cash and credit"
      );
    }

    let sum = userFrom.cash - amount;
    let newCach = sum >= 0 ? sum : 0;
    let newCredit = sum >= 0 ? userFrom.credit : userFrom.credit + sum;

    await User.updateOne(
      { _id: userFrom._id },
      {
        $set: {
          cash: newCach,
          credit: newCredit,
        },
      }
    );

    let newCreditTo = userTo.credit + amount;

    await User.updateOne(
      { _id: userTo._id },
      {
        $set: { credit: newCreditTo },
      }
    );

    const updatedUserFrom = await User.findById(userFrom._id);
    const updatedUserTo = await User.findById(userTo._id);
    res.send([updatedUserFrom, updatedUserTo]);
  } catch (error) {
    next(error);
  }
};

//@des    update a user's credit (only positive numbers)
//@route  Put /api/v1/bank/updateCredit/?id=&newCredit=  query parameter(id & newCredit)
export const updateUserCredit = async (req, res, next) => {
  try {
    if (req.query.id === undefined || req.query.newCredit === undefined) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("query parameters (id, newCredit) are required");
    }
    const userId = req.query.id;
    const newCredit = Number(req.query.newCredit);

    if (newCredit <= 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("credit value can only be a positive number");
    }

    // const user = await User.findById(userId);
    const user = await User.findOne({ ID: userId });
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No such user in the db");
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: { credit: newCredit },
      }
    );
    const updatedUser = await User.findById(user._id);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};
