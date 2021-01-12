const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAppVideoExerciseFile = new Schema({
    title: {
        type: String
    },
    time: {
        type: String
    },    
});
module.exports = mongoose.model('DashAppVideoExerciseFile', DashAppVideoExerciseFile);