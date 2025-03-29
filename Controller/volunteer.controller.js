import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../config/env.js";
import Volunteer from "../models/volunteer.model.js";

// volunteer Signup Controller
export const signUpvolunteer = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, phone, password, deliverd } =
            req.body;
        // Check if a user already exists
        const existingUser = await Volunteer.findOne({ email });

        console.log(Volunteer.findOne({ email }));
        if (existingUser) {
            const error = new Error("volunteer already exists");
            error.statusCode = 409;
            throw error;
        }

        // Hash password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new Volunteer user
        const newUser = await Volunteer.create(
            [
                {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    deliverd,
                },
            ],
            { session }
        );

        const token = jwt.sign({ userId: newUser[0]._id }, jwt_secret, {
            expiresIn: "1d",
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "volunteer registered successfully",
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

// volunteer Signin Controller
export const signinvolunteer = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const volunteer = await Volunteer.findOne({ email });

        if (!volunteer) {
            const error = new Error("volunteer not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, volunteer.password);

        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: volunteer._id }, jwt_secret, {
            expiresIn: "1d",
        });

        res.status(200).json({
            success: true,
            message: "volunteer signed in successfully",
            data: {
                token,
                volunteer,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update volunteer Profile
export const updatevolunteer = async (req, res) => {
    const { id } = req.params;
    const volunteerData = req.body;

    if (!id) {
        return res
            .status(400)
            .json({ success: false, message: "volunteer ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid volunteer ID" });
    }

    if (!Object.keys(volunteerData).length) {
        return res
            .status(400)
            .json({ success: false, message: "No data provided for update" });
    }

    try {
        const updatedvolunteer = await Volunteer.findByIdAndUpdate(id, volunteerData, {
            new: true,
            runValidators: true,
        });

        if (!updatedvolunteer) {
            return res.status(404).json({ success: false, message: "volunteer not found" });
        }

        res.status(200).json({ success: true, volunteer: updatedvolunteer });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating volunteer",
            error: error.message,
        });
    }
};

// volunteer Logout
export const logoutvolunteer = async (req, res) => {
    try {
        res
            .status(200)
            .json({ success: true, message: "volunteer logged out successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
