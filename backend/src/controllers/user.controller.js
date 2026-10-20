import * as userService from "../services/user.service.js";



const getProfile = async (req,res) =>{

    const user = await userService.getUserProfile(req.user.sub);


    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: {
            user
        },
    })
}

export{
    getProfile
}