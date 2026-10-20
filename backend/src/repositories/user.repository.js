import User from "../models/user.model.js";

const createUser = async (userData) => {
    return await User.create(userData);
}


const findByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
}

const findById = async (userId) => {
    return await User.findById(userId);
}

const updateLastLogin = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            lastLoginAt: new Date(),
        },
        {
            new: true,
        }
    )
}

const findActiveUserById = async (userId)=>{
    return await User.findById({
        _id: userId,
        isActive: true,
    });
};

export {
    createUser,
    findByEmail,
    findById,
    updateLastLogin,
    findActiveUserById,
};