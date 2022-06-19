const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const FAQs = db.collection("FAQs");

//GET FAQs
router.get("/", async (req, res) => {
	try {
		const snapshot = await FAQs.get();

		var fetchedFAQs = [];
		snapshot.forEach((doc) => {
			var FAQ = doc.data();
			FAQ.id = doc.id;
			console.log(doc.id, "=>", doc.data());
			fetchedFAQs.push(FAQ);
		});

		res.status(200).json(fetchedFAQs);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
