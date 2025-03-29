import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../config/env.js";
import NGO from "../models/ngo.model.js";

// NGO Signup Controller
export const signUpNGO = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phone, address, ngoregistrationnumber, password, claimed } =
      req.body;
    // Check if a user already exists
    const existingUser = await NGO.findOne({ email });

    console.log(NGO.findOne({ email }));
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new NGO user
    const newUser = await NGO.create(
      [
        {
          name,
          email,
          phone,
          address,
          ngoregistrationnumber,
          password: hashedPassword,
          claimed,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: name._id }, jwt_secret, {
      expiresIn: "1d",
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "NGO registered successfully",
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

// NGO Signin Controller
export const signinNGO = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ngo = await NGO.findOne({ email });

    if (!ngo) {
      const error = new Error("NGO not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, ngo.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: ngo._id }, jwt_secret, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "NGO signed in successfully",
      data: {
        token,
        ngo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update NGO Profile
export const updateNGO = async (req, res) => {
  const { id } = req.params;
  const ngoData = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "NGO ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid NGO ID" });
  }

  if (!Object.keys(ngoData).length) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided for update" });
  }

  try {
    const updatedNGO = await NGO.findByIdAndUpdate(id, ngoData, {
      new: true,
      runValidators: true,
    });

    if (!updatedNGO) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    res.status(200).json({ success: true, ngo: updatedNGO });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating NGO",
      error: error.message,
    });
  }
};

// NGO Logout
export const logoutNGO = async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "NGO logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
