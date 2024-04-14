import express, { Request, Response } from "express";
import mysql, { Pool, MysqlError } from "mysql";
import TrueWalletRouter from "./routes/truewallet";
import AuthRouter from "./routes/auth";

const app = express();
app.use(express.json());

// MySQL connection configuration
const dbConfig = {
  host: "mysql-3c6b224c-msu-5de2.a.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_s_xng1w3lBmSFCP7FML",
  database: "game_account_pos",
};
// Create a MySQL connection pool
const pool: Pool = mysql.createPool(dbConfig);

// Helper function to execute MySQL queries
function executeQuery(
  query: string,
  params: any[],
  callback: (err: MysqlError | null, result?: any) => void
) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      callback(err);
      return;
    }

    connection.query(query, params, (err, result) => {
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
app.post("/users", (req: Request, res: Response) => {
  const { username, password, email, role } = req.body;
  const query =
    "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
  executeQuery(query, [username, password, email, role], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ id: result.insertId });
    }
  });
});

// Get all users
app.get("/users", (req: Request, res: Response) => {
  const query = "SELECT * FROM users";
  executeQuery(query, [], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result);
    }
  });
});

// Update a user
app.put("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password, email, role } = req.body;
  const query =
    "UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?";
  executeQuery(query, [username, password, email, role, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.sendStatus(204);
    }
  });
});

// Delete a user
app.delete("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  executeQuery(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.sendStatus(204);
    }
  });
});

// Games

// Create a new game
app.post("/games", (req: Request, res: Response) => {
  const { name, description } = req.body;
  const query = "INSERT INTO games (name, description) VALUES (?, ?)";
  executeQuery(query, [name, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ id: result.insertId });
    }
  });
});

// Get all games
app.get("/games", (req: Request, res: Response) => {
  const query = "SELECT * FROM games";
  executeQuery(query, [], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result);
    }
  });
});

// Update a game
app.put("/games/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const query = "UPDATE games SET name = ?, description = ? WHERE id = ?";
  executeQuery(query, [name, description, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.sendStatus(204);
    }
  });
});

// Delete a game
app.delete("/games/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const query = "DELETE FROM games WHERE id = ?";
  executeQuery(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.sendStatus(204);
    }
  });
});

// Accounts

// Create a new account
app.post("/accounts", (req: Request, res: Response) => {
  const { gameId, username, password, email, level, price } = req.body;
  const query =
    "INSERT INTO accounts (game_id, username, password, email, level, price) VALUES (?, ?, ?, ?, ?, ?)";
  executeQuery(
    query,
    [gameId, username, password, email, level, price],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(201).json({ id: result.insertId });
      }
    }
  );
});

// Get all accounts
app.get("/accounts", (req: Request, res: Response) => {
  const query = "SELECT * FROM accounts";
  executeQuery(query, [], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result);
    }
  });
});

// Update an account
app.put("/accounts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { gameId, username, password, email, level, price, isSold } = req.body;
  const query =
    "UPDATE accounts SET game_id = ?, username = ?, password = ?, email = ?, level = ?, price = ?, is_sold = ? WHERE id = ?";
  executeQuery(
    query,
    [gameId, username, password, email, level, price, isSold, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.sendStatus(204);
      }
    }
  );
});

// Delete an account
app.delete("/accounts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const query = "DELETE FROM accounts WHERE id = ?";
  executeQuery(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.sendStatus(204);
    }
  });
});

// Orders

// Create a new order
app.post("/orders", (req: Request, res: Response) => {
  const { accountId, userId, totalAmount } = req.body;
  const query =
    "INSERT INTO orders (account_id, user_id, total_amount) VALUES (?, ?, ?)";
  executeQuery(query, [accountId, userId, totalAmount], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ id: result.insertId });
    }
  });
});

// Get all orders
app.get("/orders", (req: Request, res: Response) => {
  const query = "SELECT * FROM orders";
  executeQuery(query, [], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result);
    }
  });
});

// Update an order
app.put("/orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { accountId, userId, totalAmount } = req.body;
  const query =
    "UPDATE orders SET account_id = ?, user_id = ?, total_amount = ? WHERE id = ?";
  executeQuery(query, [accountId, userId, totalAmount, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.sendStatus(204);
    }
  });
});

// Delete an order
app.delete("/orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const query = "DELETE FROM orders WHERE id = ?";
  executeQuery(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.sendStatus(204);
    }
  });
});

app.use("/topup", TrueWalletRouter);
app.use("/auth", AuthRouter);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
