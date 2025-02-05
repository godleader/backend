import express from 'express';

import * as auth from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';

import upload from '../middlewares/multer.js';
import cors from 'cors';

const router = express.Router();
router.use(cors);




router.get('/', (req, res) => {
  res.status(200).send("Welcome Page");
});
router.use(auth.verifyToken);

router.post('/users/login', userController.login);



// Accounts Routess

router.get('/accounts', userController.listAccounts);
router.post('/accounts', userController.createAccount);
router.get('/accounts/:id', userController.showAccount);
router.patch('/accounts/:id', userController.updateAccount);
router.delete('/accounts/:id', userController.deleteAccount);
router.get('/users/:id/walletBalance', auth.verifyToken, userController.getWalletBalance);
router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).send(req.file);
});



export default router;
