// server/routes/walletRoutes.js
import express from 'express';

import { protect } from '../middlewares/authMiddleware.js';

import {
  getWalletBalance,
  topUpWallet,
  listTransactions,
  createTransaction,
  createWallet,
  updateWallet,
  deleteWallet,
} from '../controllers/walletController.js';

const router = express.Router({ mergeParams: true });

router.post('/transaction', protect, createTransaction);


// 🔹 Get Wallet Balance
router.get('/balance', protect, getWalletBalance);

// 🔹 Top-up Wallet
router.post('/topup', protect, topUpWallet);

// 🔹 View Transactions
router.get('/transactions', protect, listTransactions);

export default router;

