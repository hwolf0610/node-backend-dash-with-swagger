const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAdminCard = new Schema({
    title: {
        type: String
    },
    cardCount: {
        type: String
    },
    status: {
        type: String
    },
    exercisesData:{
        type:Array
    }
});
module.exports = mongoose.model('DashAdminCard', DashAdminCard);

