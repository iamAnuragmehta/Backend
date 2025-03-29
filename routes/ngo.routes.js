import { Router } from "express";
import {
  updateNGO,
  signinNGO,
  signUpNGO,
  logoutNGO,
} from "../Controller/ngo.controller.js";

const ngoRouter = Router();

ngoRouter.post("/sign-up", signUpNGO);
ngoRouter.get("/sign-in", signinNGO);
ngoRouter.put("/update/:id", updateNGO);
ngoRouter.post("/:id", logoutNGO);

export default ngoRouter;
