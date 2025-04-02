import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 15,
    message: "Too many requests, please try again later",
});