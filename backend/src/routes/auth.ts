import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from '../../utils/sendEmail';

const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password required " });
  }

  try {
    //Checking if user exists
    const existingUser = await prisma.user.findUnique({ where: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    //Hashing password

    const passwordHash = await bcrypt.hash(password, 10);

    //Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);

    //Save user
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        isVerified: false,
        verificationToken,
        tokenExpiry,
      },
    });

    //Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      "Verify your email",
      `
      <h3>Welcome!</h3>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `
    );

    return res
      .status(201)
      .json({ message: "Signup successful. Please check your email" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
});
