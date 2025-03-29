import { jwt_secret } from "../config/env.js";

import jwt from "jsonwebtoken";

import NGO from "../models/ngo.model.js";
import hotels from "../models/hotels.model.js";

const Nauthorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, jwt_secret);
    const user = await NGO.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export default Nauthorize;
