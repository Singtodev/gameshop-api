import express, { Request, Response } from "express";
import { condb } from "../libs/condb";
import { body, validationResult } from "express-validator";
const router = express.Router();

// path ${endpoint}/product

// get all
router.get("/", (req: Request, res: Response) => {
  try {
    condb.query(
      "select * from bid_shop_products",
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
    "SELECT * FROM bid_shop_products WHERE p_id = ?",
    [id],
    (err: any, result: any, fields: any) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Internal server error");
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.json(result[0]); // Assuming only one product is expected
    }
  );
});
// create
router.post(
  "/",
  [
    // Validation middleware for request body parameters
    body("p_name").notEmpty(),
    body("p_description").notEmpty(),
    body("p_banner").notEmpty(),
    body("p_price").notEmpty(),
    body("p_discount").notEmpty(),
    body("p_is_discount").notEmpty(),
    body("p_category_id").notEmpty(),
  ],
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        p_name,
        p_description,
        p_banner,
        p_price,
        p_discount,
        p_is_discount,
        p_category_id,
      } = req.body;

      // Insert the new product into the database
      condb.query(
        "INSERT INTO bid_shop_products (p_name, p_description, p_banner, p_price, p_discount, p_is_discount, p_category_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          p_name,
          p_description,
          p_banner,
          p_price,
          p_discount,
          p_is_discount,
          p_category_id,
        ],
        (err: any, result: any) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Internal server error");
          }
          return res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId,
          });
        }
      );
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
  }
);

// update by id
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID format
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const updatedProductData = req.body;

  condb.query(
    "SELECT * FROM bid_shop_products WHERE p_id = ?",
    [id],
    (err: any, result: any, fields: any) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Internal server error");
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const existingProductData = result[0];

      // Merge existing product data with updated data
      const mergedProductData = {
        ...existingProductData,
        ...updatedProductData,
      };

      // Update the product in the database
      condb.query(
        "UPDATE bid_shop_products SET ? WHERE p_id = ?",
        [mergedProductData, id],
        (updateErr: any, updateResult: any) => {
          if (updateErr) {
            console.error("Error executing update query:", updateErr);
            return res.status(500).send("Internal server error");
          }
          return res.json({ message: "Product updated successfully" });
        }
      );
    }
  );
});

// delete
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate ID format
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  // Execute the delete query
  condb.query(
    "DELETE FROM bid_shop_products WHERE p_id = ?",
    [id],
    (err: any, result: any) => {
      if (err) {
        console.error("Error executing delete query:", err);
        return res.status(500).send("Internal server error");
      }

      // Check if the product exists
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Respond with success message
      return res.json({ message: "Product deleted successfully" });
    }
  );
});

export default router;
