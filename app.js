import express from "express";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
import initializePassport from "./configs/passportConfig.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messagesRoutes.js";
const PORT = 3000;

const app = express();

// set up view engine and ejs
app.set("view engine", "ejs");
// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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

app.use(flash());
app.use((req, res, next) => {
	// Make flash messages available to all views
	res.locals.messages = {
		error: req.flash("error"),
		success: req.flash("success"),
	};
	next();
});
// initialize passport middleware.
initializePassport(passport);

// use passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", userRoutes);
app.use("/messages", messageRoutes);


app.listen(PORT, () => {
	console.log(`listening at ${PORT}`);
});
