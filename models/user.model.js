const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type:String,
            required:true,
        },
        role: {
            type: String,
            enum: ['basic', 'admin'],
            required: true,
            default: 'basic'
        },
        subscribed_team: [{ type : Schema.Types.ObjectId, ref: 'teams', default:[] }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('users', userSchema)