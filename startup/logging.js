const winston = require('winston');
require("express-async-errors");

module.exports = function(){
  process.on("uncaughtException", (ex) => {
		winston.error(ex.message, ex);
		process.exit(1);
	});
  
	winston.exceptions.handle( new winston.transports.File({
		filename: "unCaughtExceptions.log",
	}));

	process.on("unhandledRejection", (ex) => {
		winston.error(ex.message, ex);
		process.exit(1);
	});

	winston.add(winston.transports.File, { filename: "logfile.log" });
};