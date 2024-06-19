'use strict';
import express from 'express';
import asyncHandler from '@/middleware/asyncHandler';
import paymentController from '@/controller/payment.controller';

const router = express.Router();

router.get('/trials/active', asyncHandler(paymentController.getActiveTrials));
router.get('/subscriptions/active', asyncHandler(paymentController.getActiveSubs));
router.get('/customers/new', asyncHandler(paymentController.getNewCustomers));
router.get('/users/active', asyncHandler(paymentController.getActiveUsers));
router.get('/revenues', asyncHandler(paymentController.getRevenues));

export default router;
