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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const client_1 = require("../../src/generated/prisma/client");
const client = new client_1.PrismaClient();
exports.router = (0, express_1.Router)();
exports.router.get("/", (req, res) => {
    res.json({
        message: "server",
    });
});
exports.router.post("/signin", (req, res) => {
    const body = req.body;
    try {
        const email = body.email;
    }
    catch (e) {
        res.json({
            message: "Otp failed to send.",
        });
    }
});
exports.router.post("/verify", (req, res) => {
    const body = req.body;
});
exports.router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const name = body.name;
    const email = req.body.email;
    console.log(email);
    //   try{
    const user = yield client.user.findFirst({
        where: {
            email: email
        }
    });
    console.log(user);
    //   }catch(e){
    //       res.json({
    //           message: "Erorr finding user!!!"
    //       })
    //   }
    res.json({
        message: "signup endpoint",
    });
}));
