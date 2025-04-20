import express from "express";
import {
	renderIndexPage,
	renderSignupForm,
	handleSignup,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/", renderIndexPage);
router.get("/signup", renderSignupForm);
router.post("/signup", handleSignup);

export default router;
