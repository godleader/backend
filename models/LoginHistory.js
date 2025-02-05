import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loggedIn: {
    type: Date,
    default: Date.now,
  },
  loggedOut: {
    type: Date,
  },
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
export default LoginHistory;
