'use strict'
import express from "express";
import { web } from "@/routes";
import appConfig from "@/config/app.config";

const { app: { prefix } } = appConfig;
const router = express.Router();

router.use(prefix, web)

// handler error
router.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
router.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        // stack: error.stack,
        message: error.message || "Internal Server Error"
    })
})

export default router;
