const teamModel = require("../models/team.model");

const FILE_NAME = 'helper/team.helper.js';

exports.createTeamData = async(payload) => {
    try {
        if(!payload || !Object.keys(payload).length || !Object.values(payload).length) {
             throw new Error('Missing payload' + FILE_NAME +error)
        }
        const team = await teamModel(payload).save()
        return team
    } catch (error) {
        throw new Error('Error Found While Creating Team' + FILE_NAME +error)
    }
}

exports.findTeamByCred = async(credentials={}) => {
    try {
        if(!credentials || !Object.keys(credentials).length || !Object.values(credentials).length) {
             throw new Error('Missing credentials' + FILE_NAME )
        }
        const team = await teamModel.findOne(credentials)
        return team
    } catch (error) {
        throw new Error('Error Found While Finding Author by email' + FILE_NAME +error)
    }
}

exports.getAllTeam = async() => {
    try {
        const team = await teamModel.find()
        return team
    } catch (error) {
        throw new Error('getAllTeam' + FILE_NAME +error)
    }
}

exports.updateTeamData = async(teamId, payload) => {
    try {
        if(!teamId) {
            throw new Error('Missing Team Id ' + FILE_NAME)
        }
        if(!payload || !Object.keys(payload).length || !Object.values(payload).length) {
             throw new Error('Missing payload' + FILE_NAME)
        }
        const team = await teamModel.findByIdAndUpdate(teamId, payload, {new: true})
        return team
    } catch (error) {
        console.log(error, 'errror')
        throw new Error('Error Found While updateTeamData' + FILE_NAME +error)
    }
}