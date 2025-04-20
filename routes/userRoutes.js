import express from "express";
import {
	renderIndexPage,
	renderSignupForm,
	handleSignup,
	renderLoginForm,
	handleLogin,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/", renderIndexPage);
router.get("/signup", renderSignupForm);
router.post("/signup", handleSignup);
router.get("/login", renderLoginForm);
router.post("/login", handleLogin);
export default router;
