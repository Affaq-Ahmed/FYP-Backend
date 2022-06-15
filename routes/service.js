const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");
const router = express.Router();
const { db } = require("../config/firebase");
const { getDistance } = require("../config/firebase");

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
		sellerId: data.sellerId,
		rating: 0,
		feedback: [],
		orders: [],
		location: data.location,
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

router.get("/byId/:id", async (req, res) => {
	const resultService = await service.doc(req.params.id).get();

	if (!resultService.exists) {
		res.send("Service Not Found");
	} else {
		console.log(resultService._fieldsProto);
		res.send(resultService._fieldsProto);
	}
});

//GET SERVICES BY SELLER ID
router.get("/bySellerId/:sellerId", async (req, res) => {
	try {
		const snapshot = await service
			.where("sellerId", "==", req.params.sellerId)
			.get();
		const services = [];

		snapshot.forEach((doc) => {
			const data = doc.data();
			data.id = doc.id;
			console.log(doc.id, "=>", doc.data());
			services.push(data);
		});

		res.status(200).json(services);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

router.get("/search/:categoryId", async (req, res) => {
	const { location, distance, maxPrice, minRating } = req.query;
	const { categoryId } = req.params;

	const searchResult = await service.where("category", "==", parseInt(categoryId)).get();
	console.log(searchResult);
	const search = [];
	if (!searchResult) {
		console.log("No result found.");
		res.status(200).send("No Service by that filter.");
	} else {
		searchResult.forEach((doc) => {
			const data = doc.data();
			data.id = doc.id;
			console.log(doc.id, "=>", doc.data());
			if (
				getDistance(
					location.latitude,
					location.longitude,
					data.location.latitude,
					data.location.longitude
				) <= distance &&
				data.price <= maxPrice &&
				data.rating >= minRating
			)
			search.push(data);
		});
		res.status(200).json(search);
	}
});

module.exports = router;
