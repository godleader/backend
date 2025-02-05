import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';


//import User from '../models/userModel.js';
//import LoginHistory from '../models/LoginHistory.js';
//import TransactionHistory from '../models/TransactionHistory.js';
//import TopUpHistory from '../models/TopUpHistory.js';
//import SearchHistory from '../models/SearchHistory.js';
import generateToken from '../utils/generateToken.js';
const prisma = new PrismaClient();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'asdfghjiklhmnbo1234f54%';

// 列出所有账户（带分页）
export const listAccounts = async (req, res) => {
  try {
    const startIdx = parseInt(req.query?._start) || 0;
    const endIdx = parseInt(req.query?._end) || 9999999;
    const limit = endIdx - startIdx; // 计算分页 limit

    // 分页获取数据
    const data = await prisma.account.findMany({
      skip: startIdx,
      take: limit,
    });

    // 获取总记录数
    const totalCount = await prisma.account.count();

    // 设置响应头，暴露自定义 header
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-total-count', totalCount);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// 创建新账户
export const createAccount = async (req, res) => {
  try {
    // 检查用户是否已存在
    const existingUser = await prisma.account.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = await prisma.account.create({
      data: req.body,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// 根据 ID 显示账户信息
export const showAccount = async (req, res) => {
  try {
    const user = await prisma.account.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// 更新账户信息
export const updateAccount = async (req, res) => {
  // 如果传入了密码，则需要先进行加密
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
  }
  try {
    const updatedUser = await prisma.account.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// 删除账户
export const deleteAccount = async (req, res) => {
  try {
    const deletedUser = await prisma.account.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// 登录接口，生成 JWT
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.account.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};


export const getWalletBalance = async (req, res) => {
  try {
    // Extract the user ID from the URL parameters
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Query the database to find the user's wallet balance
    const user = await prisma.account.findUnique({
      where: { id: userId },
      select: { walletBalance: true }, // Only retrieve walletBalance
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ walletBalance: user.walletBalance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
