var express = require('express');
var router = express.Router();
// const mongoose = require('mongoose');
const multer = require("multer");

// mongoose.connect('mongodb://127.0.0.1:27017/DashApp', { useNewUrlParser: true });
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully");
// })

let Challenges = require('../Model/mobile_challenges.model');


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

var upload_fileds = multer({ storage })
var cpUpload = upload_fileds.fields([{ name: 'challengeBGImage', maxCount: 100 }, { name: 'TypeImage', maxCount: 100 }])


/**
   * @swagger
   * tags:
   *   name: Mobile_Challenges
   *   description: Challenges management API
   */

//Profile Challenge database CRUD API//

/**
   * @swagger
   * /mobileapi/challengesapi:
   *   post:
   *     description: add Challenges API
   *     tags: [Mobile_Challenges]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: createdBy
   *         description: Challenges's createdBy.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: Challenges's title.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: description
   *         description: Challenges's description.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: accessType
   *         description: Challenges's accessType.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: allStep
   *         description: Challenges's allStep.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: scheduleDate
   *         description: Challenges's scheduleDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: typeDescription
   *         description: Challenges's typeDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: startDate
   *         description: Challenges's startDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Plan
   *         description: Challenges's Plan.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Version
   *         description: Challenges's Version.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Host
   *         description: Challenges's Host.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Featured
   *         description: Challenges's Featured.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: ActiveDate
   *         description: Challenges's ActiveDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: challengeBGImage
   *         description: Challenges's challengeBGImage.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: TypeImage
   *         description: Challenges's TypeImage.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/challengesapi', cpUpload, function (req, res) {
    console.log(req.body);
    var date = new Date();
    var inputDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getDay() 

    // const files = req.files
    // console.log("file name:", fileName);
    // console.log(req.files);
    if (req.body.createdBy != null && req.body.title != null && req.body.description != null) {
        let challenges = new Challenges(req.body);
        // req.body.launchImage = fileName;
        challenges.save()
            .then(todo => {
                let id = challenges._id
                console.log("req :", id)

                Challenges.findById(id, function (err, challenges) {
                    if (err) console.log("err ; ", err)
                    console.log("doc : ", challenges)
                    if (req.files['TypeImage']) { console.log("TypeImage :", req.files['TypeImage'][0], inputDate + "-" + req.files['TypeImage'][0].originalname); challenges.TypeImage = inputDate + "-" + req.files['TypeImage'][0].originalname; }
                    if (req.files['challengeBGImage']) { console.log("challengeBGImage :", req.files['challengeBGImage'][0], inputDate + "-" + req.files['challengeBGImage'][0].originalname); challenges.challengeBGImage = inputDate + "-" + req.files['challengeBGImage'][0].originalname; }

                    challenges.Version = (req.body.Version != null) ? req.body.Version : "null";
                    challenges.Featured = (req.body.Featured != null) ? req.body.Featured : "no";
                    challenges.Host = (req.body.Host != null) ? req.body.Host : "Dash";

                    challenges.myStep = (req.body.myStep != null) ? req.body.myStep : "0";
                    challenges.Plan = (req.body.Plan != null) ? req.body.Plan : "null";
                    challenges.status = (req.body.status != null) ? req.body.status : "start";
                    challenges.startDate = (req.body.startDate != null) ? req.body.startDate : inputDate;
                    challenges.scheduleDate = (req.body.scheduleDate != null) ? req.body.scheduleDate : "30";
                    challenges.ActiveDate = (req.body.ActiveDate != null) ? req.body.ActiveDate : inputDate;
                    challenges.category = (req.body.category != null) ? req.body.category : "Fitness";
                    challenges.TypeTitle = (req.body.TypeTitle != null) ? req.body.TypeTitle : "Fitness";
                    challenges.typeDescription = (req.body.typeDescription != null) ? req.body.typeDescription : "Fitness";
                    challenges.accessType = (req.body.accessType != null) ? req.body.accessType : "public";
                    challenges.signUps = 0;
                    challenges.leftChallenge = 0;
                    challenges.challengeView = 0;
                    // challenges.joinedUsers = "";
                    challenges.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': challenges
                        });
                    });
                });
            })
            .catch(err => {
                res.status(401).json({
                    'status': 401,
                    'message': 'Mychallenges added failed',
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
   * /mobileapi/challengesapiPager:
   *   post:
   *     description: edit Challenges API
   *     tags: [Mobile_Challenges]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: pageLength
   *         description: Challenges's pageLength.
   *         in: formData
   *         required: true
   *         type: number
   *       - name: pageNumber
   *         description: Challenges's pageNumber.
   *         in: formData
   *         required: false
   *         type: number
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/challengesapiPager', function (req, res) {
    if (req.body.pageLength != null && req.body.pageNumber != null) {
        Challenges.find(function (err, challenges) {
            console.log(challenges.username);
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'show failed',
                    'data': err
                });
                console.log("err->", err);
            } else {
                var Count = challenges.length;
                var pageNumber = req.body.pageNumber - 1;
                var pageLength = req.body.pageLength;
                let start = pageNumber * pageLength
                let end = pageNumber * pageLength + pageLength
                res.status(200).json({
                    'status': 200,
                    'message': 'success',
                    // 'data': mychallenges,
                    'data': challenges.slice(start, end),
                    'pagination': {
                        'pageLength': req.body.pageLength,
                        'pageNumber': req.body.pageNumber,
                        'totalNumbers': Count
                    }
                });
                console.log("err->", challenges);
            }
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
   * /mobileapi/challengesapi/{id}:
   *   get:
   *     description: show a Challenges database API with ID
   *     tags: [Mobile_Challenges]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Challenges's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/challengesapi/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    Challenges.findById(id, function (err, challenges) {
        // console.log(user.displayname);
        if (challenges == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            let id = challenges._id;
            Challenges.findById(id, function (err, challenges2) {
                if (challenges2 == null) {
                    res.status(401).json({
                        'status': 401,
                        'message': 'edit failed',
                        'data': 'do not exist this ID in database'
                    });
                    console.log("err->", err);
                } else {
                    challenges2.challengeView = eval(challenges2.challengeView) + 1;
                    challenges2.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': challenges2
                        });
                        console.log("err->", challenges2); 
                    })
                    .catch(err => {
                        res.status(403).json({
                            'status': 403,
                            'message': 'Mychallenges edit failed',
                            'data': 'flase'
                        });
                    });
                }
            }); 

            // res.status(200).json({
            //     'status': 200,
            //     'message': 'success',
            //     'data': challenges
            // });
        }
    });
});

/**
* @swagger
* /mobileapi/challengesapi:
*  get:
*      description: Use to request all challenges
*      tags: [Mobile_Challenges]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/challengesapi', function (req, res) {
    Challenges.find(function (err, challenges) {
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
                'data': challenges
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/challengesapi/{id}:
   *   delete:
   *     description: delete a Challenges database API with ID
   *     tags: [Mobile_Challenges]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Challenges's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/challengesapi/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        Challenges.deleteOne({ _id: id }, function (err, challenges) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                Challenges.find(function (err2, challenges2) {
                    console.log(challenges2.createdBy);
                    if (err2) {
                        res.status(403).json({
                            'status': 403,
                            'message': 'Mychallenges delete failed',
                            'data': 'false'
                        });
                        console.log("err->", err2);
                    } else {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': challenges2
                        });
                        console.log("err->", challenges2);
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
   * /mobileapi/challengesapi:
   *   patch:
   *     description: edit Challenges API
   *     tags: [Mobile_Challenges]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Challenges's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: createdBy
   *         description: Challenges's createdBy.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: title
   *         description: Challenges's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: accessType
   *         description: Challenges's accessType.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: description
   *         description: Challenges's description.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: allStep
   *         description: Challenges's allStep.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: scheduleDate
   *         description: Challenges's scheduleDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: typeDescription
   *         description: Challenges's typeDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: startDate
   *         description: Challenges's startDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: joinedUsers
   *         description: Challenges's joinedUsers.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Plan
   *         description: Challenges's Plan.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Version
   *         description: Challenges's Version.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Host
   *         description: Challenges's Host.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Featured
   *         description: Challenges's Featured.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: ActiveDate
   *         description: Challenges's ActiveDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: status
   *         description: Challenges's status.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: signUps
   *         description: Challenges's signUps.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: leftChallenge
   *         description: Challenges's leftChallenge.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: challengeView
   *         description: Challenges's challengeView.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: challengeBGImage
   *         description: Challenges's challengeBGImage.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: TypeImage
   *         description: Challenges's TypeImage.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/challengesapi', cpUpload, function (req, res) {
    if (req.body.editID != null) {
        // const files = req.files
        let id = req.body.editID
        console.log("req :", id)
        Challenges.findById(id, function (err, challenges) {
            if (challenges == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", challenges)
                // 5eb8a60152360442897d08e
                // (age < 18) ? "Too young":"Old enough";
                challenges.createdBy = (req.body.createdBy != null) ? req.body.createdBy : challenges.createdBy;
                challenges.title = (req.body.title != null) ? req.body.title : challenges.title;
                challenges.Plan = (req.body.Plan != null) ? req.body.Plan : challenges.Plan;
                challenges.Version = (req.body.Version != null) ? req.body.Version : "null";
                challenges.Featured = (req.body.Featured != null) ? req.body.Featured : false;
                challenges.Host = (req.body.Host != null) ? req.body.Host : "Dash";
                challenges.accessType = (req.body.accessType != null) ? req.body.accessType : challenges.accessType;
                challenges.description = (req.body.description != null) ? req.body.description : challenges.description;
                challenges.allStep = (req.body.allStep != null) ? req.body.allStep : challenges.allStep;
                challenges.scheduleDate = (req.body.scheduleDate != null) ? req.body.scheduleDate : challenges.scheduleDate;
                challenges.typeDescription = (req.body.typeDescription != null) ? req.body.typeDescription : challenges.typeDescription;
                challenges.startDate = (req.body.startDate != null) ? req.body.startDate : challenges.startDate;
                challenges.ActiveDate = (req.body.ActiveDate != null) ? req.body.ActiveDate :  challenges.ActiveDate;
                challenges.myStep = (req.body.myStep != null) ? req.body.myStep : challenges.myStep;
                challenges.status = (req.body.status != null) ? req.body.status : challenges.status;
                challenges.category = (req.body.category != null) ? req.body.category : challenges.category;
                challenges.TypeTitle = (req.body.TypeTitle != null) ? req.body.TypeTitle : challenges.TypeTitle;
                
                challenges.signUps = (req.body.signUps != null) ? req.body.signUps : challenges.signUps;
                challenges.leftChallenge = (req.body.leftChallenge != null) ? req.body.leftChallenge : challenges.leftChallenge;
                challenges.challengeView = (req.body.challengeView != null) ? req.body.challengeView : challenges.challengeView;

                if (req.files['TypeImage']) { console.log("TypeImage :", req.files['TypeImage'][0], inputDate + "-" + req.files['TypeImage'][0].originalname); challenges.TypeImage = inputDate + "-" + req.files['TypeImage'][0].originalname; }
                if (req.files['challengeBGImage']) { console.log("challengeBGImage :", req.files['challengeBGImage'][0], inputDate + "-" + req.files['challengeBGImage'][0].originalname); challenges.challengeBGImage = inputDate + "-" + req.files['challengeBGImage'][0].originalname; }

                if (req.body.joinedUsers != null) {
                    challenges.joinedUsers.push(req.body.joinedUsers)
                }
                challenges.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': challenges
                        });
                        console.log("err->", challenges);
                        fileName = null
                    })
                    .catch(err => {
                        res.status(403).json({
                            'status': 403,
                            'message': 'Mychallenges edit failed',
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



module.exports = router;
