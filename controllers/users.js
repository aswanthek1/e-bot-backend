"use strict";

const { getUserNotifications } = require('../helper/notification.helper');
const { findTeamByCred } = require('../helper/team.helper');
const { findUserByCred, createUser, subscribeTeamHelper } = require('../helper/user.helper');
const { generateToken } = require('../utils/generateToken.utils');
const { logger } = require('../utils/logger')
const FILE_NAME = 'controllers/users.js'
const md5 = require('md5');

exports.register = async(req, res, next) => {
    try {
        logger( FILE_NAME, "register() start", req.body);
        const user = await findUserByCred({ email: req.body?.email })
        if (user) {
            return res.status(400).json({ message: 'Email already exists.' })
        }
        const hashedPassword = md5(req.body?.password)
        req.body.password = hashedPassword
        const data = await createUser(req.body)
        console.log(data)
        res.send({ message: 'User registerd Successfully!', name:data.name, email:data.email, role: data.role })
    } catch (error) {
        console.log(error, 'error')
        next(error)
    }
}

exports.login = async(req, res, next) => {
    try {
        logger(FILE_NAME, "login() start", req.body);
        req.body.password = md5(req.body.password);
        const user = await findUserByCred(req.body)
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }
        const { accessToken, refreshToken } = await generateToken(user)
        logger(FILE_NAME, "login() end", {user});
        res.send({
            message: 'Logged in successfully.',
            accessToken,
            data: user
        })
    } catch (error) {
        logger(FILE_NAME, "login() catch", {error});
        next(error)
    }
}

exports.subscribeTeam = async(req, res, next) => {
    try {
        logger(FILE_NAME, "subscribeTeam() start", {params:req.params});
        const teamId = req.params?.teamId
        if(!teamId) {
           return res.status(400).json({message: 'Team Id is missing'})
        }
        const team = await findTeamByCred({ _id: teamId })
        if(!team) {
            return res.status(400).json({message: 'Team not found'})
        }
        const result = await subscribeTeamHelper(teamId, req.user?._id)
        res.send({message: result.message, subscribed:result.subscribed, unsubscribed: result.unsubscribed})
    }catch(error) {
        logger(FILE_NAME, "subscribeTeam() catch", {error});
        next(error)
    }
}

exports.getNotificationsOfUser = async(req, res, next) => {
    try {
        logger( FILE_NAME, "getNotificationsOfUser() start", {});
        const data = await getUserNotifications(req.user._id)
        logger( FILE_NAME, "getNotificationsOfUser() end", {data});
        res.send({ message: 'Successfully fetched notifications of user.', data})
    }catch(error) {
        logger( FILE_NAME, "getNotificationsOfUser() catch", {error});
        next(error)
    }
}