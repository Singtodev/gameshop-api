const express = require("express");
const router = express.Router();
import { Request, Response } from "express";


router.get("", async (req: Request, res: Response) => {
  return res.send("Auth is work!");
});

router.post("login", async (req: Request, res: Response) => {
  
});

export default router;
