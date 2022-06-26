const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const report = db.collection("report");

//CREATE A REPORT
router.post("/", async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
module.exports = router;
