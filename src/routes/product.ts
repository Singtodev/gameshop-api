import express, { Request, Response } from "express";

const router = express.Router();

// path ${endpoint}/product

// get all
router.get("/", (req: Request, res: Response) => {
  return res.send("GET ALL");
});

router.get("/:id", (req: Request, res: Response) => {
  return res.send("GET BY ID");
});

// create
router.post("/", (req: Request, res: Response) => {
  return res.send("CREATE");
});

// update by id
router.put("/:id", (req: Request, res: Response) => {
  return res.send("UPDATE BY ID");
});

// delete
router.delete("/:id", (req: Request, res: Response) => {
  return res.send("DELETE BY ID");
});

export default router;
