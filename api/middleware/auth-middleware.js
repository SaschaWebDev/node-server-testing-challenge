const jwt = require('jsonwebtoken');
const secrets = require('../../data/secrets/secret.js');

module.exports = {
  restricted,
};

function restricted(req, res, next) {
  const token = req.headers.authorization;

  jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({ error: 'Authorization failed. Access denies!' });
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });
}
