// routes/sheetRoutes.js
import express from 'express';
import { search } from '../controllers/sheetController.js';
import { verifyToken } from '../middlewares/auth.js'; // Ensure this exists and works
import cors from 'cors';

const router = express.Router();

// Apply CORS middleware properly.
router.use(cors());

// Optionally, protect the route using verifyToken.
// The order of middleware is important: verifyToken will run before the controller.
router.post("/search", verifyToken, search);

export default router;
