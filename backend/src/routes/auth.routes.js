import {Router} from "express";

import { regsiter,login ,refresh, logout} from "../controllers/auth.controller.js";
import { registerSchema, loginSchema ,refreshSchema} from "../validators/auth.validators.js";
import validate from "../middlewares/validate.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post(
    '/register',
    validate(registerSchema),
    asyncHandler(regsiter)
);

router.post(
    '/login',
    validate(loginSchema),
    asyncHandler(login),
);

router.post(
    '/refresh',
     validate(refreshSchema),
    asyncHandler(refresh),
);

router.post(
    '/logout',
    validate(refreshSchema),
    asyncHandler(logout),
)



export default router;