var mysql = require ("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
var ID = process.env.ID_SECRET;
var divider = "———————————————————————————————";

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: ID,
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
            choices: ["VIEW PRODUCTS FOR SALE","VIEW LOW INVENTORY","ADD TO INVENTORY", "ADD NEW ITEM", "EXIT"]
        },
      ])
      .then(answers => {
        console.log('Answer:', answers.menu);
        if (answers.menu === "VIEW PRODUCTS FOR SALE") {
            viewProducts();
        }
        if (answers.menu === "VIEW LOW INVENTORY") {
            lowInventory();
        }
        if (answers.menu === "ADD TO INVENTORY") {
            addInventory();
        }
        if (answers.menu === "ADD NEW ITEM") {
            addItem();
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

function addInventory() {
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
                message: "Choose product to add stock:"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to add to inventory?"
            }
        ]).then(function(answers) {
            if (answers.choice === "MAIN MENU") {
                mainMenu();
            }
            var chosenItem;
                for (var i = 0; i < res.length; i++) {
                  if (res[i].item_id === answers.choice) {
                    chosenItem = res[i];
                    var newValue = chosenItem.stock_quantity += parseInt(answers.quantity)
                  }
                }
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newValue
                },
                {
                    item_id: chosenItem.item_id
                }
            ],function(err){
                if (err) throw err;

            })
            console.log("You have added " + answers.quantity + " units of " + chosenItem.item_id + " to inventory.");
        })
    })
};

function addItem() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "New item name:"
        },
        {
            name: "department",
            type: "input",
            message: "Department:"
        },
        {
            name: "price",
            type: "input",
            message: "Price per unit:"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units to be added:"
        }
    ]).then(function(answers) {
        connection.query(
            "INSERT INTO products SET ?",
        {
            product_name: answers.name,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.quantity
        }
        ,function(err) {
            if (err) throw err;
            console.log("You have added " + answers.quantity + " units of " + answers.name + " into inventory.");
            viewProducts();
        }
        )
    })
};