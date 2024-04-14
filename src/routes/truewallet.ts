const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { TrueMoneyWalletService } from "../services/truewallet";

router.get("", async (req: Request, res: Response) => {
  return res.send("Truewallet is work");
});

router.post("", async (req: Request, res: Response) => {
  try {
    const { gift_link } = req.body;

    if (!gift_link) {
      throw new Error("gift_link is required!");
    }

    // Check use is login by token
    const Tw = new TrueMoneyWalletService();
    const topup = await Tw.requestTopupByRedEnvelope(
      "https://gift.truemoney.com/campaign/?v=UeiJobWAiWkqJbcpef"
    );

    if (topup.status === "success") {
      // Case topup success
      // Calculate the rate of adding points
      let point = topup.amount * 1;
      // Saving History to database
      return res.status(200).json({
        message: "เติมเงินสำเร็จ!",
        amount: topup.amount + "บาท",
        time: topup.time,
      });
    }

    if (topup.status === "error") {
      return res.status(401).json({
        message: topup.message,
      });
    }
    return res.send("Ok");
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
