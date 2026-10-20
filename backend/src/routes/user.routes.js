import {Router} from "express";

import { getProfile } from "../controllers/user.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

import asyncHandler from "../utils/asyncHandler.js";


const router = Router();

router.get(
    "/profile",
    authenticate,
    asyncHandler(getProfile)
);



export default router;