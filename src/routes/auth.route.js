'use strict';
import express from 'express';
import asyncHandler from '@/middleware/asyncHandler';
import authController from '@/controller/auth.controller';
import { authenticateUser } from '@/middleware/authentication';
import validate from '@/middleware/validate';
import { login, register } from '@/validation';

const router = express.Router();

router.post('/register', validate(register), asyncHandler(authController.register));
router.post('/login', validate(login), asyncHandler(authController.login));
router.get('/logout', authenticateUser, asyncHandler(authController.logout));

export default router;
