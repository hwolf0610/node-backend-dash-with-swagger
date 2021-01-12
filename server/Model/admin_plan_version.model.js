const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAdminPlanVersion = new Schema({
    version: {
        type: String
    },
    planTypeVersionID: {
        type: String
    },
    planVersionID: {
        type: String
    },
    planVersionDayTaskData:{
        type:Array
    }
});
module.exports = mongoose.model('DashAdminPlanVersion', DashAdminPlanVersion);

