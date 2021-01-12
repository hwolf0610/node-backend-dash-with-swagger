const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAppMypost = new Schema({
    createdBy: {
        type: String
    },
    challengeId: {
        type: String
    },
    creationDate: {
        type: String
    },
    detail:{
        type:String
    },
    postStatus:{
        type:String
    },
    postImage:{
        type:String
    },
    friendsIds:{
        type:Array
    },
    commitData:{
        type:Array
    }
    // ,
    // commitIds:{
    //     type:Array
    // },
    // commitDetails:{
    //     type:Array
    // },
    // commitPicture:{
    //     type:Array
    // },
    // commitTypes:{
    //     type:Array
    // }
});
module.exports = mongoose.model('DashAppMypost', DashAppMypost);