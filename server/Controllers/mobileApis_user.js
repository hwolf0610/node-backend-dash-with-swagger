var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const request = require('request');
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/DashApp', { useNewUrlParser: true });
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully");
// })

let User = require('../Model/mobile_User.model');
let Category = require('../Model/mobile_category.model');
let Challenges = require('../Model/mobile_challenges.model');
let Post = require('../Model/mobile_Post.model');
let Workout = require('../Model/mobile_workout.model');

var Jsonwebtoken;

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)  2073600s
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '2073600s' });
    // //no expired token
    // jwt.sign({email:'sivamanismca@gmail.com',role:'User'}, "Secret", {});
}

// SET STORAGE
var date, inputDate, fileName;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./client/build/static/media/")
    },
    filename: function (req, file, cb) {
        date = new Date();
        inputDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getDay() + "-" + date.getHours() + "-" + date.getMinutes()
        console.log(file);
        fileName = inputDate + "-" + file.originalname;
        cb(null, fileName);
        // cb(null, file.fieldname + '-' + Date.now())
    }
})

// var upload = multer({ storage: storage })
const upload = multer(
    {
        storage: storage,
        limits:
        {
            fileSize: 1024 * 1024 * 5000
        }
    });


/**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management and login
   */

//User database CRUD API//

