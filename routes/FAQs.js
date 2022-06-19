const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const FAQs = db.collection("FAQs");

//GET FAQs
router.get("/", async (req, res) => {
	try {
		const snapshot = await FAQs.get();

		var FAQs = [];
		snapshot.forEach((doc) => {
			var FAQ = doc.data();
			FAQ.id = parseInt(doc.id);
			console.log(doc.id, "=>", doc.data());
			FAQs.push(FAQ);
		});

		res.status(200).json(FAQs);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
