const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

const order = db.collection("orders");
const service = db.collection("services");
const user = db.collection("users");

const notificationText = {
	1: [
		"Your order has been placed successfully.",
		"آپ نے کامیابی کے ساتھ نیا آرڈر دیا ہے۔",
	],
	2: [
		"Congratulations! You have got a new Order.",
		"مبارک ہو! آپ کو ایک نیا آرڈر ملا ہے",
	],
	3: ["Your order has been cancelled.", "آپ کا آرڈر کینسل کر دیا گیا ہے۔"],
	4: ["Your order has been accepted.", "آپ کا آرڈر تصدیق کر دیا گیا ہے۔"],
	5: ["Your order has been completed.", "آپ کا آرڈر تکمیل کر دیا گیا ہے۔"],
	6: ["Your order has been started.", "آپ کا آرڈر شروع کر دیا گیا ہے۔"],
	7: ["Your order has been rejected", "آپ کا آرڈر منسوخ کر دیا گیا ہے۔"],
};

//GET SERVICE COUNT AND NEW SERVICES TODAY
router.get("/count", async (req, res) => {
	try {
		//GET SERVICE COUNT
		const snapshot = await order.get();
		var orderCount = snapshot.size;

		//GET NEW SERVICES TODAY
		const today = new Date();
		const todayStart = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const todayEnd = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			23,
			59,
			59
		);
		const snapshot2 = await order.where("createdAt", ">=", todayStart).where("createdAt", "<=", todayEnd).get();
		var newOrderCount = snapshot2.size;

		res.send({ orderCount, newOrderCount });
	} catch (error) {
		console.log(error);
		res.send(error);
	}
})

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
				status: "0", //0 = pending, 1 = accepted, 2 = rejected, 3 = completed, 4 = cancelled by buyer, 5 = cancelled by seller
			};

			const result = await order.add(orderData);

			const serviceRef = await service.doc(data.serviceId).update({
				orders: FieldValue.arrayUnion(result.id),
			});

			const notificationGeneratedSeller = {
				seen: false,
				type: "order",
				orderId: result.id,
				category: data.category,
				text: notificationText[1],
				createdOn: date,
			};

			const notificationResult = await user
				.doc(data.buyerId)
				.collection("notifications")
				.add(notificationGeneratedSeller);

			const notificationGeneratedClient = {
				seen: false,
				type: "order",
				orderId: result.id,
				category: data.category,
				text: notificationText[2],
				createdOn: date,
			};

			const notificationResult2 = await user
				.doc(data.sellerId)
				.collection("notifications")
				.add(notificationGeneratedClient);

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
			res.status(200).send("Order Not Found.");
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
				res.status(200).json("Order Not Accepted.");
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

				const serviceRef = await service.doc(data.serviceId).update({
					orders: FieldValue.arrayRemove(req.body.orderId),
				});	

				res.status(200).json("Order Rejected.");
			} else {
				res.status(200).json("Order Not Rejected.");
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//COMPLETE ORDER
router.put("/completeOrder", async (req, res) => {
	try {
		const resultOrder = await order.doc(req.body.orderId).get();

		if (!resultOrder.exists) {
			res.send("Order Not Found.");
		} else {
			if (
				resultOrder.data().status === "1" &&
				resultOrder.data().buyerId === req.body.buyerId
			) {
				const result = await order.doc(req.body.orderId).update({
					status: "3",
				});
				res.status(200).json("Order Completed.");
			} else {
				res.status(200).json("Order Not Completed.");
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//DELETE OFFER BY BUYER ID
router.delete("/deleteOrder", async (req, res) => {
	try {
		const resultOrder = await order.doc(req.query.orderId).get();

		if (!resultOrder.exists) {
			res.send("Order Not Found.");
		} else {
			if (
				resultOrder.data().status === "0" &&
				resultOrder.data().buyerId === req.query.buyerId
			) {
				const result = await order.doc(req.query.orderId).delete();
				res.status(200).json("Order Deleted.");
			} else {
				res.status(200).json("Order Not Deleted.");
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

//GET ACCEPTED ORDERS BY BUYER ID
router.get("/acceptedOrdersClient/:id", async (req, res) => {
	try {
		const result = await order
			.where("buyerId", "==", req.params.id)
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
			.where("status", "in", ["2", "3", "4"])
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

//GET COMPLETED, REJECTED AND CANCELLED ORDERS BY BUYER ID
router.get("/completedOrdersClient/:id", async (req, res) => {
	try {
		const result = await order
			.where("buyerId", "==", req.params.id)
			.where("status", "in", ["2", "3", "4"])
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

//GET PENDING ORDERS BY BUYER ID
router.get("/pendingOrdersClient/:id", async (req, res) => {
	try {
		const result = await order
			.where("buyerId", "==", req.params.id)
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
