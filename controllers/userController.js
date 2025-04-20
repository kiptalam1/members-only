import bcrypt from "bcryptjs";
import pool from "../models/pool.js";
export function renderIndexPage(req, res) {
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

export function renderLoginForm (req, res) {
    res.render("login", { error: req.session.message?.[0]})
    //clear old errors
    req.session.messages = [];
}

// export const handleLogin