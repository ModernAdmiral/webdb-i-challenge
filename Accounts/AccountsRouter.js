const express = require("express");

// database access using knex
const knex = require("../data/dbConfig.js"); // <<< renamed to knex from db

const router = express.Router();

router.get("/accounts", (req, res) => {
  knex("accounts")
    .then(customer => {
      res.status(200).json(customer);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "unable to get account" });
    });
});

router.post("/accounts", (req, res) => {
  const postData = req.body;

  knex("accounts")
    .insert(postData, "id")
    .then(ids => {
      const id = (ids = ids[0]);

      return knex("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(account => {
          res.status(201).json(account);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "unable to add account" });
    });
});

router.put("/accounts/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  // validate the data
  knex("accounts")
    .where({ id }) // ALWAYS FILTER ON UPDATE (AND DELETE)
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error updating the post"
      });
    });
});

router.delete("/accounts/:id", (req, res) => {
  knex("accounts")
    .where({ id: req.params.id }) // ALWAYS FILTER ON UPDATE (AND DELETE)
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} record(s) removed` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error removing the post"
      });
    });
});

module.exports = router;
