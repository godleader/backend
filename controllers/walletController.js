// server/controllers/walletController.js
import { PrismaClient } from '@prisma/client';
import User from '../models/userModel.js';
import TransactionHistory from '../models/TransactionHistory.js';

const prisma = new PrismaClient();

/**
 * Get the wallet for a given user.
 */
//export const getWallet = async (req, res) => {

/**
 * Get the wallet balance for a given user.
 */


export const getWallet = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const walletBalance = await prisma.users.findUnique({
      where: { id: userId },
      select: { wallet: true },
    });

    if (!walletBalance) {
      return res.status(404).json({ message: 'Wallet balance not found' });
    }

    res.status(200).json(walletBalance.wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving wallet balance' });
  }
};



// 🔹 Get Wallet Balance
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Top-up Wallet
export const topUpWallet = async (req, res) => {
  try {
    const { amount, method } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid top-up amount' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance += amount;
    user.topUpHistory.push({ amount, method, status: 'Completed' });
    await user.save();

    res.json({ message: 'Wallet topped up successfully', walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 List Transactions
export const listTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('transactionHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.transactionHistory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
/**
 * Create a wallet for the given user.
 * Expect wallet data in the request body.
 */
export const createWallet = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    // Adjust the wallet fields as needed
    const newWallet = await prisma.wallet.create({
      data: { userId, ...req.body },
    });
    res.status(201).json(newWallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating wallet' });
  }
};

/**
 * Update the wallet for the given user.
 */
export const updateWallet = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: req.body,
    });
    res.status(200).json(updatedWallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating wallet' });
  }
};

/**
 * Delete the wallet for the given user.
 */
export const deleteWallet = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const deletedWallet = await prisma.wallet.delete({
      where: { userId },
    });
    res.status(200).json(deletedWallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting wallet' });
  }
};

/**
 * Process a purchase or transfer transaction
 */
export const createTransaction = async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    const userId = req.user.id; // Extract user ID from token

    // Validate the request
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transaction amount' });
    }
    if (!["Purchase", "Transfer"].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has enough balance
    if (type === "Purchase" && user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Create transaction record
    const transaction = await TransactionHistory.create({
      userId: userId,
      type,
      amount,
      status: "Success",
      description,
    });

    // Deduct from wallet if it's a purchase
    if (type === "Purchase") {
      user.walletBalance -= amount;
    }

    // Save transaction reference in user's transaction history
    user.transactionHistory.push(transaction._id);
    await user.save();

    res.status(201).json({
      message: "Transaction successful",
      walletBalance: user.walletBalance,
      transaction,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
