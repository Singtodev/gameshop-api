import express, { Request, Response } from "express";
import { condb } from "../libs/condb";
import { body, validationResult } from "express-validator";
const router = express.Router();

// path ${endpoint}/

// get all
router.get("/", (req: Request, res: Response) => {
  try {
    condb.query(
      "select * from bid_shop_accounts",
      (err: any, result: any, fields: any) => {
        return res.json(result);
      }
    );
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID format
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  condb.query(
    "SELECT * FROM bid_shop_accounts WHERE a_id = ?",
    [id],
    (err: any, result: any, fields: any) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Internal server error");
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Account not found" });
      }

      return res.json(result[0]); // Assuming only one product is expected
    }
  );
});

router.post(
  "/",
  [body("p_id").notEmpty(), body("id").notEmpty(), body("pass").notEmpty()],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { p_id, id, pass } = req.body;

    // Insert new  account into the database
    condb.query(
      "INSERT INTO bid_shop_accounts (p_id, id, pass) VALUES (?, ?, ?)",
      [p_id, id, pass],
      (err: any, result: any) => {
        if (err) {
          console.error("Error creating  account:", err);
          return res.status(500).send("Internal server error");
        }
        return res.status(201).json({
          message: "Account created successfully",
          accountId: result.insertId,
        });
      }
    );
  }
);

// update by id
router.put("/:id", (req: Request, res: Response) => {
  const accountId = req.params.id;
  const updatedData = req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Retrieve the existing  account data from the database
  condb.query(
    "SELECT * FROM bid_shop_accounts WHERE a_id = ?",
    [accountId],
    (err: any, result: any) => {
      if (err) {
        console.error("Error retrieving  account:", err);
        return res.status(500).send("Internal server error");
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Account not found" });
      }

      const existingAccountData = result[0];

      // Merge existing  account data with updated data
      const mergedAccountData = { ...existingAccountData, ...updatedData };

      // Update the  account in the database with the merged data
      condb.query(
        "UPDATE bid_shop_accounts SET ? WHERE a_id = ?",
        [mergedAccountData, accountId],
        (updateErr: any, updateResult: any) => {
          if (updateErr) {
            console.error("Error updating account:", updateErr);
            return res.status(500).send("Internal server error");
          }
          return res.json({ message: "Account updated successfully" });
        }
      );
    }
  );
});

router.delete("/:id", (req: Request, res: Response) => {
  const accountId = req.params.id;

  // Delete the  account from the database
  condb.query(
    "DELETE FROM bid_shop_accounts WHERE a_id = ?",
    [accountId],
    (err: any, result: any) => {
      if (err) {
        console.error("Error deleting  account:", err);
        return res.status(500).send("Internal server error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Account not found" });
      }

      return res.json({ message: "Account deleted successfully" });
    }
  );
});

// advance method
// find all account by product id
router.get("/product/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    condb.query(
      "SELECT * FROM bid_shop_accounts WHERE p_id = ?",
      [id],
      (err: any, result: any, fields: any) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send("Internal server error");
        }

        return res.json(result);
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error");
  }
});

export default router;
