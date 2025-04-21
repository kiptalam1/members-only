import bcrypt from "bcryptjs";
import pool from "../models/pool.js";
import passport from "passport";

// GET /messages
export async function getMessages(req, res) {
	try {
		const messages = await pool.query(
			`SELECT messages.id, messages.user_id, messages.title, messages.content, messages.created_at, users.first_name
			FROM messages
			JOIN users ON messages.user_id = users.id
			ORDER BY messages.created_at ASC`
		);
		const currentUserId = req.user.id;
		const formattedMessages = messages.rows.map((msg) => ({
			...msg,
			user: msg.first_name,
			isOwn: msg.user_id === currentUserId,
		}));
		res.render("messages", {
			messages: formattedMessages,
			currentUser: req.user,
		});
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).send("Error loading messages");
	}
}

// POST /messages
export async function postMessage(req, res) {
	try {
		const { title, content } = req.body;
		const userId = req.user.id;

		//ensure content is there
		if (!content) {
			return res.status(400).send("Content is required");
		}

		// if there is no title
		const messageTitle = title || null;
		await pool.query(
			`INSERT INTO messages (title, content, created_at, user_id)
			VALUES ($1, $2, NOW(), $3)`,
			[messageTitle, content, userId]
		);
		res.redirect("/messages");
	} catch (err) {
		console.error("Error sending message:", err);
		res.status(500).send("Failed to send message");
	}
}
