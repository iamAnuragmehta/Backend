import { Router } from "express";
import {
  updateHoteluser,
  signUpHotel,
  signinHotel,
  logouthotel,
} from "../Controller/hotels.controller.js";

const hotelRouter = Router();

// hotelRouter.post("/sign-up", (req, res) =>
//   res.send({ title: "Sign UP for hotel registration" })
// );

// hotelRouter.post("/sign-in", (req, res) =>
//   res.send({ title: "Sign in  for the hotel sign in  " })
// );
// hotelRouter.post("/sign-out", (req, res) =>
//   res.send({ title: "Sign out  for the gotels  " })
// );

hotelRouter.post("/sign-up", signUpHotel);
hotelRouter.get("/sign-in", signinHotel);
hotelRouter.put("/update/:id", updateHoteluser);
hotelRouter.post("/:id", logouthotel);

export default hotelRouter;
