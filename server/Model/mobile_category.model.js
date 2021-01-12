const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAppCategory = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    color:{
        type:String
    },
    picture:{
        type:String
    }
});
module.exports = mongoose.model('DashAppCategory', DashAppCategory);