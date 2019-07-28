const express = require('express');
const helmet = require('helmet');
const moment = require('moment');
const session = require('express-session');
const SessionStore = require('connect-session-knex')(session);
const cors = require('cors');

const UsersRouter = require('./api/users/user-router.js');

const server = express();
const sessionConfig = {
  name: 'monkey', // default is 'sid' by changing the name we don't expose the  used library
  secret: 'keep it secret, keep it safe!', // should be in environment variable
  cookie: {
    maxAge: 60000 * 60, // cookie will stay valid for 1 hour
    secure: false, // cookie only over HTTPS? Always true in production!
    httpOnly: true, // No JavaScript on the client get access to the cookie
  },
  resave: false, // Recreate a session even if it hasn't changed?
  saveUninitialized: false, // GDPR compliance does not allow setting cookies by default! Only true when user accepted!
  store: new SessionStore({
    knex: require('./data/db-config.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 60000 * 60,
  }),
};

server.get('/', (req, res) => {
  res.status(200).json({
    message: `Welcome to the API of sprint 13 lecture 4 daily challenge about testing`,
  });
});

server.use(Requestlogger);
server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig));
server.use(cors());

server.use('/api/', UsersRouter);

function Requestlogger(req, res, next) {
  console.log(
    `${req.method} to http://localhost/5000${req.path} at `,
    moment().format(),
  );
  next();
}

module.exports = server;
