import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import paymentRoute from './payment.route';
import transactionRoute from './transaction.route';
import rateRoute from './rate.route';
import projectRoute from './project.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/payments', paymentRoute);
router.use('/transactions', transactionRoute);
router.use('/rates', rateRoute);
router.use('/projects', projectRoute);

module.exports = router;