const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const user = db.collection("users");

router.get("/", async (req, res) => {
	const snapshot = await user.get();

	var users = [];
	snapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
		users.push(doc.data());
	});
	res.send(users);
});

router.post("/createProfile", async (req, res) => {
	const check = user.doc(req.body.userName);
	if (check.exists) res.send("User Already Exists.");
	else {
		const data = req.body;

		var userData = {
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			dob: data.dob,
			email: data.email,
			address: data.address,
			//cnic: data.cnic,
			profileImage: data.profileImage,
			profileStatus: "0",
			//cnicFront: data.cnicFront,
			//cnicBack: data.cnicBack,
		};

		const result = await user.set(userData);
		console.log(result);
		res.status(200).send(result);
	}
});

router.get("/byUsername", async (req, res) => {
	const result = await user.doc(req.body.username).get();
	if (!result.exists) res.send("User Does not Exists.");
	else {
		console.log(result._fieldsProto);
		res.send(result._fieldsProto);
	}
});

module.exports = router;