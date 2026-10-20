import * as userRepository from "../repositories/user.repository.js";
import AppError from "../errors/AppError.js";

const getUserProfile = async (userId) =>{
    const user = userRepository.findById(userId);
    
    if(!user){
        throw new AppError("User not found", 404);
    }

    return user;
};

export {getUserProfile};