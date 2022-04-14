const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");
const router = express.Router();
const { db } = require("../config/firebase");

const service = db.collection("services");
const user = db.collection("users");

router.get("/", async (req, res) => {
	const snapshot = await service.get();

	var services = [];
	snapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
		services.push(doc.data());
	});
	res.send(services);
});

router.post("/createService", async (req, res) => {
	const data = req.body;
	const date = new Date();

	console.log("Data: ", data);

	const serviceData = {
		description: data.description,
		price: data.price,
		createdOn: date,
		category: data.category,
	};

	const result = await service.add(serviceData);
	console.log(result);
	if (result) {
		const userResult = user.doc(data.sellerId).update({
			services: FieldValue.arrayUnion(result.id),
		});
	}
	res.status(200).send(result);
});

router.get("/byId", async (req, res) => {
	const resultService = await service.doc(req.body.serviceId).get();

	if (!resultService.exists) {
		res.send("Service Not Found");
	} else {
		console.log(resultService._fieldsProto);
		res.send(resultService._fieldsProto);
	}
});

module.exports = router;
