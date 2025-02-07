// routes/sheetRoutes.js
import express from 'express';
import { searchSheets } from '../controllers/sheetController.js';
import { verifyToken } from '../middlewares/auth.js'; // Ensure this exists and works
import cors from 'cors';

const router = express.Router();

// Apply CORS middleware properly.
router.use(cors())



// Route to handle POST requests for searching the spreadsheet
router.post('/sheets', searchSheets);

// Reject GET requests on this route
router.get('/search/sheets', (req, res) => {
    res.status(405).json({ message: "Use POST method instead." });
  });

export default router;