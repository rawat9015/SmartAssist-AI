import { rateLimit } from "express-rate-limit";
import { success } from "zod";

const aiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10, // Maximum 10 requests per user
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => req.user.sub,

    handler : (req, res) => {
        res.status(429).json({
            success:false,
            message: "Too many AI requests. Please try again after 15 minutes.",
        });
    },
});

export default aiRateLimit;