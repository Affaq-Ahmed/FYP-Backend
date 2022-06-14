const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const category = db.collection("category");
const service = db.collection("services");
const user = db.collection("users");

//GET ALL CATEGORIES
router.get("/", async (req, res) => {
	try {
		const snapshot = await category.get();

		var categories = [];
		snapshot.forEach((doc) => {
			var category = doc.data();
			category.id = parseInt(doc.id);
			console.log(doc.id, "=>", doc.data());
			categories.push(category);
		});
		res.status(200).json(categories);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//GET CATEGORIES OF A USER'S SERVICES
router.get("/byUserId/:userId", async (req, res) => {
	try {
		const snapshot = await service
			.where("sellerId", "==", req.params.userId)
			.get();
		var categories = [];
		snapshot.forEach((doc) => {
			var category = doc.data().category;
			if (!categories.includes(category)) categories.push(category);
		});
		res.status(200).json(categories);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
