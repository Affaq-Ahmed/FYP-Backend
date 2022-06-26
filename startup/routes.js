const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const user = require("./../routes/user");
const service = require("./../routes/service");
const order = require("./../routes/order");
const category = require("./../routes/category");
const feedback = require("./../routes/feedback");
const FAQs = require("./../routes/FAQs");
const admin = require("./../routes/admin");
const report = require("./../routes/report");

const error = require("./../middleware/error");

module.exports = function (app) {
	app.use(express.json());
	app.use(bodyParser.json());
	app.use(cors());

	app.use("/api/users", user);
	app.use("/api/services", service);
	app.use("/api/order", order);
	app.use("/api/feedback", feedback);
	app.use("/api/category", category);
	app.use("/api/FAQs", FAQs);
	app.use("/api/admin", admin);
	app.use("/api/report", report);

	app.use(error);
};
