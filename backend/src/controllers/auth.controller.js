import { success } from "zod";
import * as authService from "../services/auth.services.js";

const regsiter = async (req, res) =>{
    const user = await authService.registerUser(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data : {
            user,
        },
    });
};

const login = async(req,res) =>{
    
    const result = await authService.loginUser(req.body);

    res.status(200).json({
        success:true,
        message:"Login Successfully",
        data:result,
    });
};

const refresh = async(req,res)=>{
    const {refreshToken} = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        data: result,
    });
}

const logout = async (req,res)=>{
    
    const {refreshToken} = req.body;

    await authService.logoutUser(refreshToken);


    res.status(200).json({
         success: true,
        message: "Logout successful",
    });
}

export {
    regsiter,
    login,
    refresh,
    logout,
}