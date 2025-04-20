// config/passportConfig.js

import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import pool from "../models/pool.js"; // make sure the .js extension is correct

function initialize(passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			async (email, password, done) => {
				try {
					const result = await pool.query(
						"SELECT * FROM users WHERE email = $1",
						[email]
					);
					const user = result.rows[0];

					if (!user) {
						return done(null, false, { message: "No user with that email" });
					}

					const match = await bcrypt.compare(password, user.password);
					if (!match) {
						return done(null, false, { message: "Incorrect password" });
					}

					return done(null, user);
				} catch (err) {
					return done(err);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const result = await pool.query("SELECT * FROM users WHERE id = $1", [
				id,
			]);
			done(null, result.rows[0]);
		} catch (err) {
			done(err, null);
		}
	});
}

export default initialize;
