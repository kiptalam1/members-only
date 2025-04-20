import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const PORT = 3000;

const app = express();

// set up view engine and ejs
app.set("view engine", "ejs");
app.set(express.urlencoded({ extended: false }));

//set up files paths
app.use(express.static(path.join(process.cwd(), "public")));
// set views directory.
app.set("views", path.join(process.cwd(), "views"));
//set app session middleware.
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.session());

// routes
app.get("/", (req, res, next) => {
	res.render("index");
});

app.get("/signup", (req, res) => {
	res.render("signup");
});
app.post("/", (req, res, next) => {
    
})
app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
