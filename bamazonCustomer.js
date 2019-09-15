var mysql = require ("mysql");
var inquirer = require("inquirer");

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
    purchaseItem();
    });

    function purchaseItem() {
        connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
          if (err) throw err;
          inquirer.prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function(){
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                  choiceArray.push("Product ID: " + res[i].item_id +  " || " + "Item: " + res[i].product_name + " || " + "$" + res[i].price);
                }
                return choiceArray;
              },
              message: "Please select item for purchase:"
            },
            {
              name: "quantity",
              type: "input",
              message: "Please enter quantity desired:"
            }
          ])
            .then(function(answers) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                  if (res[i].item_id === answers.choice) {
                    chosenItem = res[i];
                  }
                }
                if (chosenItem.stock_quantity >= parseInt(answers.quantity)) {
                    var newQuantity = (chosenItem.stock_quantity) - parseInt(answers.quantity);
                  connection.query(
                    "UPDATE auctions SET ? WHERE ?",
                    [
                      {
                        stock_quantity: newQuantity
                      },
                      {
                        item_id: chosenItem.item_id
                      }
                    ], 
                    function (err) {
                      if (err) throw err;
                        console.log("Purchase complete! Total sale: $" + chosenItem.price);
                        initialPrompt();
                      }
                    );
                } 
                else {
                  console.log("Insufficient quantity in stock. Please try again later.");
                  purchaseItem();
                }
              });
            });
      };