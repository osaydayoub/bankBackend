# bankBackend

## bank API

An Express backend is used, utilizing MongoDB Atlas for data storage. The API manages a bank, and the manager has access to the bank's users. To manage and work with all the endpoints, you need to use the URL below:

- Website: https://bank-api-v2.onrender.com/api/v1/bank

You can perform the following actions:

- Add a user:
  Users can be added to the bank. Each user has an ID, cash (default 0), and credit (default 0). Use the following:
- POST https://bank-api-no1b.onrender.com/api/v1/bank
  In the body: {"ID": "", "cash": #, "credit": #}

- Depositing
  Can deposit cash to a user. (by the user's ID and amount of cash) use:
- PUT https://bank-api-no1b.onrender.com/api/v1/bank/depositCash/?id=&amount=

- Withdraw money
  Can withdraw money from a user acount:
- PUT https://bank-api-no1b.onrender.com/api/v1/bank/withdrawMoney/?id=userID&amount=theWithdrawAmount

- Update Credit
  allow updates to user's credit limit:
- PUT https://bank-api-no1b.onrender.com/api/v1/bank/updateCredit/?id=userID&newCredit=newLimit

- Transfer Funds
  Enable money transfer between users
- PUT https://bank-api-no1b.onrender.com/api/v1/bank/transferMoney/?idFrom=userTranferFrom&idTo=idTransferTo&amount=1000

- User Details
  Retrive details of a specific user
- GET https://bank-api-no1b.onrender.com/api/v1/bank/:ID

-All users
Fetch details of all users

- GET https://bank-api-no1b.onrender.com/api/v1/bank

-Filter Users
Filter users based on cash amount

- GET https://bank-api-no1b.onrender.com/api/v1/bank/filter/moreThan/?cash=100
  returns all the users with cash mor than 100
