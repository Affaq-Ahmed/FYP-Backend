const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const category = db.collection("category");

router.get("/", async (req, res) => {
	const snapshot = await category.get();

	var categories = [];
	snapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
		categories.push(doc.data());
	});
	res.send(categories);
});

module.exports = router;
