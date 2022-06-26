const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

const feedback = db.collection("feedback");
const service = db.collection("services");
const order = db.collection("order");
const user = db.collection("users");

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

		//Update Rating of the service

		const serviceData = serviceRef.data();
		const rating = serviceData.rating;
		const feedbackCount = serviceData.feedback.length;
		const newRating =
			(rating * feedbackCount + req.body.rating) / (feedbackCount + 1);
		const newFeedbackCount = feedbackCount + 1;
		const serviceRef2 = await service.doc(req.body.serviceId).update({
			rating: newRating,
		});

		res.status(200).json("Feedback added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//GET FEEDBACK OF A SERVICE
router.get("/:id", async (req, res) => {
	try {
		const snapshot = await feedback
			.where("serviceId", "==", req.params.id)
			.get();

		var feedbacks = [];
		snapshot.forEach((doc) => {
			var singleFeedback = doc.data();
			singleFeedback.id = doc.id;
			feedbacks.push(singleFeedback);
		});

		res.status(200).json(feedbacks);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
