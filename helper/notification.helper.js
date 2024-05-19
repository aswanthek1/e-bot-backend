const notificationModel = require("../models/notification.model");

const FILE_NAME = 'helper/team.helper.js';

exports.saveNotification = async (payload) => {
    try {
        if (!payload || !Object.keys(payload).length || !Object.values(payload).length) {
            throw new Error('Missing payload' + FILE_NAME)
        }
        const newNotification = await notificationModel(payload).save()
        return newNotification
    } catch (error) {
        throw new Error('Error Found While Creating Team' + FILE_NAME + error)
    }
}

exports.getUserNotifications = async (userId) => {
    try {
        if (!userId) {
            throw new Error('Missing User Id at getUserNotifications' + FILE_NAME )
        }
        const data = await notificationModel.find({receiving_user_id: userId}).sort({createdAt:-1 })
        return data;
    } catch (error) {
        throw new Error('Error Found While getUserNotifications' + FILE_NAME + error)
    }
}