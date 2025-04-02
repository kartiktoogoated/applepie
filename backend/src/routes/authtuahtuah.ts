import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

// Secret keys 

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

// In-memory refresh token storage
let refreshTokens: string[] = [];

//Generate tokens
export const generateTokens = (user:any) => {
    const accessToken = jwt.sign({ id: user.id, name: user.name}, ACCESS_TOKEN_SECRET, { expiresIn: '15m'});
    const refreshToken = jwt.sign({ id:user.id, name: user.name}, REFRESH_TOKEN_SECRET, {expiresIn:'7d'});
    refreshTokens.push(refreshToken);
    return { accessToken, refreshToken };
};

// Login endpoint
export const login = (req: Request, res: Response) => {
    //Validating user
    const user = { id: 1, name: 'Alice' };
    const tokens = generateTokens(user);
    res.json(tokens);
};

// Refresh token endpoint
export const refresh = (req: Request, res:Response) => {
    const { token } = req.body;
    if(!token || !refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }
    try {
        const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
        //Optionally remove old token and issue new one
        const tokens = generateTokens({ id: payload.id, name: payload.name});
        res.json(tokens);
    } catch (error:any) {
        return res.sendStatus(403);
    }
};

// Logout endpoint to invalidate refresh token
export const logout = (req: Request, res: Response) => {
    const {token} = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.sendStatus(204);
};


// import { Router } from 'express';
// import { login, refresh, logout } from '../auth/authController';

// const router = Router();

// router.post('/login', login);
// router.post('/refresh', refresh);
// router.post('/logout', logout);

// export default router;
