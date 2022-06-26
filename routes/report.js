const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const report = db.collection("report");

//CREATE A REPORT
router.post("/", async (req, res) => {
	try {
		const data = {
			orderId: req.body.orderId,
			reporterId: req.body.reporterId,
			reportMessage: req.body.reportMessage,
			createdOn: new Date(),
		};

		const reportRef = await report.add(data);
		console.log(reportRef);

		res.status(200).json("Report added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});
module.exports = router;
