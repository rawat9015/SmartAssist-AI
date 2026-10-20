import jwt from 'jsonwebtoken';

import env from '../config/env.js';


const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            type: "access",
        },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    )
};

const generateRefreshToken = (user) => {
    return jwt.sign({
        sub: user._id.toString(),
        type: "refresh",
    },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }

    )
};


const verifyAccessToken = (token) =>{
return jwt.verify(token,env.JWT_ACCESS_SECRET);
}

const verifyRefreshToken = (token) =>{
return jwt.verify(token,env.JWT_REFRESH_SECRET);
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};