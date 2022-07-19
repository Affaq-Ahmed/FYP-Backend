const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const user = db.collection("users");

router.get("/", async (req, res) => {
	try {
		const snapshot = await user.get();

		var users = [];
		snapshot.forEach((doc) => {
			var user = doc.data();
			console.log(doc.id, "=>", doc.data());
			user.id = doc.id;
			users.push(user);
		});
		res.status(200).send(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//GET ALL PENDING USERS
router.get("/pendingUsers", async (req, res) => {
	try {
		const userSnapshot = await user.where("profileStatus", "==", "0").get();

		const userData = userSnapshot.docs
			.map((doc) => {
				const data = doc.data();
				data.id = doc.id;
				return data;
			})
			.sort((a, b) => {
				return a.createdOn - b.createdOn;
			})
			.reverse();

		res.status(200).json(userData);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//GET USER COUNT AND NEW USERS TODAY
router.get("/userCount", async (req, res) => {
	try {
		//GET USER COUNT
		const userCount = await user.get();
		const userCountData = userCount.docs.map((doc) => {
			const data = doc.data();
			data.id = doc.id;
			return data;
		}).length;

		//GET NEW USERS TODAY
		const today = new Date();
		const todayStart = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const todayEnd = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 1
		);
		const todaySnapshot = await user
			.where("createdOn", ">=", todayStart)
			.where("createdOn", "<", todayEnd)
			.get();
		const todayUserCount = todaySnapshot.docs.map((doc) => {
			const data = doc.data();
			data.id = doc.id;
			return data;
		}).length;

		res
			.status(200)
			.json({ userCount: userCountData, newUsers: todayUserCount });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//TOTAL EARNINGS OF A SELLER
router.get("/totalEarnings/:uid", async (req, res) => {
	try {
		const userSnapshot = await user.doc(req.params.uid).get();

		const userData = userSnapshot.data();
		const totalEarnings = userData.earnings;

		res.status(200).json(totalEarnings);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//EARNINGS OF ALL SERVICES OF A SELLER IN CURRENT MONTH
router.get("/monthlyEarnings/:uid", async (req, res) => {
	try {
		//Get SELLER
		const userSnapshot = await user.doc(req.params.uid).get();
		//GET ALL COMPLETED ORDERS OF SELLER IN CURRENT MONTH
		const ordersSnapshot = await db
			.collection("orders")
			.where("sellerId", "==", req.params.uid)
			.where("status", "==", "3")
			.get();

		//ADD PRICE OF ALL COMPLETED ORDERS OF SELLER
		var totalEarnings = 0;
		ordersSnapshot.forEach((doc) => {
			const data = doc.data();
			totalEarnings += data.price;
		});

		res.status(200).json(totalEarnings);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//CREATE A USER
router.post("/createProfile", async (req, res) => {
	console.log(req.body);
	try {
		// const checkCNIC = await user.where("cnic", "==", req.body.cnic).get();
		// if (checkCNIC) res.status(409).send("CNIC Already Exists.");
		// console.log(checkCNIC);

		const check = await user.doc(req.body.uId).get();
		if (check.exists) {
			res.status(409).json("User already exists");
		} else {
			const data = req.body;
			const date = new Date();

			var userData = {
				firstName: data.firstName,
				lastName: data.lastName,
				dob: data.dob,
				email: data.email,
				address: data.address,
				phone: data.phone,
				cnic: data.cnic,
				profileImage: data.profileImage,
				profileStatus: "0", //0: not verified, 1: verified ,2: processing
				cnicPhoto: "",
				createdOn: date,
				services: [],
				sellerLevel: "Beginner",
				preference: data.preference,
				earnings: 0,
				balance: 0,
				rating: 0,
			};

			const result = await user.doc(data.uId).set(userData);
			console.log(result);
			res.status(201).json({ message: "User Created Successfully." });
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
});

router.post("/editProfile", async (req, res) => {
	try {
		const check = await user.doc(req.body.uId).get();
		if (!check) res.status(409).json("User Not Found.");
		else {
			console.log(check);
			const data = req.body;
			console.log(data);
			const updatedUser = await user.doc(data.uId).update({
				firstName: data.firstName,
				lastName: data.lastName,
				dob: data.dob,
				address: data.address,
				phone: data.phone,
				profileImage: data.profileImage
					? data.profileImage
					: check.data().profileImage,
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
				cnic: result._fieldsProto.cnic.stringValue,
				email: result._fieldsProto.email.stringValue,
				profileStatus: result._fieldsProto.profileStatus.stringValue,
				createdOn: result._fieldsProto.createdOn.stringValue,
				services: result._fieldsProto.services.arrayValue.values.map(
					(service) => {
						return service.stringValue;
					}
				),
				sellerLevel: result._fieldsProto.sellerLevel.stringValue,
				preference: result._fieldsProto.preference.mapValue.fields,
				earnings: result._fieldsProto.earnings.integerValue,
				balance: result._fieldsProto.balance.integerValue,
				rating: result._fieldsProto.rating.integerValue,
			};
			console.log(user);
			res.status(200).json({ user });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

router.get("/byId/:id", async (req, res) => {
	try {
		const result = await user.doc(req.params.id).get();
		if (!result) res.send("User Does not Exists.");
		else {
			const user = {
				id: result.id,
				address: result._fieldsProto.address.stringValue,
				dob: result._fieldsProto.dob.stringValue,
				firstName: result._fieldsProto.firstName.stringValue,
				lastName: result._fieldsProto.lastName.stringValue,
				profileImage: result._fieldsProto.profileImage.stringValue,
				phone: result._fieldsProto.phone.stringValue,
				cnic: result._fieldsProto.cnic.stringValue,
				email: result._fieldsProto.email.stringValue,
				profileStatus: result._fieldsProto.profileStatus.stringValue,
				createdOn: result._fieldsProto.createdOn.stringValue,
				services: result._fieldsProto.services.arrayValue.values.map(
					(service) => {
						return service.stringValue;
					}
				),
				sellerLevel: result._fieldsProto.sellerLevel.stringValue,
				preference: result._fieldsProto.preference.mapValue.fields,
			};
			console.log(user);
			res.status(200).json({ user });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
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

//CHANGE PREFERANCE
router.post("/changePreference", async (req, res) => {
	try {
		const check = user.doc(req.body.uId).get();
		if (check.exists) res.status(200).send("User Does not Exists.");
		else {
			const data = req.body;
			// console.log(data);
			const updatedUser = await user.doc(data.uId).update({
				preference: {
					language: data.preference.language.toString(),
					userMode: data.preference.userMode.toString(),
				},
			});
			console.log(updatedUser);
			res.status(200).send(updatedUser);
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
});

//GET ORDER COMPLETION RATE OF A SELLER
router.get("/orderCompletionRate/:id", async (req, res) => {
	try {
		//GET ALL ORDERS OF A SELLER
		const orders = await order.where("sellerId", "==", req.params.id).get();
		//GET ALL COMPLETED ORDERS OF A SELLER
		const completedOrders = orders.docs.filter(
			(order) => order.data().status === "3"
		);
		//COUNT OF COMPLETED ORDERS
		const countCompleted = completedOrders.length;
		//GET ALL COMPLETED, CANCELLED AND ACCPETED ORDERS OF A SELLER
		const acceptedOrders = orders.docs.filter(
			(order) =>
				order.data().status === "1" ||
				order.data().status === "4" ||
				order.data().status === "0"
		);
		//COUNT OF COMPLETED ORDERS
		const countAccepted = orders.length - acceptedOrders.length;
		//CALCULATE ORDER COMPLETION RATE
		const orderCompletionRate = (countCompleted / countAccepted) * 100;

		res.status(200).json({ orderCompletionRate });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
});

//GET ACTIVE ORDERS COUNT OF A SELLER
router.get("/activeOrders/:id", async (req, res) => {
	try {
		//GET ALL ORDERS OF A SELLER
		const orders = await order.where("sellerId", "==", req.params.id).get();
		//GET ALL ACTIVE ORDERS OF A SELLER
		const activeOrders = orders.docs.filter(
			(order) => order.data().status === "1" || order.data().status === "4"
		);
		//COUNT OF ACTIVE ORDERS
		const countActive = activeOrders.length;

		res.status(200).json({ countActive });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
