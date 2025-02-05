import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    walletBalance: {
      type: Number,
      required: true,
      default: 0.00,
    },
    topUpHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TopUpHistory',
      }
    ],
    transactionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransactionHistory',
      }
    ],
    searchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SearchHistory',
      }
    ],
    loginHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoginHistory',
      }
    ]
  },
  { timestamps: true }
);

// 🔑 Method to compare hashed passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔄 Pre-save Hook: Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Create User model
const User = mongoose.model('User', userSchema);
export default User;
