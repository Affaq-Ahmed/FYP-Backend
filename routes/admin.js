const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

const admin = db.collection("admin");
const category = db.collection("category");
const service = db.collection("services");
const user = db.collection("users");
const order = db.collection("order");
const feedback = db.collection("feedback");
const FAQs = db.collection("FAQs");

//CREATE ADMIN
router.post("/", async (req, res) => {
	try {
		const data = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			username: req.body.username,
			email: req.body.email,
			DoB: req.body.DoB,
			phone: req.body.phone,
			address: req.body.address,
			createdOn: new Date(),
			image: req.body.image,
		};
		const adminRef = await admin.add(data);

		const adminSnapshot = await adminRef.get();

		const adminData = adminSnapshot.data();
		adminData.id = adminSnapshot.id;

		res.status(200).json(adminData);
	} catch {
		console.log(error);
		res.status(500).send(error);
	}
});

//Approve User
router.post("/approveUser", async (req, res) => {});
