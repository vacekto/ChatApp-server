const express = require('express');
const router = express.Router();
const User = require('./db/models/user.js');

router.get('/', (req, res) => {
  res.send('server is up and running');
});

router.post('/login', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

router.post('/signIn', (req, res) => {
  res.send({
    token: 'test123'
  });
});

module.exports = router;
