'use strict'
import express from "express";
import asyncHandler from "@/middleware/asyncHandler";
import authController from "@/controller/auth.controller";
import authMiddleware from "@/middleware/authentication";
import productController from "@/controller/product.controller";
import userController from "@/controller/user.controller";
import paymentController from "@/controller/payment.controller";

const router = express.Router();


// auth routes
router.post('/auth/register', asyncHandler(authController.register));
router.post('/auth/login', asyncHandler(authController.login));
router.get('/auth/logout', authMiddleware.authenticateUser, asyncHandler(authController.logout));

//users route
router.get('/users/me', asyncHandler(authMiddleware.authenticateUser), asyncHandler(userController.getInfo));

//product routes
router.post('/products',
    [authMiddleware.authenticateUser, authMiddleware.authorizePermissions], asyncHandler(productController.createProduct));
router.get('/products', productController.getAllProducts);
router.get('/products/:id', asyncHandler(productController.getProduct));
router.put('/products/:id', [authMiddleware.authenticateUser, authMiddleware.authorizePermissions], asyncHandler(productController.updateProduct));
router.delete('/products/:id', [authMiddleware.authenticateUser, authMiddleware.authorizePermissions], asyncHandler(productController.deleteProduct));

//payment routes
router.get('/payments/trials/active', asyncHandler(paymentController.getActiveTrials));
router.get('/payments/subscriptions/active', asyncHandler(paymentController.getActiveSubs));
router.get('/payments/customers/new', asyncHandler(paymentController.getNewCustomers));
router.get('/payments/users/active', asyncHandler(paymentController.getActiveUsers));
router.get('/payments/revenues', asyncHandler(paymentController.getRevenues));
export default router;