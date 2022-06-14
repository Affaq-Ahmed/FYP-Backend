const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const order = db.collection("orders");

router.post("/createOrder", async (req, res) => {
	try {
		const resultService = await service.doc(req.body.serviceId).get();

		if (!resultService.exists) {
			res.send("Service Not Found.");
		} else {
			const data = req.body;
			const date = new Date();

			console.log("Data: ", data);

			const orderData = {
				description: data.description,
				price: data.price,
				createdOn: date,
				startDate: data.startDate,
				endDate: data.endDate,
				serviceId: data.serviceId,
				buyerId: data.buyerId,
				status: "pending",
			};

			const result = await order.add(orderData);
			console.log(result);
			res.status(200).send(result);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

router.post("/updateOrder", async (req, res) => {
	const data = req.body;
	const resultOrder = await service.doc(req.body.orderId).get();

	if (!resultService.exists) {
		res.send("Service Not Found.");
	} else {
		const data = req.body;
		const resultOrder = await order.doc(data.orderId).update({
			status: data.status,
		});
	}
});

module.exports = router;
