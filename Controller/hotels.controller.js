import Hotels from "../models/hotels.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../config/env.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const signUpHotel = async (req, res, next) => {
  // implement signup logic here

  // what is req body ---> req.body is an object containing data from the client ( POST Request)'

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { hotelname, email, password, ownername, phone, address, fssai, image, contributions } =
      req.body;

    if (!req.files || !req.files.certificate) {
      return res.status(400).json({ error: "Certificate is required" });
    }

    const localFilePath = req.files.certificate[0].path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    if (!cloudinaryResponse) {
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }

    // check if a user already exists
    const existingUser = await Hotels.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }
    // Hash password --=> Securing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Hotels.create(
      [
        {
          hotelname,
          ownername,
          email,
          phone,
          address,
          fssai,
          image,
          password: hashedPassword,
          contributions,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: newUser[0]._id }, jwt_secret, {
      expiresIn: "1d",
    });
    ///
    await session.commitTransaction();

    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created Successfully",
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

export const signinHotel = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hotel = await Hotels.findOne({ email });
    if (!hotel) {
      const error = new Error("Hotel not Found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, hotel.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }
    console.log(hotel);
    const token = jwt.sign({ hotelname: hotel._id }, jwt_secret, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "success",
      message: "User signed in SuccessFully",
      data: {
        token,
        hotel,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateHoteluser = async (req, res) => {
  const { id } = req.params;
  const hotelData = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Hotel ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid hotel ID" });
  }

  if (!Object.keys(hotelData).length) {
    return res
      .status(400)
      .json({ status: "error", message: "No data provided for update" });
  }

  try {
    const updatedHotel = await Hotels.findByIdAndUpdate(id, hotelData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHotel) {
      return res
        .status(404)
        .json({ status: "error", message: "Hotel not found" });
    }

    res.status(200).json({ status: "success", hotel: updatedHotel });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error updating hotel",
      error: error.message,
    });
  }
};

export const logouthotel = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
