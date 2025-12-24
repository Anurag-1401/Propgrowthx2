import express from "express";
import {
  getProperties,
  createProperty,
} from "../controller/property.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";// this  one i  add after all the features done for protect ok

const router = express.Router();

// router.get("/", protect, getProperties);
// router.post("/create", protect, createProperty);
router.get("/get", getProperties);
router.post("/create", createProperty);
router.post("/update", createProperty);

export default router;
