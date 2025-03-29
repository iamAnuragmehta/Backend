import { jwt_secret } from "../config/env.js";
import jwt from "jsonwebtoken";
import hotels from "../models/hotels.model.js";
import multer from "multer";

const Hauthorize = async (req, res, next) => {
  try {
    console.log(req.headers);
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Extract token without "Bearer "
    token = token.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, jwt_secret);

    // Fetch user from DB
    const user = await hotels.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }


    const certificationLocalPath  = req.files?.

    // Attach user to request object
    req.user = user;
    next();


  } catch (error) {
    console.error("Authorization Error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export default Hauthorize;
