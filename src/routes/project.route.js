'use strict';
import express from 'express';
import asyncHandler from '@/middleware/asyncHandler';
import projectController from '@/controller/project.controller';


const router = express.Router();

router.get('/', asyncHandler(projectController.getProjects));

export default router;
