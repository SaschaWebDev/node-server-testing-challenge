const express = require('express');

const Users = require('./user-model.js');

const router = express.Router();

// GET ALL USERS
router.get('/users', async (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json({
        users: usersWithoutPassword(users),
        decodedToken: req.decodedToken,
      });
    })
    .catch(error => res.status(500).json({ error: error }));
});

module.exports = router;
