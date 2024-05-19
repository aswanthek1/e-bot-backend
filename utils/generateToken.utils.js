const jwt = require('jsonwebtoken');
const userTokenModel = require('../models/userToken.model');
const { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require('../constants/constants');

exports.generateToken = async(user) => {
    try {
        const payload = { _id: user._id, email: user.email, role:user.role };
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRETKEY,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_SECRETKEY,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );
        const userToken = await userTokenModel.findOne({ userId: user._id });
        console.log(userToken, 'usertokne')
        if (userToken) await userTokenModel.deleteOne({_id: userToken._id});

        await new userTokenModel({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (error) {
        return Promise.reject(error);
    }
}