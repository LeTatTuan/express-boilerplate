'use strict';
import express from 'express';
import asyncHandler from '@/middleware/asyncHandler';
import { authenticateUser } from '@/middleware/authentication';
import userController from '@/controller/user.controller';

const router = express.Router();

router.get('/me', authenticateUser, asyncHandler(userController.getInfo));

export default router;
