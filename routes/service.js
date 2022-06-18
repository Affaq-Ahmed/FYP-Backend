const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");
const router = express.Router();
const { db } = require("../config/firebase");
// const { deg2rad } = require("../utils/helpers");
// const { getDistance } = require("../config/firebase");

const service = db.collection("services");
const user = db.collection("users");

function deg2rad(degrees) {
	var pi = Math.PI;
	return degrees * (pi / 180);
}

const getDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1); // deg2rad below
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d;
};

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
	try {
		const { longitude, latitude, distance, maxPrice, minRating, uId } =
			req.query;
		const { categoryId } = req.params;

		const searchResult = await service
			.where("category", "==", parseInt(categoryId))
			.get();
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
						latitude,
						longitude,
						data.location.latitude,
						data.location.longitude
					) <= distance &&
					data.price <= parseInt(maxPrice) &&
					data.rating >= parseInt(minRating) &&
					data.sellerId !== uId
				)
					search.push(data);
			});

			res.status(200).json(search);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//MODIFY SERVICE
router.put("/modifyService/:id", async (req, res) => {
	const data = req.body;
	try {
		const result = await service.doc(req.params.id).update({
			description: data.description,
			price: data.price,
			location: data.location,
		});
		console.log(result);
		res.status(200).send("Service Updated Successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//DELETE SERVICE
router.delete("/delete/:id", async (req, res) => {
	try {
		const result = await service.doc(req.params.id).delete();
		const userResult = user.doc(data.sellerId).update({
			services: FieldValue.arrayRemove(req.params.id),
		});
		console.log(result);
		res.status(200).send("Service Deleted Successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
