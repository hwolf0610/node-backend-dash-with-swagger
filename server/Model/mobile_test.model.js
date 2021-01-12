const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAppTest = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    DataSub:{
        type:Array
    },
    picture:{
        type:String
    }
});
module.exports = mongoose.model('DashAppTest', DashAppTest);