import AppError from "../errors/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import * as userRepository from "../repositories/user.repository.js";

const authenticate = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError("Authentication required", 401);
        }

        const [schema, token] = authHeader.split(" ");
        // scheme = "Bearer"
        // token = "eyJhbGciOiJIUzI1NiIs..."

        if (schema != 'Bearer' || !token) {
            throw new AppError("Invalid authorization header", 401);
        }

        const decode = verifyAccessToken(token);

        const user = userRepository.findActiveUserById(decode.sub);

        if(!user){
            throw new AppError("User account is inactive or not found", 401);
        }

        if (decode.type !== 'access') {
            throw new AppError("Invalid access token", 401);
        }

        req.user = decode;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Access token has expired", 401));
        }

        if (error.name === "JsonWebTokenError") {
            return next(new AppError("Invalid access token", 401));
        }
        next(error);
    }

}


export default authenticate;
