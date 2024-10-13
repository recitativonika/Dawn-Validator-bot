# DAWN Validator Extension automatic claim

## What needed
- Node JS

## Features

- Automatically send keep-alive requests to claim points
- Multi-account
- Auto loop


## Installing and setup

### Install
1. Clone the project and go to project directory
   ```
   git clone https://github.com/recitativonika/Dawn-Validator-bot.git
   ```
   ```
   cd Dawn-Validator-bot
   ```
2. Install required package
   ```
   npm install
   ```
### Setup and run

1. Login/register Dawn Validator account and login, get the token in "getpoint?appid=" -> "authorization:"
2. In `dawn-validator` directory, Edit and adjust this line in `account.js` and save it
```
	// accounts.js
   module.exports = [
      { email: "user1@example.com", token: "token1" },
      { email: "user2@example.com", token: "token2" },
      // Add more accounts as needed
   ];
```
5. Run the script to start, use :
    ```
    node index.js
    ```
