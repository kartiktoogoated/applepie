import { Redis } from "ioredis";

const redis = new Redis();

export const getCache = async (key: string) => {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
};

export const setCache = async (key: string, value: any, ttl = 60) => {
    await redis.set(key, JSON.stringify(value),"EX", ttl);
};