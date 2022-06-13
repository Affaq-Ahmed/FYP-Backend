const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const user = db.collection("users");

router.get("/", async (req, res) => {
	try {
		const snapshot = await user.get();

		var users = [];
		snapshot.forEach((doc) => {
			console.log(doc.id, "=>", doc.data());
			users.push(doc.data());
		});
		res.status(200).send(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
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
			phone: data.phone,
			cnic: data.cnic,
			profileImage: data.profileImage,
			profileStatus: "0",
			//cnicFront: data.cnicFront,
			//cnicBack: data.cnicBack,
			createdOn: date,
			services: [],
			sellerLevel: "Beginner",
		};

		const result = await user.doc(req.body.uId).set(userData);
		console.log(result);
		res.status(200).send(result);
	}
});

router.post("/editProfile", async (req, res) => {
	try {
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
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/deActivateProfile", async (req, res) => {
	try {
		const check = user.doc(req.body.uId).get();
		if (check.exists) res.status(200).send("User Does not Exists.");
		else {
			const data = req.body;
			if (data.status === "0") res.status(200).send("Profile Not Active Yet.");

			const updatedUser = await user.doc(data.uId).update({
				profileStatus: "2",
			});

			console.log(updatedUser);
			res.status(200).send(updatedUser);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/activateProfile", async (req, res) => {
	try {
		const check = user.doc(req.body.uId).get();
		if (check.exists) res.status(200).send("User Does not Exists.");
		else {
			const data = req.body;
			if (data.status === "0") res.status(200).send("Profile Not Active Yet.");

			const updatedUser = await user.doc(data.uId).update({
				profileStatus: "1",
			});

			console.log(updatedUser);
			res.status(200).send(updatedUser);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/:username", async (req, res) => {
	try {
		const result = await user.doc(req.params.username).get();
		if (!result.exists) res.send("User Does not Exist.");
		else {
			const user = {
				address: result._fieldsProto.address.stringValue,
				dob: result._fieldsProto.dob.stringValue,
				firstName: result._fieldsProto.firstName.stringValue,
				lastName: result._fieldsProto.lastName.stringValue,
				profileImage: result._fieldsProto.profileImage.stringValue,
				phone: result._fieldsProto.phone.stringValue,
				username: result._fieldsProto.username.stringValue,
				cnic: result._fieldsProto.cnic.stringValue,
				email: result._fieldsProto.email.stringValue,
				profileStatus: result._fieldsProto.profileStatus.stringValue,
				createdOn: result._fieldsProto.createdOn.stringValue,
				services: result._fieldsProto.services.arrayValue.values,
				sellerLevel: result._fieldsProto.sellerLevel.stringValue,
			};
			res.status(200).json({ user });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.post("/byId", async (req, res) => {
	try {
		const result = await user.doc(req.body.uId).get();
		if (!result.exists) res.send("User Does not Exists.");
		else {
			console.log(result._fieldsProto);
			res.send(result._fieldsProto);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
