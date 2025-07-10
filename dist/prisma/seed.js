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
const client_1 = require("../src/generated/prisma/client");
const client = new client_1.PrismaClient();
const users = [
    {
        name: "John",
        email: "john@gmail.com",
        nfts: {
            create: [
                {
                    name: "tomato",
                    image: "https://tomatoimage.com/get",
                    pubKey: "asdASDF3asdfas343f",
                },
                {
                    name: "tomato2",
                    image: "https://tomatoimage.com/get",
                    pubKey: "asdASDASF3asdfas343f",
                },
            ],
        },
    },
    {
        name: "John2",
        email: "john2@gmail.com",
        nfts: {
            create: [
                {
                    name: "tomato2",
                    image: "https://tomatoimage.com/get",
                    pubKey: "asdASDdfF3asdfas343f",
                },
                {
                    name: "tomato3",
                    image: "https://tomatoimage.com/get",
                    pubKey: "asdASDASasdfF3asdfas343f",
                },
            ],
        },
    },
];
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const user of users) {
        yield client.user.create({ data: user });
    }
});
seedDatabase();
