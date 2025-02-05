import express from 'express';
import * as auth from '../middlewares/auth.js';
import * as accountsController from '../controllers/accountsController.js';
import upload from '../middlewares/multer.js';


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send("Welcome Page");
});

//router.post('/login', accountsController.login);

// router.use(auth.verifyToken)

// Accounts Routes
router.get('/accounts', accountsController.listAccounts);
router.post('/accounts', accountsController.createAccount);
router.get('/accounts/:id', accountsController.showAccount);
router.patch('/accounts/:id', accountsController.updateAccount);
router.delete('/accounts/:id', accountsController.deleteAccount);

router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).send(req.file);
});

export default router;
