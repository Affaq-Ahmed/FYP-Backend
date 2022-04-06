const express = require("express");
const router = express.Router();
const { db } = require('../config/firebase1');

const user = db.collection('users');

router.get('/', async (req, res) => {

});

router.post('/createProfile', async (req, res) => {
  const data = req.body;
  console.log('Data: ', data);
  await user.set(data);
  res.send(data);
});

module.exports = router;