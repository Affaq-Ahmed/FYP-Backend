const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const category = db.collection("category");

//GET ALL CATEGORIES
router.get("/", async (req, res) => {
	const snapshot = await category.get();

	var categories = [];
	snapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
		categories.push(doc);
	});
	res.send(categories);
});

// //CREATE CATEGORY
// router.post("/createCategory", async (req, res) => {
// 	const data = req.body;
// 	const date = new Date();
// });

module.exports = router;
