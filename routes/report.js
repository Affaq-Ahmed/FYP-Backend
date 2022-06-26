const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const report = db.collection("report");
const order = db.collection("orders");
const user = db.collection("users");

//CREATE A REPORT
router.post("/", async (req, res) => {
	const { orderId, reportMessage, reporterId } = req.body;
	try {
		const checkOrder = await order.doc(orderId).get();
		if (checkOrder.exists) {
			const checkReporter = await user.doc(reporterId).get();
			if (checkReporter.exists) {
				const data = {
					orderId: orderId,
					reporterId: reporterId,
					reportMessage: reportMessage,
					createdOn: new Date(),
				};

				const reportRef = await report.add(data);
				console.log(reportRef);

				res.status(200).json("Report added successfully");
			} else {
				res.status(200).json("Reporter not found");
			}
		} else {
			res.status(200).json("Order not found");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
