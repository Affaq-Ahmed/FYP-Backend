const express = require("express");
const router = express.Router();
const { db, storage } = require("../config/firebase");

const user = db.collection("users");

router.get("/", async (req, res) => {
	const snapshot = await user.get();

	var users = [];
	snapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
		users.push(doc.data());
	});
	res.send(snapshot);
});

router.post("/createProfile", async (req, res) => {
	const data = req.body;
	console.log("Data: ", data);

	const result = await user.add(data);
	console.log(result);
	res.send(result);
});

router.get("/byId", async (req, res) => {
	const snapshot = await user.get();

	var resultUser;
	snapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
		if (doc.id == req.body.Id) {
			resultUser = doc.data();
		}
	});
	console.log(resultUser);
	res.send(resultUser);
});

module.exports = router;
