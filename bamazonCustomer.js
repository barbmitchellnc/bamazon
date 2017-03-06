var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Buddycat22",
    database: "bamazon_db"
});

console.log("Welcome to Bamazon! We  currently sell:");



var productSearch = function () {
    var query = "SELECT * FROM products";

    connection.query(query, function (err, res) {
        if (err) throw err;

        // console.log(res)
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price:" + res[i].price);
        }


        inquirer.prompt([{
            name: "product",
            type: "input",
            message: "What product are you looking for today? Please input the Product item_id."
        }, {
            name: "quantity",
            type: "input",
            message: "How many would you like to order?"
        }]).then(function (answer) {

            var query = "SELECT * FROM products WHERE item_id = ?";
            connection.query(query, [answer.product], function (err, res) {
                if (err) throw err;
                
                var basePrice = res[0].price;
                if (parseInt(answer.quantity) <= res[0].stock_quantity) {

                    connection.query("UPDATE products SET products.stock_quantity= ? WHERE item_id=? ", [res[0].stock_quantity - parseInt(answer.quantity), answer.product], function (err, res) {
                        if (err) throw err;
                        console.log("Thank you - your order has been placed");
                    
                        var price = (parseInt(answer.quantity) * basePrice);
                        console.log("Your purchase cost is  $" + price);
                        productSearch();
                    });
                } else {
                    console.log("Sorry! Insufficient Quantity in stock.")
                    productSearch();
                };

            });
        });
    });
}

productSearch();