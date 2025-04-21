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
	res.render("signup", { error: null });
}
// Handle signup logic
export async function handleSignup(req, res) {
	const { first_name, last_name, email, password, password2 } = req.body;

	try {
		// Validate password match
		if (password !== password2) {
			return res.status(400).render("signup", {
				error: "Passwords do not match.",
			});
		}

		// Check if email already exists
		const existingUser = await pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email]
		);
		if (existingUser.rows.length > 0) {
			return res.status(400).render("signup", {
				error: "Email is already registered.",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert new user into DB
		await pool.query(
			"INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
			[first_name, last_name, email, hashedPassword]
		);

		res.redirect("/login");
	} catch (err) {
		console.error("Signup error:", err);
		res.status(500).render("signup", {
			error: "Something went wrong. Please try again later.",
		});
	}
}
export function renderLoginForm(req, res) {
	const messages = req.flash("error"); // Get flash messages
	res.render("login", { messages });
}

export const handleLogin = (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/messages",
		failureRedirect: "/login",
		failureFlash: true, // Let passport handle the error message
	})(req, res, next);
};

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
		res.redirect("/profile/edit");
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
