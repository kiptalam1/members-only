// setupDb.js
import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Client } = pkg;

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false, // allow self-signed certs (most PaaS setups)
	},
});

async function setupDb() {
	try {
		await client.connect();

		await client.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				first_name VARCHAR(100),
				last_name VARCHAR(100),
				email VARCHAR(255) UNIQUE NOT NULL,
				password VARCHAR(255) NOT NULL,
				is_member BOOLEAN DEFAULT false,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
		`);

		await client.query(`
			CREATE TABLE IF NOT EXISTS messages (
				id SERIAL PRIMARY KEY,
				title VARCHAR(255),
				content TEXT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
			);
		`);

		console.log("✅ Tables created (if they didn't exist already)");
	} catch (err) {
		console.error("❌ Error setting up the database:", err);
	} finally {
		await client.end();
	}
}

setupDb();
