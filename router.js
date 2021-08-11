const express = require('express');
const router = express.Router();
const db_API = require('./db/API.js')
const { checkUserStatus } = require('./sockets.js')

router.get('/', (req, res) => {
  res.send('server is up and running');
});

router.post('/login', async (req, res, next) => {
  db_API.authUser(req.body.password, req.body.email)
    .then(user => {
      if (checkUserStatus(user.id) === 'online') throw new Error('This user is already logged in');
      res.status(200).send(user)
    })
    .catch(err => next(err))
});

router.post('/signIn', (req, res, next) => {
  db_API.createUser(req.body.username, req.body.password, req.body.email)
    .then(savedUser => res.status(200).send(savedUser))
    .catch(err => next(err))
})

module.exports = router;
