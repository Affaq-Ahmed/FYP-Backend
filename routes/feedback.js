const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const feedback = db.collection("feedback");
const service = db.collection("services");
const order = db.collection("order");

//GET FEEDBACKS OF A SERVICE
router.get("/", async (req, res) => {
	try {
		const snapshot = await feedback.get();

		var fetchedFeedbacks = [];
		snapshot.forEach((doc) => {
			var feedback = doc.data();
			feedback.id = doc.id;
			console.log(doc.id, "=>", doc.data());
			fetchedFeedbacks.push(feedback);
		});

		res.status(200).json(fetchedFeedbacks);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//CREATE FEEDBACK OF A SERVICE
router.post("/", async (req, res) => {
	try {
		const data = {
      orderId: req.body.orderId,
			buyerId: req.body.buyerId,
			serviceId: req.body.serviceId,
			rating: req.body.rating,
			message: req.body.message,
			createdOn: new Date(),
		};
		const feedbackRef = await feedback.add(data);
    console.log(feedbackRef);

		const serviceRef = await service.doc(req.body.serviceId).update({
			feedback: FieldValue.arrayUnion(feedbackRef.id),
		});

		res.status(200).json("Feedback added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
