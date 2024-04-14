"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mysql_1 = __importDefault(require("mysql"));
var topup_1 = __importDefault(require("./routes/topup"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
// MySQL connection configuration
var dbConfig = {
    host: "mysql-3c6b224c-msu-5de2.a.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_s_xng1w3lBmSFCP7FML",
    database: "game_account_pos",
};
// Create a MySQL connection pool
var pool = mysql_1.default.createPool(dbConfig);
// Helper function to execute MySQL queries
function executeQuery(query, params, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error("Error getting database connection:", err);
            callback(err);
            return;
        }
        connection.query(query, params, function (err, result) {
            connection.release();
            if (err) {
                console.error("Error executing query:", err);
                callback(err);
                return;
            }
            callback(null, result);
        });
    });
}
// API routes
// Users
// Create a new user
app.post("/users", function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password, email = _a.email, role = _a.role;
    var query = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
    executeQuery(query, [username, password, email, role], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.status(201).json({ id: result.insertId });
        }
    });
});
// Get all users
app.get("/users", function (req, res) {
    var query = "SELECT * FROM users";
    executeQuery(query, [], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.json(result);
        }
    });
});
// Update a user
app.put("/users/:id", function (req, res) {
    var id = req.params.id;
    var _a = req.body, username = _a.username, password = _a.password, email = _a.email, role = _a.role;
    var query = "UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?";
    executeQuery(query, [username, password, email, role, id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
// Delete a user
app.delete("/users/:id", function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM users WHERE id = ?";
    executeQuery(query, [id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
// Games
// Create a new game
app.post("/games", function (req, res) {
    var _a = req.body, name = _a.name, description = _a.description;
    var query = "INSERT INTO games (name, description) VALUES (?, ?)";
    executeQuery(query, [name, description], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.status(201).json({ id: result.insertId });
        }
    });
});
// Get all games
app.get("/games", function (req, res) {
    var query = "SELECT * FROM games";
    executeQuery(query, [], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.json(result);
        }
    });
});
// Update a game
app.put("/games/:id", function (req, res) {
    var id = req.params.id;
    var _a = req.body, name = _a.name, description = _a.description;
    var query = "UPDATE games SET name = ?, description = ? WHERE id = ?";
    executeQuery(query, [name, description, id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
// Delete a game
app.delete("/games/:id", function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM games WHERE id = ?";
    executeQuery(query, [id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
// Accounts
// Create a new account
app.post("/accounts", function (req, res) {
    var _a = req.body, gameId = _a.gameId, username = _a.username, password = _a.password, email = _a.email, level = _a.level, price = _a.price;
    var query = "INSERT INTO accounts (game_id, username, password, email, level, price) VALUES (?, ?, ?, ?, ?, ?)";
    executeQuery(query, [gameId, username, password, email, level, price], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.status(201).json({ id: result.insertId });
        }
    });
});
// Get all accounts
app.get("/accounts", function (req, res) {
    var query = "SELECT * FROM accounts";
    executeQuery(query, [], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.json(result);
        }
    });
});
// Update an account
app.put("/accounts/:id", function (req, res) {
    var id = req.params.id;
    var _a = req.body, gameId = _a.gameId, username = _a.username, password = _a.password, email = _a.email, level = _a.level, price = _a.price, isSold = _a.isSold;
    var query = "UPDATE accounts SET game_id = ?, username = ?, password = ?, email = ?, level = ?, price = ?, is_sold = ? WHERE id = ?";
    executeQuery(query, [gameId, username, password, email, level, price, isSold, id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
// Delete an account
app.delete("/accounts/:id", function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM accounts WHERE id = ?";
    executeQuery(query, [id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
// Orders
// Create a new order
app.post("/orders", function (req, res) {
    var _a = req.body, accountId = _a.accountId, userId = _a.userId, totalAmount = _a.totalAmount;
    var query = "INSERT INTO orders (account_id, user_id, total_amount) VALUES (?, ?, ?)";
    executeQuery(query, [accountId, userId, totalAmount], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.status(201).json({ id: result.insertId });
        }
    });
});
// Get all orders
app.get("/orders", function (req, res) {
    var query = "SELECT * FROM orders";
    executeQuery(query, [], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.json(result);
        }
    });
});
// Update an order
app.put("/orders/:id", function (req, res) {
    var id = req.params.id;
    var _a = req.body, accountId = _a.accountId, userId = _a.userId, totalAmount = _a.totalAmount;
    var query = "UPDATE orders SET account_id = ?, user_id = ?, total_amount = ? WHERE id = ?";
    executeQuery(query, [accountId, userId, totalAmount, id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
// Delete an order
app.delete("/orders/:id", function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM orders WHERE id = ?";
    executeQuery(query, [id], function (err, result) {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        }
        else {
            res.sendStatus(204);
        }
    });
});
app.use("/topup", topup_1.default);
// Start the server
app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
