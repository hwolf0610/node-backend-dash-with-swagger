var express = require('express');
var router = express.Router();
// const mongoose = require('mongoose');
const multer = require("multer");

// mongoose.connect('mongodb://127.0.0.1:27017/DashApp', { useNewUrlParser: true });
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully");
// })

let User = require('../Model/mobile_User.model');
let Workout = require('../Model/mobile_workout.model');


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
   *   name: Mobile_Workouts
   *   description: Workout management API
   */

//workout API//
/**
   * @swagger
   * /mobileapi/workoutapi:
   *   post:
   *     description: add Workout API
   *     tags: [Mobile_Workouts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: title
   *         description: Workout's title.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: description
   *         description: Workout's description.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: AdsStatus
   *         description: Workout's AdsStatus.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: Workout's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/workoutapi', upload.array('picture', 12), function (req, res) {
    const files = req.files
    if (req.body.title != null && req.body.description != null) {
        let workout = new Workout(req.body);
        workout.save()
            .then(todo => {
                let id = workout._id
                Workout.findById(id, function (err, workout2) {
                    if (files.length > 0) {
                        workout2.postImage = (files[0].filename != null) ? files[0].filename : null;
                        // if (files[1] != null) {
                        //     workout2.workoutTypeImage.push(files[1].filename)
                        // }
                        // if (files[2] != null) {
                        //     workout2.workoutTypelunchFile.push(files[2].filename)
                        // }
                    }
                    workout2.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': workout2
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
* /mobileapi/workoutapi:
*  get:
*      description: Use to request all workout
*      tags: [Mobile_Workouts]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/workoutapi', function (req, res) {
    Workout.find(function (err, workout) {
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
                'data': workout
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/workoutapi/{id}:
   *   get:
   *     description: show a Workout database API with ID
   *     tags: [Mobile_Workouts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Workout's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/workoutapi/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    Workout.findById(id, function (err, workout) {
        // console.log(user.displayname);
        if (workout == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': workout
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/workoutapi/{id}:
   *   delete:
   *     description: delete a Workout database API with ID
   *     tags: [Mobile_Workouts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Workout's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/workoutapi/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        Workout.deleteOne({ _id: id }, function (err, workout) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                Workout.find(function (err2, workout2) {
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
                            'data': workout2
                        });
                        console.log("err->", workout2);
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
   * /mobileapi/workoutapi:
   *   patch:
   *     description: add Workout API
   *     tags: [Mobile_Workouts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Workout's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: Workout's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: description
   *         description: Workout's description.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: AdsStatus
   *         description: Workout's AdsStatus.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: Workout's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/workoutapi', upload.array('picture', 12), function (req, res) {
    if (req.body.editID != null) {
        const files = req.files
        let id = req.body.editID
        console.log("req :", id)
        Workout.findById(id, function (err, workout) {
            if (workout == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", workout)
                if (files.length > 0) {
                    workout.postImage = (files[0].filename != null) ? files[0].filename : workout.postImage;
                }
                workout.title = (req.body.title != null) ? req.body.title : workout.title;
                workout.description = (req.body.description != null) ? req.body.description : workout.description;
                workout.AdsStatus = (req.body.AdsStatus != null) ? req.body.AdsStatus : workout.AdsStatus;
                workout.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': workout
                        });
                        console.log("err->", workout);
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
   * /mobileapi/addWorkoutType:
   *   post:
   *     description: add Workout Type API
   *     tags: [Mobile_Workouts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Workout's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: workoutIds
   *         description: Workout's User ID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: workoutType
   *         description: Workout's workoutType.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: workoutTypeVisible
   *         description: Workout's workoutTypeVisible.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: workoutTypeTitle
   *         description: Workout's workoutTypeTitle.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: workoutTypeStepDetail
   *         description: Workout's workoutTypeStepDetail.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: workoutTypeDetail
   *         description: Workout's workoutTypeDetail.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: workoutTypeGrowLevel
   *         description: Workout's workoutTypeGrowLevel.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: creatorDate
   *         description: Workout's creatorDate.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: picture
   *         description: Workout's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addWorkoutType', upload.array('picture', 12), function (req, res) {
    if (req.body.editID != null && req.body.workoutIds != null && req.body.workoutType != null && req.body.workoutTypeVisible != null && req.body.workoutTypeTitle && req.body.workoutTypeStepDetail != null && req.body.workoutTypeDetail != null && req.body.workoutTypeGrowLevel != null && req.body.creatorDate) {
        var files;
        var date = new Date();
        if (req.files != null) {
            files = req.files
        }
        let id = req.body.editID
        console.log("req :", id)
        Workout.findById(id, function (err, workout) {
            if (workout == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", workout)
                const workoutIds = req.body.workoutIds
                const workoutType = req.body.workoutType
                const workoutTypeVisible = req.body.workoutTypeVisible
                const workoutTypeTitle = req.body.workoutTypeTitle
                const workoutTypeStepDetail = req.body.workoutTypeStepDetail
                const workoutTypeDetail = req.body.workoutTypeDetail
                const workoutTypeGrowLevel = req.body.workoutTypeGrowLevel
                const creatorDate = req.body.creatorDate
                if (Array.isArray(workoutIds)) {
                    for (var i = 0; i < workoutIds.length; i++) {
                        User.findById(workoutIds[i], function (err, user) {
                            if (user != null) {
                                var newBody = {}
                                newBody.id = "workout" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                                newBody.workoutUserIds = workoutIds[i]
                                newBody.commitUsername = user.username
                                newBody.commitUserAvata = user.profileImage
                                newBody.workoutType = workoutType[i]
                                newBody.workoutTypeVisible = workoutTypeVisible[i]
                                newBody.workoutTypeTitle = workoutTypeTitle[i]
                                newBody.workoutTypeStepDetail = workoutTypeStepDetail[i]
                                newBody.workoutTypeDetail = workoutTypeDetail[i]
                                newBody.workoutTypeGrowLevel = workoutTypeGrowLevel[i]
                                newBody.creatorDate = creatorDate[i]
                                if (req.files != null && files.length > i) {
                                    newBody.workoutTypeImage = files[i].filename
                                }
                                workout.WorkoutTypeData.push(newBody)
                                workout.save()
                                    .then(todo => {
                                        res.status(200).json({
                                            'status': 200,
                                            'message': 'success',
                                            'data': workout
                                        });
                                        console.log("err->", workout);
                                        fileName = null
                                    })
                                    .catch(err => {
                                        res.status(402).json({
                                            'status': 402,
                                            'message': 'edit failed',
                                            'data': 'flase'
                                        });
                                    });
                            } else {
                                res.status(403).json({
                                    'status': 403,
                                    'message': 'do not exist UserID',
                                    'data': 'flase'
                                });
                            }
                        });
                    }
                } else {
                    User.findById(workoutIds, function (err, user) {
                        if (user != null) {
                            var newBody = {}
                            newBody.id = "workout" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.workoutUserIds = workoutIds
                            newBody.commitUsername = user.username
                            newBody.commitUserAvata = user.profileImage
                            newBody.workoutType = workoutType
                            newBody.workoutTypeVisible = workoutTypeVisible
                            newBody.workoutTypeTitle = workoutTypeTitle
                            newBody.workoutTypeStepDetail = workoutTypeStepDetail
                            newBody.workoutTypeDetail = workoutTypeDetail
                            newBody.workoutTypeGrowLevel = workoutTypeGrowLevel
                            newBody.creatorDate = creatorDate
                            if (req.files != null && files.length > 0) {
                                newBody.workoutTypeImage = files[0].filename
                            }
                            workout.WorkoutTypeData.push(newBody)
                            workout.save()
                                .then(todo => {
                                    res.status(200).json({
                                        'status': 200,
                                        'message': 'success',
                                        'data': workout
                                    });
                                    console.log("err->", workout);
                                    fileName = null
                                })
                                .catch(err => {
                                    res.status(402).json({
                                        'status': 402,
                                        'message': 'edit failed',
                                        'data': 'flase'
                                    });
                                });
                        } else {
                            res.status(403).json({
                                'status': 403,
                                'message': 'do not exist UserID',
                                'data': 'flase'
                            });
                        }
                    });
                }
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
   * /mobileapi/delWorkoutType:
   *   delete:
   *     description: delete Workout commit API
   *     tags: [Mobile_Workouts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editWorkoutID
   *         description: Workout's editWorkoutID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: delWorkoutTypeID
   *         description: Workout's delWorkoutTypeID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/delWorkoutType', function (req, res) {
    if (req.body.delWorkoutTypeID != null && req.body.editWorkoutID != null) {
        let editWorkoutID = req.body.editWorkoutID;
        let delWorkoutTypeID = req.body.delWorkoutTypeID;
        Workout.findOne({ _id: editWorkoutID }).then(function (workout) {
            if (workout == null) {
                return res.status(401).json({
                    'status': 401,
                    'message': 'Post error',
                    'data': 'do not exist Post'
                });
            } else {
                let dIndex = -1
                workout.WorkoutTypeData.map((item, key) => {
                    if (delWorkoutTypeID == item.id) {
                        dIndex = key
                        console.log("Commit_dIndex:", dIndex)
                    }
                });
                if (dIndex != -1) {
                    workout.WorkoutTypeData.splice(dIndex, 1);
                }
                workout.save(() => {
                    return res.status(200).json({
                        'status': 200,
                        'message': 'success',
                        'data': workout
                    });
                });
            }
        });
    } else {
        return res.status(400).json({
            'status': 400,
            'message': 'request error',
            'data': 'do not exist delCommitID'
        });
    }
})


module.exports = router;