/**
   * @swagger
   * /mobileapi/userapi:
   *   post:
   *     description: Login to the application
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: username
   *         description: User's username.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: email
   *         description: User's email.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: displayname
   *         description: User's displayname.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: phoneNumber
   *         description: User's phoneNumber.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: Membership
   *         description: User's Membership.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Subscription
   *         description: User's Subscription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Device
   *         description: User's Device.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: PaymentMethod
   *         description: User's PaymentMethod.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: RenewDate
   *         description: User's RenewDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: User's profile Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/userapi', upload.single('picture'), function (req, res) {
    if (req.body.username != null && req.body.email != null && req.body.password != null) {
        let user = new User(req.body);
        user.save()
            .then(todo => {
                let id = user._id
                console.log("req :", id)

                User.findById(id, function (err, user) {
                    if (err) console.log("err ; ", err)
                    var date = new Date();
                    inputDate = date.getFullYear() + "-" + eval(eval(date.getMonth()) + 1)  + "-" + date.getDate() 
                    // inputDate = date.getFullYear() + "-" + eval(eval(date.getMonth()) + 1)  + "-" + date.getDate() + "-" + date.getDay() + "-" + date.getHours() + "-" + date.getMinutes()

                    console.log("doc : ", user)
                    user.profileImage = (fileName != null) ? fileName : user.profileImage;
                    user.flag = "generalUser";
                    user.status = "Active";
                    user.AdsStatus = false;
                    user.gender = null;
                    user.DataRegistered = inputDate;
                    user.displayname = (req.body.displayname) ? req.body.displayname : user.username;
                    user.phoneNumber = (req.body.phoneNumber) ? req.body.phoneNumber : "123456789";
                    user.Membership = (req.body.Membership) ? req.body.Membership : "plus";
                    user.Role = "member";
                    user.Subscription = (req.body.Subscription) ? req.body.Subscription : "free";
                    user.Device = (req.body.Device) ? req.body.Device : "android";
                    user.PaymentMethod = (req.body.PaymentMethod) ? req.body.PaymentMethod : "google";
                    user.RenewDate = (req.body.RenewDate) ? req.body.RenewDate : null;

                    Jsonwebtoken = generateAccessToken({ UserID: user._id });

                    user.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'user_token': Jsonwebtoken,
                            'data': user
                        });
                        fileName = null
                    });
                });
            })
            .catch(err => {
                res.status(401).json({
                    'status': 401,
                    'message': 'added failed',
                    'data': 'flase'
                });
            });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'please input all field or correct value',
            'data': 'flase'
        });
    }
});

/**
* @swagger
* /mobileapi/userapi:
*  get:
*      description: Use to request all users
*      tags: [Users]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/userapi', function (req, res) {
    User.find(function (err, user) {
        console.log(user.displayname);
        if (err) {
            res.status(401).json({
                'status': 401,
                'message': 'show failed',
                'data': 'flase'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': user
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/userapi/{id}:
   *   get:
   *     description: Login to the application
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: User's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/userapi/:id', function (req, res) {
    let userID = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    User.findById(userID, function (err, user) {
        // console.log(user.displayname);
        if (user == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': user
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/userapi/{id}:
   *   delete:
   *     description: Login to the application
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: User's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/userapi/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        User.deleteOne({ _id: id }, function (err, user) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                User.find(function (err2, user2) {
                    console.log(user2.username);
                    if (err2) {
                        res.status(403).json({
                            'status': 403,
                            'message': 'delete failed',
                            'data': 'false'
                        });
                        console.log("err->", err2);
                    } else {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': user2
                        });
                        console.log("err->", user2);
                    }
                });
            }
        })
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'please input ID',
            'data': 'flase'
        });
    }
});

/**
   * @swagger
   * /mobileapi/userapi:
   *   patch:
   *     description: Login to the application
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editUserID
   *         description: User's editUserID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: displayname
   *         description: User's displayname.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: username
   *         description: User's username.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: email
   *         description: User's email.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: phoneNumber
   *         description: User's phoneNumber.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: gender
   *         description: User's gender.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Membership
   *         description: User's Membership.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Device
   *         description: User's Device.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: DataRegistered
   *         description: User's DataRegistered.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: PaymentMethod
   *         description: User's PaymentMethod.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: RenewDate
   *         description: User's RenewDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: AdsStatus
   *         description: User's AdsStatus.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: challengesIds
   *         description: User's challengesIds.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: status
   *         description: User's status.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Role
   *         description: User's Role.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: User's profile Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/userapi', upload.single('picture'), function (req, res) {
    if (req.body.editUserID != null) {
        let id = req.body.editUserID
        console.log("req :", id)
        User.findById(id, function (err, user) {
            if (user == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", user)
                // 5eb8a60152360442897d08e
                // (age < 18) ? "Too young":"Old enough";
                user.displayname = (req.body.displayname != null) ? req.body.displayname : user.displayname;
                user.username = (req.body.username != null) ? req.body.username : user.username;
                user.email = (req.body.email != null) ? req.body.email : user.email;
                user.password = (req.body.password != null) ? req.body.password : user.password;
                user.gender = (req.body.gender != null) ? req.body.gender : user.gender;
                user.status = (req.body.status != null) ? req.body.status : user.status;
                user.Role = (req.body.Role != null) ? req.body.Role : user.Role;
                user.phoneNumber = (req.body.phoneNumber != null) ? req.body.phoneNumber : user.phoneNumber;

                user.DataRegistered = (req.body.DataRegistered != null) ? req.body.DataRegistered : user.DataRegistered;
                user.Membership = (req.body.Membership != null) ? req.body.Membership : user.Membership;
                user.Device = (req.body.Device != null) ? req.body.Device : user.Device;
                user.PaymentMethod = (req.body.PaymentMethod != null) ? req.body.PaymentMethod : user.PaymentMethod;
                user.RenewDate = (req.body.RenewDate != null) ? req.body.RenewDate : user.RenewDate;


                if (req.body.friendsIds != null) {
                    user.friendsIds.push(req.body.friendsIds)
                }
                if (req.body.challengesIds != null) {
                    user.challengesIds.push(req.body.challengesIds)
                }
                user.AdsStatus = (req.body.AdsStatus != null) ? req.body.AdsStatus : user.AdsStatus;
                user.profileImage = (fileName != null) ? fileName : user.profileImage;
                user.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': user
                        });
                        console.log("err->", user);
                        fileName = null
                    })
                    .catch(err => {
                        res.status(403).json({
                            'status': 403,
                            'message': 'edit failed',
                            'data': 'flase'
                        });
                    });
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'please input editID',
            'data': 'flase'
        });
    }
});

/**
   * @swagger
   * /mobileapi/userLogin:
   *   post:
   *     description: Login to the application
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: User's email.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/userLogin', function (req, res) {
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
        if (err) {
            res.status(402).json({
                'status': 402,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else if (user == null) {
            res.status(401).json({
                'status': 401,
                'message': 'Unauthorized',
                'data': 'Do not exist Data'
            });
        } else {
            Jsonwebtoken = generateAccessToken({ UserID: user._id });
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'user_token': Jsonwebtoken,
                'data': user
            });
        }
    });
});

router.get('/TokenConfirm', (req, res) => {
    if (req.headers && req.headers.authorization) {
        console.log("Token:", req.headers.authorization)
        console.log("Token:", req.headers.authorization.split(' ')[1])
        var authorization = req.headers.authorization, decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded.UserID;
            console.log("decoded:", decoded)
            User.findById(userId, function (err, user) {
                if (user != null) {
                    res.status(200).json({
                        'status': 200,
                        'message': 'token is not expired',
                        'data': 'success'
                    })
                } else {
                    res.status(201).json({
                        'status': 201,
                        'message': 'token expired',
                        'data': 'false'
                    });
                }
            });
        } catch (e) {
            res.status(401).json({
                'status': 401,
                'message': 'token expired or incorrect token.',
                'data': 'false'
            });
        }
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'request error',
            'data': 'do not exist header data'
        });
    }
});


router.get('/getCurrentUser', function (req, res) {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded.UserID;
            console.log("decoded:", decoded)
            User.findById(userId, function (err, user) {
                if (user != null) {
                    return res.status(200).json({
                        'status': 200,
                        'message': 'success',
                        'data': user
                    });
                }
            });
        } catch (e) {
            return res.status(401).json({
                'status': 401,
                'message': 'token error',
                'data': 'token expired or incorrect token.'
            });
        }
    } else {
        return res.status(400).json({
            'status': 400,
            'message': 'request error',
            'data': 'do not exist header data'
        });
    }
})


router.post('/refreshToken', (req, res) => {
    if (req.headers && req.headers.authorization) {
        let UserId = req.headers.userid;
        var authorization = req.headers.authorization.split(' ')[1]
        jwt.verify(authorization, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                User.findById(UserId, function (err, user) {
                    if (user != null) {
                        Jsonwebtoken = generateAccessToken({ UserID: user._id });
                        res.status(201).json({
                            'status': 201,
                            'message': 'Token expired',
                            'new_token': Jsonwebtoken,
                            'data': 'This is Created new Token'
                        });
                    }
                });
            } else {
                res.status(200).json({
                    'status': 200,
                    'message': 'success',
                    'data': 'token is not expired'
                })
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'request error',
            'data': 'do not exist header data'
        });
    }
});

/**
   * @swagger
   * /mobileapi/addGoogleUser:
   *   post:
   *     description: Login to the application
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id_token
   *         description: google User's id_token.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: username
   *         description: User's username.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addGoogleUser', function (req, res) {
    var URL = "https://oauth2.googleapis.com/tokeninfo?id_token=" + req.body.id_token
    // var URL = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + req.body.id_token    
    if (!req.body.id_token) {
        res.json({
            'status': 400,
            'message': 'failed',
            "data": "Looks like you are not sending the id_token"
        })
    }
    request.get({
        url: URL
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var date = new Date();
            inputDate =  date.getFullYear() + "-" + eval(eval(date.getMonth()) + 1)  + "-" + date.getDate() 

            var maybe = JSON.parse(body);
            var newBody = {}
            newBody.displayname = maybe.family_name
            newBody.username = req.body.username
            newBody.email = maybe.email
            newBody.phoneNumber = maybe.sub
            newBody.flag = "googleUser"
            newBody.status = "Active"
            newBody.Role = "member"
            newBody.Membership = "plus"
            newBody.Subscription = "free"
            newBody.Device = "android"
            newBody.PaymentMethod = "google"
            newBody.RenewDate = null
            newBody.DataRegistered = inputDate
            newBody.profileImage = maybe.picture
            newBody.kid = maybe.kid
            User.findOne({ flag: newBody.flag, kid: newBody.kid, displayname: newBody.displayname, username: newBody.username, email: newBody.email }, function (err, user) {
                if (user == null) {
                    let user2 = new User(newBody);
                    user2.save()
                        .then(todo => {
                            let id = user2._id
                            console.log("req :", id)

                            User.findById(id, function (err, user3) {
                                if (err) console.log("err ; ", err)
                                console.log("doc : ", user3)
                                user3.AdsStatus = false;
                                user3.gender = null;
                                Jsonwebtoken = generateAccessToken({ UserID: user3._id });
                                user3.save(() => {
                                    res.status(200).json({
                                        'status': 200,
                                        'message': 'added new user',
                                        'user_token': Jsonwebtoken,
                                        'data': user3
                                    });
                                });
                            });
                        })
                        .catch(err => {
                            res.status(401).json({
                                'status': 401,
                                'message': 'added failed',
                                'data': 'flase'
                            });
                        });
                } else {
                    Jsonwebtoken = generateAccessToken({ UserID: user._id });
                    res.status(200).json({
                        'status': 200,
                        'message': 'already exist google User',
                        'user_token': Jsonwebtoken,
                        'data': user
                    });
                }
            });
        } else {
            res.status(404).json({
                'status': 404,
                'message': 'invalid_token',
                'data': 'Invalid Value or expired'
            });
        }
    })
})


/**
   * @swagger
   * /mobileapi/addAppleUser:
   *   post:
   *     description: Login to the application
   *     tags: [Users]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id_token
   *         description: google User's id_token.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: username
   *         description: User's username.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: email
   *         description: User's email.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: photo
   *         description: User's photo.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: kid
   *         description: Apple  User's kid.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addAppleUser', function (req, res) {
    // var URL = "https://api.appstoreconnect.apple.com/v1/apps"
    // https://appleid.apple.com/auth/keys
    if (req.body.id_token != null && req.body.username != null && req.body.email != null && req.body.kid != null && req.body.photo != null) {
        var date = new Date();
        inputDate =  date.getFullYear() + "-" + eval(eval(date.getMonth()) + 1)  + "-" + date.getDate() 

        var newBody = {}
        newBody.displayname = req.body.username
        newBody.username = req.body.username
        newBody.email = req.body.email
        newBody.phoneNumber = "000123456"
        newBody.flag = "AppleUser"
        newBody.status = "Active"
        newBody.Role = "member"
        newBody.Membership = "plus"
        newBody.Subscription = "free"
        newBody.Device = "android"
        newBody.PaymentMethod = "google"
        newBody.RenewDate = null
        newBody.DataRegistered = inputDate
        newBody.profileImage = req.body.photo
        newBody.kid = req.body.kid
        var id_token = req.body.id_token
        User.findOne({ flag: newBody.flag, kid: newBody.kid, displayname: newBody.displayname, username: newBody.username, email: newBody.email }, function (err, user) {
            if (user == null) {
                let user2 = new User(newBody);
                user2.save()
                    .then(todo => {
                        let id = user2._id
                        console.log("req :", id)
                        User.findById(id, function (err, user3) {
                            if (err) console.log("err ; ", err)
                            console.log("doc : ", user3)
                            user3.AdsStatus = false;
                            user3.gender = null;
                            Jsonwebtoken = generateAccessToken({ UserID: user3._id });
                            user3.save(() => {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'added new user',
                                    'user_token': Jsonwebtoken,
                                    'data': user3
                                });
                            });
                        });
                    })
                    .catch(err => {
                        res.status(401).json({
                            'status': 401,
                            'message': 'added failed',
                            'data': 'flase'
                        });
                    });
            } else {
                Jsonwebtoken = generateAccessToken({ UserID: user._id });
                res.status(200).json({
                    'status': 200,
                    'message': 'already exist Apple User',
                    'user_token': Jsonwebtoken,
                    'data': user
                });
            }
        });
    } else {
        res.status(404).json({
            'status': 404,
            'message': 'please input all field or correct value',
            'data': 'flase'
        });
    }
});

//friend invite API
router.post('/sendFriendInvite', function (req, res) {
    if (req.headers && req.headers.authorization) {
        let friendId = req.headers.friendid;
        console.log("friend:", req.headers)
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded.UserID;
            // Fetch the user by id 
            User.findOne({ _id: userId }).then(function (user) {
                if (user == null) {
                    return res.status(400).json({
                        'status': 400,
                        'message': 'request error',
                        'data': 'do not exist user'
                    });
                } else {
                    // Do something with the user 
                    User.findOne({ _id: friendId }).then(function (user2) {
                        if (user2 != null) {
                            var newBody1 = {}
                            newBody1._id = user2._id
                            newBody1.displayname = user2.displayname
                            newBody1.username = user2.username
                            newBody1.email = user2.email
                            newBody1.phoneNumber = user2.phoneNumber
                            newBody1.flag = user2.flag
                            newBody1.profileImage = user2.profileImage
                            newBody1.gender = user2.gender
                            newBody1.kid = user2.kid
                            user.requestedUsers.push(newBody1)
                            user.save(() => {
                                User.findOne({ _id: friendId }).then(function (user3) {
                                    if (user3 != null) {
                                        // Do something with the user 
                                        User.findOne({ _id: userId }).then(function (user4) {
                                            var newBody2 = {}
                                            newBody2._id = user4._id
                                            newBody2.displayname = user4.displayname
                                            newBody2.username = user4.username
                                            newBody2.email = user4.email
                                            newBody2.phoneNumber = user4.phoneNumber
                                            newBody2.flag = user4.flag
                                            newBody2.profileImage = user4.profileImage
                                            newBody2.gender = user4.gender
                                            newBody2.kid = user4.kid
                                            user3.receivedUsers.push(newBody2)
                                            user3.save(() => {
                                                return res.status(200).json({
                                                    'status': 200,
                                                    'message': 'success',
                                                    'data': user.requestedUsers
                                                });
                                            });
                                        })
                                    }
                                });
                            });
                        }
                    })
                }
            });
        } catch (e) {
            return res.status(401).json({
                'status': 401,
                'message': 'token error',
                'data': 'token expired or incorrect token.'
            });
        }
    } else {
        return res.status(400).json({
            'status': 400,
            'message': 'request error',
            'data': 'do not exist header data'
        });
    }
})

router.post('/receiveFriendInvite', function (req, res) {
    if (req.headers && req.headers.authorization) {
        let friendId = req.headers.friendid;
        var status = req.headers.status;
        console.log("friend:", req.headers)
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded.UserID;
            // Fetch the user by id 
            User.findOne({ _id: userId }).then(function (user) {
                if (user == null) {
                    return res.status(400).json({
                        'status': 400,
                        'message': 'User error',
                        'data': 'do not exist user'
                    });
                } else {
                    if (status == "accept") {
                        let dIndex = -1
                        user.receivedUsers.map((item, key) => {
                            if (friendId == item._id) {
                                dIndex = key
                                var newBody1 = {}
                                newBody1._id = item._id
                                newBody1.displayname = item.displayname
                                newBody1.username = item.username
                                newBody1.email = item.email
                                newBody1.phoneNumber = item.phoneNumber
                                newBody1.flag = item.flag
                                newBody1.profileImage = item.profileImage
                                newBody1.gender = item.gender
                                newBody1.kid = item.kid
                                user.friendsIds.push(newBody1)
                            }
                        })
                        if (dIndex != -1) {
                            user.receivedUsers.splice(dIndex, 1);
                        }
                        user.save(() => {
                            User.findOne({ _id: friendId }).then(function (user2) {
                                if (user2 != null) {
                                    let dIndex = -1
                                    user2.requestedUsers.map((item, key) => {
                                        if (userId == item._id) {
                                            dIndex = key
                                            var newBody2 = {}
                                            newBody2._id = item._id
                                            newBody2.displayname = item.displayname
                                            newBody2.username = item.username
                                            newBody2.email = item.email
                                            newBody2.phoneNumber = item.phoneNumber
                                            newBody2.flag = item.flag
                                            newBody2.profileImage = item.profileImage
                                            newBody2.gender = item.gender
                                            newBody2.kid = item.kid
                                            user2.friendsIds.push(newBody2)
                                        }
                                    })
                                    if (dIndex != -1) {
                                        user2.requestedUsers.splice(dIndex, 1);
                                    }
                                    user2.save(() => {
                                        return res.status(200).json({
                                            'status': 200,
                                            'message': 'success',
                                            'data': user.friendsIds
                                        });
                                    });
                                }
                            });
                        });
                    } else {
                        let dIndex = -1
                        user.receivedUsers.map((item, key) => {
                            if (friendId == item._id) {
                                dIndex = key
                            }
                        });
                        if (dIndex != -1) {
                            user.receivedUsers.splice(dIndex, 1);
                        }
                        user.save(() => {
                            User.findOne({ _id: friendId }).then(function (user2) {
                                if (user2 != null) {
                                    let dIndex = -1
                                    user2.requestedUsers.map((item, key) => {
                                        if (userId == item._id) {
                                            dIndex = key
                                        }
                                    })
                                    if (dIndex != -1) {
                                        user2.requestedUsers.splice(dIndex, 1);
                                    }
                                    user2.save(() => {
                                        return res.status(200).json({
                                            'status': 200,
                                            'message': 'success',
                                            'data': user
                                        });
                                    });
                                }
                            });
                        });

                        // const index = user.requestedUsers.indexOf(friendId);
                        // if (index > -1) {
                        //     user.requestedUsers.splice(index, 1);
                        // }                        
                    }
                }
            });
        } catch (e) {
            return res.status(401).json({
                'status': 401,
                'message': 'token error',
                'data': 'token expired or incorrect token.'
            });
        }
    } else {
        return res.status(400).json({
            'status': 400,
            'message': 'request error',
            'data': 'do not exist header data'
        });
    }
})

router.delete('/delFriend', function (req, res) {
    if (req.headers && req.headers.authorization) {
        let friendId = req.headers.friendid;
        console.log("friend:", req.headers)
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded.UserID;
            // Fetch the user by id 
            User.findOne({ _id: userId }).then(function (user) {
                if (user == null) {
                    return res.status(400).json({
                        'status': 400,
                        'message': 'User error',
                        'data': 'do not exist user'
                    });
                } else {
                    let dIndex = -1
                    user.friendsIds.map((item, key) => {
                        if (friendId == item._id) {
                            dIndex = key
                            console.log("friend_dIndex:", dIndex)
                        }
                    });
                    if (dIndex != -1) {
                        user.friendsIds.splice(dIndex, 1);
                    }
                    user.save(() => {
                        User.findOne({ _id: friendId }).then(function (user2) {
                            if (user2 != null) {
                                let dIndex = -1
                                user2.friendsIds.map((item, key) => {
                                    if (userId == item._id) {
                                        dIndex = key
                                    }
                                })
                                if (dIndex != -1) {
                                    user2.friendsIds.splice(dIndex, 1);
                                }
                                user2.save(() => {
                                    return res.status(200).json({
                                        'status': 200,
                                        'message': 'success',
                                        'data': user.friendsIds
                                    });
                                });
                            }
                        });
                    });
                }
            });
        } catch (e) {
            return res.status(401).json({
                'status': 401,
                'message': 'token error',
                'data': 'token expired or incorrect token.'
            });
        }
    } else {
        return res.status(400).json({
            'status': 400,
            'message': 'request error',
            'data': 'do not exist header data'
        });
    }
})

// /**
//  * @swagger
//  * definitions:
//  *   Login:
//  *     required:
//  *       - email
//  *       - password
//  *     properties:
//  *       email:
//  *         type: string
//  *       password:
//  *         type: string
//  *       path:
//  *         type: string
//  */


module.exports = router;