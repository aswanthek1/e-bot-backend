const { saveNotification } = require("../helper/notification.helper");
const { findTeamByCred, createTeamData, getAllTeam, updateTeamData } = require("../helper/team.helper");
const { findAllSubscribers } = require("../helper/user.helper");
const { logger } = require("../utils/logger");
const FILE_NAME = 'controllers/team.js'

exports.createTeam = async (req, res, next) => {
    try {
        logger(FILE_NAME, "register() start", req.body);
        const team = await findTeamByCred({ team_name: req.body?.team_name })
        if (team) {
            return res.status(400).json({ message: `Team with the name ${req.body?.team_name} already exists.` })
        }
        const data = await createTeamData(req.body)
        res.send({ message: 'Team Created Successfully!', data })
    } catch (error) {
        logger(FILE_NAME, "register() catch", { error });
        next(error)
    }
}

exports.getTeamsData = async (req, res, next) => {
    try {
        logger(FILE_NAME, "getTeamsData() start", {});
        const data = await getAllTeam()
        logger(FILE_NAME, "getTeamsData() end", { data });
        res.send({ message: 'Successfully fetched teams.', data })
    } catch (error) {
        logger(FILE_NAME, "getTeamsData() catch", { error });
        next(error)
    }
}

exports.editTeam = async (req, res, next) => {
    try {
        logger(FILE_NAME, "editTeam() start", req.body);
        const team = await findTeamByCred({ _id: req.params?.id })
        if (!team) {
            return res.status(400).json({ message: `Team not found` })
        }
        const updatedData = await updateTeamData(req.params?.id, req.body)
        console.log(updatedData, 'updated updatedData')
        // For notifications to subscribed users
        const subscribedUsers = await findAllSubscribers(req.params?.id)
        const notificationsArray = []
        subscribedUsers.forEach(async (user) => {
            if (team?.team_name !== updatedData?.team_name) {
                notificationsArray.push({ userId: user._id, message: `${team?.team_name} updated their name to ${updatedData?.team_name}` })
            }
            if (team?.total_members !== updatedData?.total_members) {
                notificationsArray.push({ userId: user._id, message: `${updatedData?.team_name} updated their total members to ${updatedData?.total_members}` })
            }
            if (team?.total_wins < updatedData?.total_wins) {
                const wins = updatedData?.total_wins - team?.total_wins;
                notificationsArray.push({ userId: user._id, message: `${updatedData?.team_name} won ${wins} more match.` })
            }
            if (team?.total_lose < updatedData?.total_lose) {
                const lostNumber = updatedData?.total_lose - team?.total_lose;
                notificationsArray.push({ userId: user._id, message: `${updatedData?.team_name} lost ${lostNumber} more match.` })
            }
        });
        for (let obj of notificationsArray) {
            const notification = await saveNotification({ receiving_user_id: obj?.userId, message: obj?.message })
            req.io.to(obj?.userId.toString()).emit('teamUpdated', { notification });
        }
        res.send({ message: 'Team Updated Successfully!', updatedData })
    } catch (error) {
        logger(FILE_NAME, "editTeam() catch", { error });
        next(error)
    }
}