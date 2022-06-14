const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const category = db.collection("category");

//GET ALL CATEGORIES
router.get("/", async (req, res) => {
	const snapshot = await category.get();

	var categories = [];
	snapshot.forEach((doc) => {
		var category = doc.data();
		category.id = parseInt(doc.id);
		console.log(doc.id, "=>", doc.data());
		categories.push(category);
	});
	res.status(200).json(categories);
});

module.exports = router;
