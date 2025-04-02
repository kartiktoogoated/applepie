import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getCache, setCache } from "../../utils/redis";
import { apiLimiter } from "../middleware/rateLimit";
import bcrypt from 'bcrypt'
import { sendWebhook } from "../../utils/webhook";

const basicRouter = Router();
const prisma = new PrismaClient();

// Creating user
basicRouter.post(
  "/users",
  apiLimiter,
  async (req: Request, res: Response): Promise<void> => {
    const { email, passwordHash } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
        },
      });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: "User already exists" });
    }
  }
);

//Get all users

basicRouter.get("/", apiLimiter, async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = "10", search } = req.query;

  //Construct Cache Key
  const cacheKey = `users:page=${page}&limit=${limit}&search=${search || 'none'}`;
  const cachedUsers = await getCache(cacheKey);
  if (cachedUsers)
    res.json(cachedUsers);

  //Search filter
  const where = search 
    ? { email: { contains: search as string, mode: 'insensitive' as 'insensitive' } }
    : {};

    //Pagination
    const users = await prisma.user.findMany({
      where,
      take: Number(limit),
      skip: (Number(page)-1)* Number(limit),
    });

    //Store in cache for 5 minutes
    await setCache(cacheKey, users, 300);

    res.status(200).json(users);
});

//Get single user

basicRouter.get("/:id", apiLimiter, async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!user) res.status(404).json({ error: "User not found" });
  res.status(201).json(user);
});

//Update User

basicRouter.put("/:id", apiLimiter,  async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = prisma.user.update({
      where: { id: req.params.id },
      data: { email },
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: "Update Failed!" });
  }
});

// Delete User

basicRouter.delete(
  "/:id",
  apiLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await prisma.user.delete({
        where: { id: req.params.id },
      });
      res.status(200).json({ message: "User deleted" });
    } catch (error: any) {
      res.status(400).json({ error: "Deletion failed" });
    }
  }
);


//bulk user creation
basicRouter.post('/bulk-create', apiLimiter, async(req:Request, res:Response): Promise<void> => {
  const {users} = req.body;

  try{
    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    res.status(201).json({ message: 'Users created successfully' , count: createdUsers.count});
  } catch (error:any) {
    res.status(400).json({ error: 'Bulk insert failed' });
  }
});

basicRouter.get('/register' , apiLimiter,  async (req:Request, res:Response) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      }
    });

    await sendWebhook("https://your-webhook-url.com", { event: "user_created", user })

    res.json ({ message: "User registered", user});
  } catch (error:any) {
    res.status(400).json({ error: "User already exists" });
  }
});

//Pagination

// basicRouter.get("/", async (req: Request, res: Response): Promise<void> => {
//   const { page = '1', limit = '10', search } = req.query;

//   const where = search
//     ? { email: { contains: search as string, mode: "insensitive" as "insensitive" } }
//     : {};

//   const users = await prisma.user.findMany({
//     where,
//     take: Number(limit),
//     skip: (Number(page) - 1) * Number(limit),
//   });

//   res.status(200).json(users);
// });

//Redis

// basicRouter.get('/', async (req:Request, res:Response): Promise<void> => {
//   const cachedUsers = await getCache("users");
//   if (cachedUsers) return res.json(cachedUsers);

//   const users = await prisma.user.findMany();
//   await setCache("users", users, 300);

//   res.json(users);
// });

export default basicRouter;
