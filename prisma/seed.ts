import {PrismaClient, Prisma} from '../src/generated/prisma/client'
const client = new PrismaClient();

const users:Prisma.UserCreateInput[] = [
  {
    name: "John",
    email: "john@gmail.com",
    verified: true,
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
    verified: true,
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

const seedDatabase = async () => {
  for (const user of users) {
    await client.user.create({ data: user });
  }
};

seedDatabase();
