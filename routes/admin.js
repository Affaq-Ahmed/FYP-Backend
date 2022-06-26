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
		const adminRef = await admin.doc(req.body.uid).add(data);

		const adminSnapshot = await adminRef.get();

		const adminData = adminSnapshot.data();
		adminData.id = adminSnapshot.id;

		res.status(201).json(adminData);
	} catch {
		console.log(error);
		res.status(500).send(error);
	}
});

//VERIFY User
router.post("/approveUser", async (req, res) => {
	try {
		const userRef = await user.doc(req.body.uid).update({
			profileStatus: "1",
		});

		res.status(200).json("User approved successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//REJECT User
router.post("/rejectUser", async (req, res) => {
	try {
		const userRef = await user.doc(req.body.uid).update({
			profileStatus: "0",
		});

		res.status(200).json("User rejected successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//CREATE CATEGORY
router.post("/category", async (req, res) => {
	try {
		const data = {
			name: req.body.name,
			createdOn: new Date(),
			imageUrl: req.body.imageURL,
		};
		const categoryRef = await category.doc(req.body.uid).add(data);

		res.status(201).json("Category Created Successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//DELETE A USER
router.delete("/user:uid", async (req, res) => {
  try {
    const userRef = await user.doc(req.params.uid).delete();

    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})

module.exports = router;
