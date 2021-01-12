const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DashAppWorkout = new Schema({
    title: {
        type: String
    },
    description:{
        type:String
    },
    postImage:{
        type:String
    },
    WorkoutTypeData:{
        type:Array
    },
    // workoutType:{
    //     type:Array
    // },
    // workoutTypeVisible:{
    //     type:Array
    // },
    // workoutTypeImage:{
    //     type:Array
    // },
    // workoutTypeTitle:{
    //     type:Array
    // },
    // workoutTypeStepDetail:{
    //     type:Array
    // },
    // workoutTypeGrowLevel:{
    //     type:String
    // },
    // workoutTypeDetail:{
    //     type:Array
    // },
    AdsStatus:{
        type:Boolean
    },
    // workoutTypelunchFile:{
    //     type:Array
    // }
});
module.exports = mongoose.model('DashAppWorkout', DashAppWorkout);