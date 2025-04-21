import express from "express";
import { getMessages, postMessage } from "../controllers/messagesControllers.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express();
// view messages page
router.get("/", ensureAuthenticated, getMessages);
// post a new message
router.post("/", ensureAuthenticated, postMessage);

export default router;
