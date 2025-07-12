import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../src/generated/prisma/client";
import { generateTotp, verifyTotp } from "../utils/totp";
import { sendMail } from "../utils/mail";
import jwt from "jsonwebtoken";
const fallbackSecret = "asdfa343f3FA#F#";

const client = new PrismaClient();

export const router = Router();

// middlewares
const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const email = body.email;

  // check if user exists
  const user = await client.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user) {
    res.json({
      message: "User already exists!!",
      user: true,
    });
  } else {
    next();
  }
};

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const password = req.body.password;
  if (password && password === process.env.ADMIN_PASSWORD) next();
  else {
    res.json({
      message: "Invaild password for admin",
      admin: false,
    });
  }
};

const checkUserAlreadyExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const email = body.email;

  // check if user exists
  const user = await client.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    res.json({
      message: "User doesn't exists!!",
      user: false,
    });
  } else {
    next();
  }
};

const verifyTokenToSignin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.token;
  const isVerified = verifyAuthToken(token);
  if (!isVerified) {
    res.json({
      message: "Token not verified!!!",
    });
  } else next();
};

//functions

//create auth token
const createAuthToken = (email: string, totp: string) => {
  const secret = process.env.AUTH_TOKEN_SECRET ?? fallbackSecret;
  const token = jwt.sign(
    {
      email,
      totp,
    },
    secret
  );
  return token;
};

//verify auth token
const verifyAuthToken = (token: string) => {
  const secret = process.env.AUTH_TOKEN_SECRET ?? fallbackSecret;
  const verify = jwt.verify(token, secret);
  return verify;
};

// routes
router.get("/", (req, res) => {
  res.json({
    message: "server",
  });
});

router.post(
  "/signin-with-token",
  verifyTokenToSignin,
  async(req: Request, res: Response) => {
    const token = req.body.token;
    const email = JSON.parse(jwt.decode(token) as string).email;
    try {
      const user = await client.user.findFirst({
        where: {
          email: email,
        },
      });
      res.json({
        message: "Signed in successfully!!!",
        user:{
          name: user?.name,
          email: user?.email,
        }
      })
    } catch (e) {
      res.json({
        message: "Error in finding the user!!!",
        error: e,
      });
    }
  }
);

router.post(
  "/signin-with-otp",
  checkUserAlreadyExist,
  (req: Request, res: Response) => {
    const body = req.body;
    const email = body.email;
    const topt = generateTotp(email);
    try {
      // send otp to user email
      sendMail(email, "Your OTP", `Your OTP is ${topt}`);
      res.json({
        message: "Otp sent successfully",
        user: false,
      });
    } catch (e) {
      res.json({
        message: e,
      });
    }
  }
);

router.post("/verify", async (req, res) => {
  const body = req.body;
  //get all info from user
  const totp = body.totp;
  const email = body.email;

  // verify totp
  const verify = verifyTotp(totp, email);

  if (verify) {
    // create auth token
    const authToken = createAuthToken(email, totp);

    // chaged "verified" to true in the database
    await client.user.update({
      where: {
        email: email,
      },
      data: {
        verified: true,
      },
    });

    res.json({
      message: "User verified successfully!!",
      authToken,
    });
  } else {
    res.json({
      message: "Opt is invalid!!!",
      signup: false,
    });
  }
});

router.post("/signup/", checkUser, async (req: Request, res: Response) => {
  const body = req.body;
  const email = body.email;
  const name = body.name;
  // generating TOTP
  const topt = generateTotp(email);
  try {
    // send otp to user email
    sendMail(email, "Your OTP", `Your OTP is ${topt}`);

    // create an entry for the user to database
    await client.user.create({
      data: {
        email: email,
        name: name,
      },
    });

    res.json({
      message: "Otp sent successfully",
      user: false,
    });
  } catch (e) {
    res.json({
      message: e,
    });
  }
});

router.delete(
  "/delete/",
  checkAdmin,
  checkUserAlreadyExist,
  async (req: Request, res: Response) => {
    const email = req.body.email;
    try {
      await client.user.delete({
        where: {
          email: email,
        },
      });
      res.json({
        message: "User deleted successfully!!",
        deleted: true,
      });
    } catch (e) {
      res.json({
        message: "Error in deleting user!!",
        error: e,
      });
    }
  }
);
