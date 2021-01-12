const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAppUser = new Schema({
    displayname: {
        type: String
    },
    username: {
        type: String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    profileImage:{
        type:String
    },
    DataRegistered:{
        type:String
    },
    Membership:{
        type:String
    },
    Role:{
        type:String
    },
    Subscription:{
        type:String
    },
    Device:{
        type:String
    },
    PaymentMethod:{
        type:String
    },
    RenewDate:{
        type:String
    },
    gender:{
        type:String
    },
    friendsIds:{
        type:Array
    },
    requestedUsers:{
        type:Array
    },
    receivedUsers:{
        type:Array
    },
    challengesIds:{
        type:Array
    },
    AdsStatus:{
        type:Boolean
    },
    flag:{
        type:String
    },
    status:{
        type:String
    },
    kid:{
        type:String
    }
});
module.exports = mongoose.model('DashAppUser', DashAppUser);