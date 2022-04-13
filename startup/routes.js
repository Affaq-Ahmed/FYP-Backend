const express = require('express');
const user = require('./../routes/user');
const service = require("./../routes/service");

const error = require("./../middleware/error");

module.exports = function(app){
  app.use(express.json());
  app.use('/api/users', user);
  app.use("/api/services", service);
	app.use(error);
};