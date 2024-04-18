import express, { Request, Response } from "express";
import { condb } from "../libs/condb";
import { body, validationResult } from "express-validator";

const router = express.Router();

// path ${endpoint}/categories

// get all
router.get("/", (req: Request, res: Response) => {
  try {
    condb.query(
      "select * from bid_shop_categories",
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
    "SELECT * FROM bid_shop_categories WHERE c_id = ?",
    [id],
    (err: any, result: any, fields: any) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Internal server error");
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.json(result[0]); // Assuming only one category is expected
    }
  );
});

// create
router.post(
  "/",
  [
    body("c_name").notEmpty(),
    body("c_description").notEmpty(),
    body("c_banner").notEmpty(),
    body("c_slug").notEmpty(),
    body("c_order").notEmpty(),
  ],
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { c_name, c_description, c_banner, c_slug, c_order } = req.body;

      condb.query(
        "INSERT INTO bid_shop_categories ( c_name, c_description, c_banner, c_slug, c_order) VALUES (?, ?, ?, ?, ?)",
        [c_name, c_description, c_banner, c_slug, c_order],
        (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Internal server error");
          }
          return res
            .status(201)
            .json({ message: "Category created successfully" });
        }
      );
    } catch (err) {
      return res.status(500).send("Internal server error");
    }
  }
);

// update by id
router.put("/:id", (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const { c_name, c_description, c_banner, c_slug, c_order } = req.body;

    // Step 1: Query the current values of the category from the database
    condb.query(
      "SELECT * FROM bid_shop_categories WHERE c_id = ?",
      [categoryId],
      (err, rows) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send("Internal server error");
        }

        if (rows.length === 0) {
          return res.status(404).json({ message: "Category not found" });
        }

        // Merge new values with existing ones
        const currentCategory = rows[0];
        const updatedCategory = {
          c_name: c_name || currentCategory.c_name,
          c_description: c_description || currentCategory.c_description,
          c_banner: c_banner || currentCategory.c_banner,
          c_slug: c_slug || currentCategory.c_slug,
          c_order: c_order || currentCategory.c_order,
        };

        // Step 2: Update the category with merged values
        condb.query(
          "UPDATE bid_shop_categories SET ? WHERE c_id = ?",
          [updatedCategory, categoryId],
          (err, result) => {
            if (err) {
              console.error("Error executing query:", err);
              return res.status(500).send("Internal server error");
            }

            return res
              .status(200)
              .json({ message: "Category updated successfully" });
          }
        );
      }
    );
  } catch (err) {
    console.error("Error handling request:", err);
    return res.status(500).send("Internal server error");
  }
});

// delete
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    condb.query(
      "DELETE FROM bid_shop_categories WHERE c_id = ?",
      [id],
      (err: any, result: any) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).send("Internal server error");
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Category not found" });
        }

        return res
          .status(200)
          .json({ message: "Category deleted successfully" });
      }
    );
  } catch (err) {
    console.error("Error handling request:", err);
    return res.status(500).send("Internal server error");
  }
});

export default router;
