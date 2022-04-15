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
	const check = await user.doc(req.body.uId).get();
	if (check.exists) res.send("User Already Exists.");
	else {
		const data = req.body;
		const date = new Date();

		var userData = {
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			dob: data.dob,
			email: data.email,
			address: data.address,
			//phone: data.phone,
			//cnic: data.cnic,
			profileImage: data.profileImage,
			profileStatus: "0",
			//cnicFront: data.cnicFront,
			//cnicBack: data.cnicBack,
			createdOn: date,
			services: []
		};

		const result = await user.doc(req.body.uId).set(userData);
		console.log(result);
		res.status(200).send(result);
	}
});

router.post("/editProfile", async (req, res) => {
	const check = user.doc(req.body.uId).get();
	if (check.exists) res.status(200).send("User Does not Exists.");
	else {
		const data = req.body;
		
		const updatedUser = await user.doc(data.uId).update({
			firstName: data.firstName,
			lastName: data.lastName,
			address: data.address,
			profileImage: data.profileImage,
		});

		console.log(updatedUser);
		res.status(200).send(updatedUser);
	}
});

router.post("/byUsername", async (req, res) => {
	const result = await user.doc(req.body.username).get();
	if (!result.exists) res.send("User Does not Exists.");
	else {
		console.log(result._fieldsProto);
		res.send(result._fieldsProto);
	}
});

router.post("/byId", async (req, res) => {
	const result = await user.doc(req.body.uId).get();
	if (!result.exists) res.send("User Does not Exists.");
	else {
		console.log(result._fieldsProto);
		res.send(result._fieldsProto);
	}
});

module.exports = router;
