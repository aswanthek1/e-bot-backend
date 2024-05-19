const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    receiving_user_id: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref:'users'
    },
    message: {
        type: String,
        required: true
    },
    viewed: {
        type: Boolean,
        default:false
    }
},{ timestamps: true });

module.exports = mongoose.model("notifications", notificationSchema);