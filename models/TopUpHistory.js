import mongoose from 'mongoose';

const topUpHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String, // e.g., "Credit Card", "PayPal"
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TopUpHistory = mongoose.model('TopUpHistory', topUpHistorySchema);
export default TopUpHistory;
