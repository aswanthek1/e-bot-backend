const { checkAccessToken } = require("../auth/verifyToken");
const { findUserByCred } = require("../helper/user.helper");
const { logger } = require("../utils/logger");
const FILE_NAME = 'middleware/auth.middlware.js'

exports.authenticate = async(req, res, next) => {
    try {
        logger( FILE_NAME, "authenticate() start", {});
        const data = await checkAccessToken(req, res, next)
        logger( FILE_NAME, "authenticate() middle", {reqUser:req.user, data: data});
        if(!data?.error && data?.status === 200) {
            next()
        }
        else {
            return res.status(403).json({message: 'User not found'})
        }
    } catch (error) {
        logger( FILE_NAME, "authenticate() catch", {error});
        next(error)
    }
}

exports.checkAdmin = (req, res, next) => {
    try {
        console.log(req.user, 'user at checkadmin')
        if(req.user?.role === 'admin') {
            next()
        }
        else {
            return res.status(401).json({message: 'You are not authorized'})
        }
    } catch (error) {
        console.log(error, 'error at checkadmin')
    }
}

exports.authenticateUser = async(req, res, next) => {
    try {
        const data = await checkAccessToken(req, res, next, true);//true is to check if it is calling from authcontroller
        console.log(data, "data", req.user)
        let status = 200
        if(data?.error) {
            status = 400
        }
        let user;
        if(req.user?._id) {
            user = await findUserByCred({_id: req.user?._id})
        }
        res.status(status).json({message: 'Found user', user})
    } catch (error) {
        next(error)
    }
}