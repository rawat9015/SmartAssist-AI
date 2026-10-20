import {Router} from "express";
import AppError from "../errors/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/",
    asyncHandler(
    (req,res)=>{
    res.json({
        success : true,
        message: "Backend is healthy",
    });
}));

router.get('/error',
    asyncHandler(
    (req, res, next)=>{
    next(new AppError("Testing Custom AppError", 400));
}));


export default router;