import express from "express";
import {
  login,
  register,
  forgotPassword,
  getUserProfileWithProperties,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.get("/me", verifyToken, getUserProfileWithProperties);


export default router;
