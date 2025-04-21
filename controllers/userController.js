import bcrypt from "bcryptjs";
import pool from "../models/pool.js";
import passport from "passport";

export function renderIndexPage(req, res) {
	if (req.isAuthenticated()) {
		return res.redirect("/messages");
	}
	res.render("index");
}

export function renderSignupForm(req, res) {
	res.render("signup");
}
export async function handleSignup(req, res, next) {
	const { first_name, last_name, email, password, password2 } = req.body;

	try {
		// validate passwords.
		if (password !== password2) {
			return res.status(400).send("Passwords do not match.");
		}

		// check if email is already in use.
		const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		if (userExist.rows.length > 0) {
			return res.status(400).send("Email is already registered.");
		}

		// hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		//insert new user into DB
		await pool.query(
			"INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
			[first_name, last_name, email, hashedPassword]
		);

		//Redirect user to login page
		res.redirect("/login");
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).send("Something went wrong. Please try again.");
	}
}

export function renderLoginForm(req, res) {
	res.render("login", { error: req.session.message?.[0] });
	//clear old errors
	req.session.messages = [];
}

export const handleLogin = passport.authenticate("local", {
	successRedirect: "/messages",
	failureRedirect: "/login",
	failureMessage: true,
});

export async function renderProfilePage(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect("/login");
	}

	try {
		//fetch user data from database
		const result = await pool.query("SELECT * FROM users WHERE id = $1", [
			req.user.id,
		]);
		const user = result.rows[0];
		// render the profile page with user data
		res.render("profile", { user });
	} catch (error) {
		console.error(error);
		res.status(500).send("Error fetching user profile");
	}
}

// show profile edit form
export async function showEditForm(req, res) {
	try {
		const userId = req.user.id;
		const user = await pool.query("SELECT * FROM users WHERE id = $1", [
			userId,
		]);
		res.render("edit-profile", { user: user.rows[0] });
	} catch (error) {
		console.error("Error fetching user data for edit profile:", err);
		res.status(500).send("Error loading user data for profile edit");
	}
}

// handle profile update form submission
export async function updateProfile(req, res) {
	const { first_name, last_name, email } = req.body;
	const userId = req.user.id;

	try {
		await pool.query(
			`UPDATE users
			SET first_name = $1, last_name = $2, email = $3
			WHERE id = $4`,
			[first_name, last_name, email, userId]
		);
		res.redirect("/profile");
	} catch (error) {
		console.error("Error updating user data:", error);
		res.status(500).send("Error updating profile");
	}
}
// log the user out
export function handleLogout(req, res) {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/login");
	});
}
