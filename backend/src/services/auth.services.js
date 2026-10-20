import * as userRepository from "../repositories/user.repository.js";
import * as refreshTokenRepository from "../repositories/refreshToken.repository.js";
import { hashPassword,comparePassword } from "../utils/password.js";
import AppError from "../errors/AppError.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../utils/jwt.js";
import { hashToken } from "../utils/tokenHash.js";


const registerUser = async ({ name, email, password }) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
    });

    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

const loginUser = async ({email,password}) => {

    // find user by email 
    const user = await userRepository.findByEmail(email);    

    if(!user){
        throw new AppError("Invalid email or password", 401);
    }

    // compare entered password with stored hash 
    const isPasswordValid = await comparePassword(password,user.password);

    if(!isPasswordValid){
        throw new AppError("Invalid email or password",401);
    }

    // Genrate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    

    const tokenHash = hashToken(refreshToken);

    await refreshTokenRepository.createRefreshToken({
        user: user._id,
        tokenHash,
        expiresAt:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    await userRepository.updateLastLogin(user._id);

    // remove password before sending it to user 

    const userObject = user.toObject();
    delete userObject.password;

    return {
        user: userObject,
        accessToken,
        refreshToken,
    };
};

const refreshAccessToken  = async(refreshToken) =>{

      // 1. Verify that the refresh JWT itself is valid
    const decoded = verifyRefreshToken(refreshToken);

    const tokenHash = hashToken(refreshToken);

    const storedToken = await refreshTokenRepository.findByTokenHash(tokenHash);

    if(!storedToken){
        throw new AppError("Invalid refresh token", 401);
    }

    // check whether the token was revoked 
    if(storedToken.revokedAt){
        throw new AppError("Refresh token has been revoked", 401);
    }

    if(storedToken.expiresAt < new Date()){
        throw new AppError("Refresh token has expired", 401);
    }

    if(decoded.sub != storedToken.user._id.toString()){
       throw new AppError("Invalid refresh token", 401);
    }

    // 7. Revoke the old refresh token
    await refreshTokenRepository.revokeToken(storedToken._id);

    // 8. Generate new tokens
    const accessToken = generateAccessToken(storedToken.user);
    const newRefreshToken = generateRefreshToken(storedToken.user);

    // 9. Hash the new refresh token
    const newTokenHash = hashToken(newRefreshToken);

    // 10. Store the new refresh-token session
    await refreshTokenRepository.createRefreshToken({
        user: storedToken.user._id,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    });

    // 11. Return new tokens
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };

}


const logoutUser = async(refreshToken)=>{
    
    const tokenHash = hashToken(refreshToken);


    const storedToken = await refreshTokenRepository.findByTokenHash(tokenHash);

    if(!storedToken){
        // Token may already be invalid/revoked.
        // Logout can safely remain idempotent.
        return;
    }

    if(!storedToken.revokedAt){
        await refreshTokenRepository.revokeToken(storedToken._id);
    }
};




export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
};