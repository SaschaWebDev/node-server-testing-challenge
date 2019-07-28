const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../../data/secrets/secret.js');

const Users = require('./user-model.js');

const router = express.Router();

const AuthMiddleware = require('../middleware/auth-middleware.js');

// GET ALL USERS
router.get('/users', AuthMiddleware.restricted, async (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json({
        users: usersWithoutPassword(users),
        decodedToken: req.decodedToken,
      });
    })
    .catch(error => res.status(500).json({ error: error }));
});

function usersWithoutPassword(users) {
  return users.map(user => ({
    id: user.id,
    username: user.username,
  }));
}

// ADD A NEW USER
router.post('/register', (req, res) => {
  let { username, password } = req.body;

  if (username && password) {
    const hash = bcrypt.hashSync(password, 12);
    password = hash;

    Users.add({ username, password })
      .then(newUser => {
        const token = generateJWT(newUser);

        res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          token: token,
        });
      })
      .catch(error => {
        res
          .status(500)
          .json(
            'There was an error during the creating of a new user. ' + error,
          );
      });
  } else {
    res
      .status(400)
      .json('Not all information were provided to create a new user.');
  }
});

// LOGIN
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findByUsername(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateJWT(user);
        res.status(200).json({
          message: `Welcome ${user.username}`,
          token: token,
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials submitted.' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateJWT(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

// Delete a user by id
router.delete('/users/:id', async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const deletedUser = await Users.remove(id);
    if (deletedUser > 0) {
      res.status(200).json({ message: 'The user was removed successfully.' });
    } else {
      res.status(404).json({ message: 'The user could not be found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error removing the user.' + error });
  }
});

// LOGOUT
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      error
        ? res.json({
            message: 'There was an error during the logout.',
          })
        : res.status(200).json({ message: 'Logout was successful!' });
    });
  } else {
    res
      .status(200)
      .json({ message: 'Login did not happen. So logout is not necessary.' });
  }
});

module.exports = router;
