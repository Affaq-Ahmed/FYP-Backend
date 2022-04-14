const express = require("express");
const user = require("./../routes/user");
const service = require("./../routes/service");
const order = require("./../routes/order");
const category = require("./../routes/category");
const feedback = require("./../routes/feedback");

const error = require("./../middleware/error");

module.exports = function (app) {
	app.use(express.json());

	app.use("/api/users", user);
	app.use("/api/services", service);
	app.use("/api/order", order);
	//app.use("/api/feedback", feedback);
	app.use("/api/category", category);

	app.use(error);
};
