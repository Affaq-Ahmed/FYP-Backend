const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const order = db.collection("orders");
const service = db.collection("services");

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
				location: data.location,
				category: data.category,
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

//ACCEPT ORDER
router.put("/acceptOrder", async (req, res) => {
	try {
		const resultOrder = await order.doc(req.body.orderId).get();

		if (!resultOrder.exists) {
			res.status(404).send("Order Not Found.");
		} else {
			if (
				resultOrder.data().status === "0" &&
				resultOrder.data().sellerId === req.body.sellerId
			) {
				const result = await order.doc(req.body.orderId).update({
					status: "1",
				});
				res.status(200).json("Order Accepted.");
			} else {
				res.status(400).json("Order Not Accepted.");
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
});

//REJECT ORDER
router.put("/rejectOrder", async (req, res) => {
	try {
		const resultOrder = await order.doc(req.body.orderId).get();

		if (!resultOrder.exists) {
			res.send("Order Not Found.");
		} else {
			if (
				resultOrder.data().status === "0" &&
				resultOrder.data().sellerId === req.body.sellerId
			) {
				const result = await order.doc(req.body.orderId).update({
					status: "2",
				});
				res.status(200).json("Order Rejected.");
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//GET ACCEPTED ORDERS BY SELLER ID
router.get("/acceptedOrders/:id", async (req, res) => {
	try {
		const result = await order
			.where("sellerId", "==", req.params.id)
			.where("status", "==", "1")
			.get();

		if (result.empty) {
			res.status(200).send([]);
		} else {
			const orders = [];
			result.forEach((doc) => {
				orders.push({
					id: doc.id,
					...doc.data(),
				});
			});
			res.status(200).json(orders);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//GET COMPLETED ORDERS BY SELLER ID
router.get("/completedOrders/:id", async (req, res) => {
	try {
		const result = await order
			.where("sellerId", "==", req.params.id)
			.where("status", "==", "3")
			.get();

		if (result.empty) {
			res.status(200).send([]);
		} else {
			const orders = [];
			result.forEach((doc) => {
				orders.push({
					id: doc.id,
					...doc.data(),
				});
			});
			res.status(200).json(orders);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//GET PENDING ORDERS BY SELLER ID
router.get("/pendingOrders/:id", async (req, res) => {
	try {
		const result = await order
			.where("sellerId", "==", req.params.id)
			.where("status", "==", "0")
			.get();

		if (result.empty) {
			res.status(200).send([]);
		} else {
			const orders = [];
			result.forEach((doc) => {
				orders.push({
					id: doc.id,
					...doc.data(),
				});
			});
			res.status(200).json(orders);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
