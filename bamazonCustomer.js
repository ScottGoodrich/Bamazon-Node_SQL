var mysql = require ("mysql");
var inquirer = require("inquirer");
var divider = "———————————————————————————————————";

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Baseballjunkie1",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected as id " + connection.threadId);
    });

