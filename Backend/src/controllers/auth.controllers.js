import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../libs/db.js";
import { UserRole } from "../../generated/prisma/index.js";

export const registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER,
            },
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image,
            },
        });
    } catch (error) {
        console.log("Error creating user: ", error);
        res.status(500).json({
            success: false,
            error: "Error creating user",
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image,
            },
        });
    } catch (error) {
        console.log("Error logging in user: ", error);
        res.status(400).json({
            success: false,
            message: "Error logging in user",
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        res.status(204).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.log("Error logging out user: ", error);
        res.status(500).json({
            success: false,
            message: "Error logging out user",
        });
    }
};

export const profile = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user,
        });
    } catch (error) {
        console.log("Error checking user: ", error);
        res.status(500).json({
            success: false,
            message: "Error checking user",
        });
    }
};
