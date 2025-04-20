import express from "express";
import {
	renderIndexPage,
	renderSignupForm,
	getUserForm,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/", renderIndexPage);
router.get("/signup", renderSignupForm);
router.post("/signup", getUserForm);

export default router;
