var mysql = require ("mysql");
var inquirer = require("inquirer");
var divider = "———————————————————————————————";

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
    mainMenu();
    });

    function mainMenu() {
        inquirer.prompt([
        {
            name: 'menu',
            type: 'list',
            message: 'What would you like to do?',
            choices: ["VIEW PRODUCTS FOR SALE","VIEW LOW INVENTORY","ADD TO INVENTORY", "ADD NEW PRODUCT", "EXIT"],
        },
      ])
      .then(answers => {
        console.log('Answer:', answers.menu);
        if (answers.menu === "VIEW PRODUCTS FOR SALE") {
            viewProducts();
        }
        if (answers.menu === "VIEW LOW INVENTORY") {
            lowInventory();
        if (answers.menu === "ADD TO INVENTORY") {
            addInventory();
        }
        if (answers.menu === "ADD NEW PRODUCT") {
            addProduct();
        }
        } else {
            connection.end();
        }
      });
    };

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function() {
                    var choiceArray = ["MAIN MENU"];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push("Product ID: " + res[i].item_id +  " || " + "Item: " + res[i].product_name + " || " + "$" + res[i].price + " || " + "Units in stock: " + res[i].stock_quantity);
                    }
                    return choiceArray;
                },
            }
        ]).then(function(answers) {
            if (answers.choice === "MAIN MENU") {
                mainMenu();
            }
        })
    })
};

function lowInventory() {
    connection.query("SELECT * FROM products GROUP BY item_id HAVING stock_quantity < 5", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function() {
                    var choiceArray = ["MAIN MENU"];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push("Product ID: " + res[i].item_id +  " || " + "Item: " + res[i].product_name + " || " + "$" + res[i].price + " || " + "Units in stock: " + res[i].stock_quantity);
                    }
                    if (res.length < 1) {
                        console.log(divider + "\n" + "No items are currently low in stock." + "\n" + divider);
                    }
                    return choiceArray;
                },
            }
        ]).then(function(answers) {
            if (answers.choice === "MAIN MENU") {
                mainMenu();
            }
        })
    })
};

function addInventory(){

};

function addProduct(){

};