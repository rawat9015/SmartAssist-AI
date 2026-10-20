import RefreshToken from "../models/refreshToken.model.js";

const createRefreshToken = async (data) => {
    
    // return await RefreshToken.create(data);
   const result =  await RefreshToken.create(data);

   console.log(`Response DB ${result}`);
   
}

const findByTokenHash = async (tokenHash) => {
    return await RefreshToken.findOne({ tokenHash }).populate("user");;
} 

const revokeToken = async (tokenId) => {
    return await RefreshToken.findByIdAndUpdate(
        tokenId,
        {
            revokedAt: new Date(),
        },

        {
            new: true,
        }
    )
}

export {
    createRefreshToken,
    findByTokenHash,
    revokeToken,
}
