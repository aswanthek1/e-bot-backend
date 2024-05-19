const userModel = require("../models/user.model")
const FILE_NAME = 'helper/user.helper.js'

exports.findUserByCred = async (credentials = {}) => {
    try {
        if (!credentials || !Object.keys(credentials).length || !Object.values(credentials).length) {
            throw new Error('Missing credentials' + FILE_NAME)
        }
        const author = await userModel.findOne(credentials).select(["-password"])
        return author
    } catch (error) {
        throw new Error('Error Found While Finding Author by email' + FILE_NAME + error)
    }
}

exports.createUser = async (body) => {
    try {
        const data = await new userModel(body).save()
        return { message: 'User Created Successfully', data: data }
    } catch (error) {
        throw new Error('Error Found While creating User in ' + FILE_NAME + error)
    }
}

exports.subscribeTeamHelper = async (teamId, userId) => {
    try {
        if (!teamId || !userId) {
            throw new Error('Missing team id or user id in subscribeTeamHelper ' + FILE_NAME + error)
        }

        // first check if the team is already subscribed if subscribed remove it else push it

        const teamExists = await userModel.findOne({ _id: userId, subscribed_team: teamId  })

        if (teamExists) {
            await userModel.findByIdAndUpdate(userId, {
                $pull: {
                    subscribed_team: teamId
                }
            })
            return { unsubscribed: true, subscribed:false, message: 'Successfully unsubscribed the team' }
        }
        else {
            await userModel.findByIdAndUpdate(userId,
                {
                    $push:
                        { subscribed_team: teamId }
                }
            )
            return { unsubscribed: false, subscribed:true, message: 'Successfully subscribed to the team' }
        }

    } catch (error) {
        throw new Error('Error Found While subscribeTeamHelper ' + FILE_NAME + error)
    }
}

exports.findAllSubscribers = async(teamId) => {
    try {
        const data = await userModel.find({subscribed_team: teamId})
        return data;
    }catch(error) {
        throw new Error('Error Found While findAllSubscribers ' + FILE_NAME + error)
    }
}