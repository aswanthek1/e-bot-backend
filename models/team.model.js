const mongoose = require("mongoose");


const teamSchema = mongoose.Schema(
    {
        team_name: {
            type: String,
            required: true,
            unique:true,
        },
        total_members: {
            type: Number,
            required:true
        },
        total_wins: {
            type: Number,
            required: true,
            default: 0
        },
        total_lose: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('teams', teamSchema)