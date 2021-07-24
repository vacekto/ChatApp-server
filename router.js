const express = require('express');
const router = express.Router();    

router.get('/', (req,res) => {
    res.send('server is up and running');
});

router.get('/login', (req, res) => {
  res.send({
    token: 'test123'
  });   
});

router.get('/signIn', (req, res) => {
  res.send({
    token: 'test123'
  });   
});

module.exports = router;
