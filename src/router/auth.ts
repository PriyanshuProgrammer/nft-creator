import { Router, Request, Response } from "express";
import { PrismaClient } from "../../src/generated/prisma/client";

const client = new PrismaClient();

export const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "server",
  });
});

router.post("/signin", (req: Request, res: Response) => {
  const body = req.body;
  try {
    const email = body.email;
  } catch (e) {
    res.json({
      message: "Otp failed to send.",
    });
  }
});

router.post("/verify", (req, res) => {
  const body = req.body;
});

router.post("/signup", async (req: Request, res: Response) => {
  const body = req.body;
  const name = body.name;
  const email = req.body.email;

  try {
    // send otp to user email;
  } catch (e) {
    res.json({
      message: e,
    });
  }
});
