const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAppchallenges = new Schema({    
    createdBy : {
        type: String
    },
    title: {
        type: String
    },
    challengeBGImage:{
        type:String
    },
    accessType: {
        type: String
    },
    description:{
        type:String
    },
    allStep:{
        type:String
    },
    scheduleDate:{
        type:String
    },
    TypeImage:{
        type:String
    },
    TypeTitle: {
        type: String
    },
    Plan :{
        type:String
    },
    Version :{
        type:String
    },
    Host :{
        type:String
    },
    ActiveDate :{
        type:String
    },
    Featured :{
        type:String
    },
    category :{
        type:String
    },
    typeDescription :{
        type:String
    },
    startDate:{
        type:String
    },
    myStep:{
        type:String
    },
    joinedUsers:{
        type:Array
    },
    status:{
        type:String
    },
    signUps:{
        type:String
    },
    leftChallenge:{
        type:String
    },
    challengeView:{
        type:String
    }
});
module.exports = mongoose.model('DashAppchallenges', DashAppchallenges);