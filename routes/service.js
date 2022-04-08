const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const service = db.collection("services");

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
	console.log("Data: ", data);

	const result = await service.add(data);
	console.log(result);
	res.send(result);
});

router.get("/byId", async (req, res) => {
	const snapshot = await user.get();

	var resultSerivce;
	snapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
		if (doc.id == req.body.Id) {
			resultSerivce = doc.data();
		}
	});
	console.log(resultSerivce);
	res.send(resultSerivce);
});

module.exports = router;