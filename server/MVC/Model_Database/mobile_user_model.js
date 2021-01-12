//defining user schema
var UserSchema = new Schema({
    email: {
        type: String, required: true,
        trim: true, unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    firstName: { type: String },
    lastName: { type: String }
});

mongoose.model('User', UserSchema); //defining model
var User = require('mongoose').model('User'); //getting model