import mongoose from 'mongoose';

const transactionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ["Purchase", "Transfer"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Success", "Failed"],
    default: "Success",
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);
export default TransactionHistory;
