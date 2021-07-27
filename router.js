const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { InvalidInputError } = require('./errorController');
const User = require('./db/models/user.js');

router.get('/', (req, res) => {
  res.send('server is up and running');
});

router.post('/login', async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email }).exec();
    if (!user) throw new InvalidInputError();
    let match = await bcrypt.compare(req.body.password, user.password)
    if (!match) throw new InvalidInputError();
    else res.status(200).send(user);
  } catch (err) {
    next(err)
  }
});

router.post('/signIn', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  user.save()
    .then(user => res.status(200).send(user))
    .catch(err => next(err));
});

module.exports = router;
