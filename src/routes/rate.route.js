'use strict';
import express from 'express';
import asyncHandler from '@/middleware/asyncHandler';
import rateController from '@/controller/rate.controller';

const router = express.Router();

router.get('/fetch', asyncHandler(rateController.fetchRates));

export default router;
