const express = require("express");

// const db = require("./data/dbConfig.js");

const AccountsRouter = require("./Accounts/AccountsRouter.js");

const server = express();

server.use(express.json());

server.use("/api", AccountsRouter);

module.exports = server;
