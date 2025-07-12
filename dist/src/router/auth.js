"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const client_1 = require("../../src/generated/prisma/client");
const totp_1 = require("../utils/totp");
const mail_1 = require("../utils/mail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fallbackSecret = "asdfa343f3FA#F#";
const client = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
// middlewares
const checkUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body.email;
    // check if user exists
    const user = yield client.user.findFirst({
        where: {
            email: email,
        },
    });
    if (user) {
        res.json({
            message: "User already exists!!",
            user: true,
        });
    }
    else {
        next();
    }
});
const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    if (password && password === process.env.ADMIN_PASSWORD)
        next();
    else {
        res.json({
            message: "Invaild password for admin",
            admin: false,
        });
    }
});
const checkUserNotExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body.email;
    // check if user exists
    const user = yield client.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        res.json({
            message: "User doesn't exists!!",
            user: false,
        });
    }
    else {
        next();
    }
});
//functions
//create auth token
const createAuthToken = (email, totp) => {
    var _a;
    const secret = (_a = process.env.AUTH_TOKEN_SECRET) !== null && _a !== void 0 ? _a : fallbackSecret;
    const token = jsonwebtoken_1.default.sign({
        email,
        totp,
    }, secret);
    return token;
};
//verify auth token
const verifyAuthToken = (token) => {
    var _a;
    const secret = (_a = process.env.AUTH_TOKEN_SECRET) !== null && _a !== void 0 ? _a : fallbackSecret;
    const verify = jsonwebtoken_1.default.verify(token, secret);
    return verify;
};
// routes
exports.router.get("/", (req, res) => {
    res.json({
        message: "server",
    });
});
exports.router.post("/signin", checkUserNotExist, (req, res) => {
    const body = req.body;
    const email = body.email;
    const topt = (0, totp_1.generateTotp)(email);
    try {
        // send otp to user email
        (0, mail_1.sendMail)(email, "Your OTP", `Your OTP is ${topt}`);
        res.json({
            message: "Otp sent successfully",
            user: false,
        });
    }
    catch (e) {
        res.json({
            message: e,
        });
    }
});
exports.router.post("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //get all info from user
    const totp = body.totp;
    const email = body.email;
    // verify totp
    const verify = (0, totp_1.verifyTotp)(totp, email);
    if (verify) {
        // create auth token
        const authToken = createAuthToken(email, totp);
        // chaged "verified" to true in the database
        yield client.user.update({
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
    }
    else {
        res.json({
            message: "Opt is invalid!!!",
            signup: false,
        });
    }
}));
exports.router.post("/signup/", checkUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body.email;
    const name = body.name;
    // generating TOTP
    const topt = (0, totp_1.generateTotp)(email);
    try {
        // send otp to user email
        (0, mail_1.sendMail)(email, "Your OTP", `Your OTP is ${topt}`);
        // create an entry for the user to database
        yield client.user.create({
            data: {
                email: email,
                name: name,
            },
        });
        res.json({
            message: "Otp sent successfully",
            user: false,
        });
    }
    catch (e) {
        res.json({
            message: e,
        });
    }
}));
exports.router.delete("/delete/", checkAdmin, checkUserNotExist, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        yield client.user.delete({
            where: {
                email: email,
            },
        });
        res.json({
            message: "User deleted successfully!!",
            deleted: true,
        });
    }
    catch (e) {
        res.json({
            message: "Error in deleting user!!",
            error: e,
        });
    }
}));
