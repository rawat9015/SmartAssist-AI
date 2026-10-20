import {Router} from "express";

import { generate } from "../controllers/ai.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import { aiGenerateSchema } from "../validators/ai.validator.js";

import aiRateLimit from "../middlewares/aiRateLimit.middleware.js";

const router = Router();

router.post(
  "/generate",
  authenticate,
  aiRateLimit,
  validate(aiGenerateSchema),
  asyncHandler(generate)
);

export default router;