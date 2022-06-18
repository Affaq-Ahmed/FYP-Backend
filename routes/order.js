const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const order = db.collection("orders");

//CREATE ORDER
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
				sellerId: data.sellerId,
				status: "0", //0 = pending, 1 = accepted, 2 = rejected, 3 = completed, 4 = cancelled
			};

			const result = await order.add(orderData);
			console.log(result);
			res.status(201).json("Order Created.");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
