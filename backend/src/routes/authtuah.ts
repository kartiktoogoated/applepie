import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const authtuahRouter = Router();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'SECRET';

//Register
authtuahRouter.post('/register', async (req:Request, res:Response): Promise<void> => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const user = await prisma.user.create ({
            data: {
                email,
                passwordHash: hashedPassword,
            }
        });
        res.status(200).json({ message: 'User Registered Successfully ', user});
    } catch (error: any) {
        res.status(400).json({ error: 'User already exists' });
    }
});

//Login
authtuahRouter.post('/login', async (req:Request, res:Response): Promise<void> => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique( {
        where: {email}
    });

    if(!user || !(await bcrypt.compare(password, user.passwordHash))){
        return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id:user.id, email:user.email }, SECRET, { expiresIn: '1h'});
    res.json({ token })
})

export default authtuahRouter;