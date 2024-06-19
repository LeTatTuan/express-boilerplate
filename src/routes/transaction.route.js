'use strict';
import express from 'express';
import asyncHandler from '@/middleware/asyncHandler';
import paymentController from '@/controller/payment.controller';

const router = express.Router();

router.get('/', asyncHandler(paymentController.getRecentTransactions));

export default router;
