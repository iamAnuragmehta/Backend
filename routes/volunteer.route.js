import { Router } from "express";
import {
  updatevolunteer,
  signinvolunteer,
  signUpvolunteer,
  logoutvolunteer,
} from "../Controller/volunteer.controller.js";

const volunteerRouter = Router();

volunteerRouter.post("/sign-up", signUpvolunteer);
volunteerRouter.get("/sign-in", signinvolunteer);
volunteerRouter.put("/update/:id", updatevolunteer);
volunteerRouter.post("/:id", logoutvolunteer);

export default volunteerRouter;
