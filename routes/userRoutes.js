import express from "express";
import {
	renderIndexPage,
	renderSignupForm,
	handleSignup,
	renderLoginForm,
	handleLogin,
	renderProfilePage,
	handleLogout,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", renderIndexPage);
router.get("/signup", renderSignupForm);
router.post("/signup", handleSignup);
router.get("/login", renderLoginForm);
router.post("/login", handleLogin);
router.get("/profile", renderProfilePage);
router.get("/logout", handleLogout);
export default router;
