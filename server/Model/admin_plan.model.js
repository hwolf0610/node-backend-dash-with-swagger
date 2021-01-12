const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAdminPlan = new Schema({
    createdBy: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    planImage: {
        type: String
    },
    planVideo: {
        type: String
    },
    host: {
        type: String
    },
    totalCreations:{
        type:String
    },
    status:{
        type:String
    },
    public:{
        type:String
    },
    planTypeData:{
        type:Array
    }
});
module.exports = mongoose.model('DashAdminPlan', DashAdminPlan);

