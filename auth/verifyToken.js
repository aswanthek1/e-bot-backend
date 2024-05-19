const userTokenModel = require("../models/userToken.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { ACCESS_TOKEN_EXPIRY } = require("../constants/constants");

const privateKey = process.env.JWT_SECRETKEY;

const verifyRefreshToken = async (accessToken) => {

    try {

        if (!accessToken || accessToken == 'null') {
            return { error: true, message: "Invalid refresh token1", status: 400 }
        }
        console.log(accessToken, "at refres")
        const decodedAccess = jwt.decode(accessToken);
        console.log(decodedAccess?._id, 'decoded access at refres')

        const userId = new mongoose.Types.ObjectId(decodedAccess?._id)

        // now find refresh token from db and check validity. If valid create a new access token and save in frontent
console.log(userId, 'userIduserId')
        const tokenModelData = await userTokenModel.findOne({userId}).populate('userId')

        console.log(tokenModelData, "tokenmodel datatata");
        
        if(!tokenModelData) {
            return {
                error: true,
                message: "Invalid refresh token",
                status: 400
            }
        }
        console.log(process.env.JWT_SECRETKEY,"privateKey,")
        const refreshToken = tokenModelData?.token;
        return await jwt.verify(refreshToken, process.env.JWT_SECRETKEY, async (err, decoded) => {
            if (err) {
                console.log(err, "error refressssssssssss")
                return {
                    error: true,
                    message: "Invalid refresh token",
                    status: 400
                }
            }
            console.log(decoded, "decoded at access")
            if (decoded) {
                // generate new access token
                const payload = { _id: tokenModelData?.userId?._id, email: tokenModelData?.userId?.email, role: tokenModelData?.userId?.role };
                const accessToken = jwt.sign(
                    payload,
                    process.env.JWT_SECRETKEY,
                    { expiresIn: ACCESS_TOKEN_EXPIRY }
                );
                return {
                    accessToken,
                    payload:payload,
                    error: false,
                    message: "Generated new access token",
                    status: 200,
                }
            }
        })

    } catch (error) {
        console.log(error, "")
        throw new Error('Error at veriry refresh token'+error)
    }
};


const checkAccessToken = async (req, res, next) => {
    try {
        let accessToken = req.headers?.authorization;
        console.log(accessToken)
        if (!accessToken || accessToken == 'undefined') {
            return { error: true, message: "Invalid access token1", status: 400 }
        }
        if(accessToken?.startsWith('Bearer ')) {
            accessToken = accessToken?.replace('Bearer ', '')
        }
        return await jwt.verify(accessToken, process.env.JWT_SECRETKEY, async (err, decoded) => {
            if (err) {
                ///if not decode then use refresh token to create new access token.
                const createNewAccess = await verifyRefreshToken(accessToken)
                if(!createNewAccess.error && createNewAccess.status === 200 && createNewAccess.payload) {
                    req.user = createNewAccess.payload;
                    delete createNewAccess.payload;
                }
                return createNewAccess
            }
            if (decoded) {
                req.user = decoded
                return {
                    decoded,
                    error: false,
                    message: "Valid refresh token",
                    status: 200
                }
                // next()
            }
        })
    } catch (error) {
        console.log(error, 'in check access error')
    }
}

module.exports = {
    verifyRefreshToken,
    checkAccessToken
}