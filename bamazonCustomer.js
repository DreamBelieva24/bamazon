// Display all of the items available for sale. Include the ids, names, and prices of products for sale.

var mysql = require("mysql");
var inquirer = require("inquirer");

if (process.argv[2] === "list") {

    var connection = mysql.createConnection({
        host: "localhost",
        port: 8889,
        user: "root",
        password: "root",
        database: "bamazon"
    });
    
    connection.connect(function (err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId);
        afterConnection();
    });
    
    function afterConnection() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            console.log(res)
        }) 
        
    }
}
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nWelcome to Ye Scurvy Pirate Shoppe!\n")
        for (var i = 0; i < res.length; i++) {
            
            console.log("id = " + res[i].id + " | " + res[i].product_name + " | $" + res[i].price);
          }  //   connection.end();
          startSale();
    }) 
}

// Prompt users with two messages.

function startSale () {
    
    inquirer.prompt([

    {
        type: "input",
        name: "purchase",
        message: "\nArgh, what ye be wanting today? ID = "
    },
    // The first should ask them the ID of the product they would like to buy.
    {
        type: "input",
        name: "quantity",
        message: "\nAnd how many will ye be asking for?",
    },
    // The second message should ask how many units of the product they would like to buy.

])
    // Once the customer has placed the order, your application should check if your store has enough 
    // of the product to meet the customer's request.
    // purchase = id
    // quantity <= stock_quantity

    .then(function (user) {

        var purchase = user.purchase
        var quantity = user.quantity

        // console.log(purchase);
        // console.log(quantity);

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            var itemId = parseInt(user.purchase) - 1
            var quantity = parseInt(user.quantity)

            // console.log(typeof(itemId));
            // console.log("Chosen = " + res[itemId].product_name)

            if (res[itemId].stock_quantity >= quantity) {
                console.log("\nWe have an accord!")
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: (res[itemId].stock_quantity - quantity)
                        },
                        {
                            id: user.purchase
                        }
                    ],

                    console.log("\nThat'll be $" + res[itemId].price * quantity + "\n")
                )
            }
            else {
                console.log("\nSorry mate. We only have " + res[itemId].stock_quantity +
                    " left of that thar item!\n")
            }
            connection.end();
        }
        )
    })}

