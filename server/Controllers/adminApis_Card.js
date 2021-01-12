var express = require('express');
var router = express.Router();
const multer = require("multer");

let Card = require('../Model/admin_card.model');


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

const upload = multer({ storage });

var upload_fileds = multer({ storage })
// var upload_fileds = multer({ dest: './client/build/static/media/' })
var cpUpload = upload_fileds.fields(
    [
        { name: 'BaseThumbnail', maxCount: 100 },
        { name: 'BaseVideo', maxCount: 100 },
        { name: 'BaseAudio', maxCount: 100 },
        { name: 'EasierVideo', maxCount: 100 },
        { name: 'EasierAudio', maxCount: 100 },
        { name: 'HardVideo', maxCount: 100 },
        { name: 'HardAudio', maxCount: 100 }
    ]
)
// var upload = multer({ storage: storage })
// const upload = multer(
//     {
//         storage: storage,
//         limits:
//         {
//             fileSize: 1024 * 1024 * 5000
//         }
//     });

/**
   * @swagger
   * tags:
   *   name: AdminPanel_Cards
   *   description: Card management API
   */


//my Card API//
/**
   * @swagger
   * /adminapi/cardapi:
   *   post:
   *     description: add admin Card API
   *     tags: [AdminPanel_Cards]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: title
   *         description: admin Card's title.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: cardCount
   *         description: admin Card's cardCount.
   *         in: formData
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/cardapi', upload.single('picture'), function (req, res) {
    if (req.body.title != null) {
        let card = new Card(req.body);
        card.save()
            .then(todo => {
                let id = card._id
                Card.findById(id, function (err, card2) {
                    card2.cardCount = (req.body.cardCount) ? req.body.cardCount : "0";
                    card2.status = (req.body.status) ? req.body.status : "current";
                    card2.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': card2
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
* /adminapi/cardapi:
*  get:
*      description: Use to request all card
*      tags: [AdminPanel_Cards]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/cardapi', function (req, res) {
    Card.find(function (err, card) {
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
                'data': card
            });
        }
    });
});

/**
   * @swagger
   * /adminapi/cardapi/{id}:
   *   get:
   *     description: show a Card database API with ID
   *     tags: [AdminPanel_Cards]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Card's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/cardapi/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    Card.findById(id, function (err, card) {
        // console.log(user.displayname);
        if (card == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': card
            });
        }
    });
});

/**
   * @swagger
   * /adminapi/cardapi/{id}:
   *   delete:
   *     description: delete a Card database API with ID
   *     tags: [AdminPanel_Cards]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Card's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/cardapi/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        Card.deleteOne({ _id: id }, function (err, card) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                Card.find(function (err2, card2) {
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
                            'data': card2
                        });
                        console.log("err->", card2);
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
   * /adminapi/cardapi:
   *   patch:
   *     description: edit Card API
   *     tags: [AdminPanel_Cards]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Card's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: Card's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: status
   *         description: Card's status.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: cardCount
   *         description: Card's cardCount.
   *         in: formData
   *         required: false
   *         type: string 
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/cardapi', upload.single('picture'), function (req, res) {
    if (req.body.editID != null) {
        let id = req.body.editID
        console.log("req :", id)
        Card.findById(id, function (err, card) {
            if (card == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", card)
                card.title = (req.body.title != null) ? req.body.title : card.title;
                card.cardCount = (req.body.cardCount != null) ? req.body.cardCount : card.cardCount;
                card.status = (req.body.status != null) ? req.body.status : card.status;
                card.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': card
                        });
                        console.log("err->", card);
                        // fileName = null
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
   * /adminapi/addCardExerciseData:
   *   post:
   *     description: add Card Exercise API
   *     tags: [AdminPanel_Cards]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Card's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: exerciseName
   *         description: Card's exerciseName
   *         in: formData
   *         required: true
   *         type: string
   *       - name: exerciseDescription
   *         description: Post's exerciseDescription.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: exerciseTag
   *         description: Post's exerciseTag.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: audioTag
   *         description: Post's audioTag.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: BaseThumbnail
   *         description: Post's BaseThumbnail.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: BaseAudio
   *         description: Post's BaseAudio.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: BaseVideo
   *         description: Post's BaseVideo.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: EasierExerciseName
   *         description: Card's EasierExerciseName
   *         in: formData
   *         required: false
   *         type: string
   *       - name: EasierExerciseDescription
   *         description: Post's EasierExerciseDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: EasierVideo
   *         description: Post's EasierVideo.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: EasierAudio
   *         description: Post's EasierAudio.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: HardExerciseName
   *         description: Card's HardExerciseName
   *         in: formData
   *         required: false
   *         type: string
   *       - name: HardExerciseDescription
   *         description: Post's HardExerciseDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: HardVideo
   *         description: Post's HardVideo.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: HardAudio
   *         description: Post's HardAudio.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addCardExerciseData', cpUpload, function (req, res) {
    if (req.body.editID != null && req.body.exerciseName != null && req.body.exerciseDescription != null) {
        let id = req.body.editID
        console.log("req :", req.body)
        var date = new Date();
        Card.findById(id, function (err, card) {
            if (card == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                const exerciseName = req.body.exerciseName
                const exerciseDescription = req.body.exerciseDescription
                const exerciseTag = req.body.exerciseTag
                const audioTag = (req.body.audioTag) ? req.body.audioTag : "false";
                const EasierExerciseName = (req.body.EasierExerciseName) ? req.body.EasierExerciseName : "N/A";
                const EasierExerciseDescription = (req.body.EasierExerciseDescription) ? req.body.EasierExerciseDescription : "N/A";
                const HardExerciseName = (req.body.HardExerciseName) ? req.body.HardExerciseName : "N/A";
                const HardExerciseDescription = (req.body.HardExerciseDescription) ? req.body.HardExerciseDescription : "N/A";
                inputDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getDay() + "-" + date.getHours() + "-" + date.getMinutes()
                if (Array.isArray(exerciseName)) {
                    for (var i = 0; i < exerciseName.length; i++) {
                        var newBody = {}
                        newBody.id = "card" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                        newBody.exerciseName = exerciseName[i]
                        newBody.exerciseDescription = exerciseDescription[i]
                        newBody.exerciseTag = exerciseTag[i]
                        newBody.audioTag = audioTag[i]
                        newBody.EasierExerciseName = EasierExerciseName[i]
                        newBody.EasierExerciseDescription = EasierExerciseDescription[i]
                        newBody.HardExerciseName = HardExerciseName[i]
                        newBody.HardExerciseDescription = HardExerciseDescription[i]
                        if (req.files['BaseThumbnail'][i]) { console.log("BaseThumbnail :", req.files['BaseThumbnail'][i], inputDate + "-" + req.files['BaseThumbnail'][i].originalname); newBody.BaseThumbnail_fileName = inputDate + "-" + req.files['BaseThumbnail'][i].originalname; }
                        if (req.files['BaseVideo'][i]) { console.log("BaseVideo :", req.files['BaseVideo'][i], inputDate + "-" + req.files['BaseVideo'][i].originalname); newBody.BaseVideo_fileName = inputDate + "-" + req.files['BaseVideo'][i].originalname; }
                        if (req.files['BaseAudio'][i]) { console.log("BaseAudio :", req.files['BaseAudio'][i], inputDate + "-" + req.files['BaseAudio'][i].originalname); newBody.BaseAudio_fileName = inputDate + "-" + req.files['BaseAudio'][i].originalname; }
                        if (req.files['EasierVideo'][i]) { console.log("EasierVideo :", req.files['EasierVideo'][i], inputDate + "-" + req.files['EasierVideo'][i].originalname); newBody.EasierVideo_fileName = inputDate + "-" + req.files['EasierVideo'][i].originalname; }
                        if (req.files['EasierAudio'][i]) { console.log("EasierAudio :", req.files['EasierAudio'][i], inputDate + "-" + req.files['EasierAudio'][i].originalname); newBody.EasierAudio_fileName = inputDate + "-" + req.files['EasierAudio'][i].originalname; }
                        if (req.files['HardVideo'][i]) { console.log("HardVideo :", req.files['HardVideo'][i], inputDate + "-" + req.files['HardVideo'][i].originalname); newBody.HardVideo_fileName = inputDate + "-" + req.files['HardVideo'][i].originalname; }
                        if (req.files['HardAudio'][i]) { console.log("HardAudio :", req.files['HardAudio'][i], inputDate + "-" + req.files['HardAudio'][i].originalname); newBody.HardAudio_fileName = inputDate + "-" + req.files['HardAudio'][i].originalname; }
                        card.exercisesData.push(newBody)
                        card.save()
                            .then(todo => {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': card
                                });
                            })
                            .catch(err => {
                                res.status(402).json({
                                    'status': 402,
                                    'message': 'edit failed',
                                    'data': 'flase'
                                });
                            });
                    }
                } else {
                    var newBody = {}
                    newBody.id = "card" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                    newBody.exerciseName = exerciseName
                    newBody.exerciseDescription = exerciseDescription
                    newBody.exerciseTag = exerciseTag
                    newBody.audioTag = audioTag
                    newBody.EasierExerciseName = EasierExerciseName
                    newBody.EasierExerciseDescription = EasierExerciseDescription
                    newBody.HardExerciseName = HardExerciseName
                    newBody.HardExerciseDescription = HardExerciseDescription
                    if (req.files['BaseThumbnail']) { console.log("BaseThumbnail :", req.files['BaseThumbnail'][0], inputDate + "-" + req.files['BaseThumbnail'][0].originalname); newBody.BaseThumbnail_fileName = inputDate + "-" + req.files['BaseThumbnail'][0].originalname; }
                    if (req.files['BaseVideo']) { console.log("BaseVideo :", req.files['BaseVideo'][0], inputDate + "-" + req.files['BaseVideo'][0].originalname); newBody.BaseVideo_fileName = inputDate + "-" + req.files['BaseVideo'][0].originalname; }
                    if (req.files['BaseAudio']) { console.log("BaseAudio :", req.files['BaseAudio'][0], inputDate + "-" + req.files['BaseAudio'][0].originalname); newBody.BaseAudio_fileName = inputDate + "-" + req.files['BaseAudio'][0].originalname; }
                    if (req.files['EasierVideo']) { console.log("EasierVideo :", req.files['EasierVideo'][0], inputDate + "-" + req.files['EasierVideo'][0].originalname); newBody.EasierVideo_fileName = inputDate + "-" + req.files['EasierVideo'][0].originalname; }
                    if (req.files['EasierAudio']) { console.log("EasierAudio :", req.files['EasierAudio'][0], inputDate + "-" + req.files['EasierAudio'][0].originalname); newBody.EasierAudio_fileName = inputDate + "-" + req.files['EasierAudio'][0].originalname; }
                    if (req.files['HardVideo']) { console.log("HardVideo :", req.files['HardVideo'][0], inputDate + "-" + req.files['HardVideo'][0].originalname); newBody.HardVideo_fileName = inputDate + "-" + req.files['HardVideo'][0].originalname; }
                    if (req.files['HardAudio']) { console.log("HardAudio :", req.files['HardAudio'][0], inputDate + "-" + req.files['HardAudio'][0].originalname); newBody.HardAudio_fileName = inputDate + "-" + req.files['HardAudio'][0].originalname; }
                    card.exercisesData.push(newBody)
                    card.save()
                        .then(todo => {
                            res.status(200).json({
                                'status': 200,
                                'message': 'success',
                                'data': card
                            });
                        })
                        .catch(err => {
                            res.status(402).json({
                                'status': 402,
                                'message': 'edit failed',
                                'data': 'flase'
                            });
                        });
                }
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'please input editID or all commit data',
            'data': 'flase'
        });
    }
});


/**
   * @swagger
   * /adminapi/addCardExerciseData:
   *   patch:
   *     description: edit Card API
   *     tags: [AdminPanel_Cards]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editCardID
   *         description: Card's editCardID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: editCardExerciseID
   *         description: Card's editCardExerciseID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: exerciseName
   *         description: Card's exerciseName
   *         in: formData
   *         required: false
   *         type: string
   *       - name: exerciseDescription
   *         description: Post's exerciseDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: exerciseTag
   *         description: Post's exerciseTag.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: audioTag
   *         description: Post's audioTag.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: BaseThumbnail
   *         description: Post's BaseThumbnail.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: BaseAudio
   *         description: Post's BaseAudio.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: BaseVideo
   *         description: Post's BaseVideo.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: EasierExerciseName
   *         description: Card's EasierExerciseName
   *         in: formData
   *         required: false
   *         type: string
   *       - name: EasierExerciseDescription
   *         description: Post's EasierExerciseDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: EasierVideo
   *         description: Post's EasierVideo.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: EasierAudio
   *         description: Post's EasierAudio.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: HardExerciseName
   *         description: Card's HardExerciseName
   *         in: formData
   *         required: false
   *         type: string
   *       - name: HardExerciseDescription
   *         description: Post's HardExerciseDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: HardVideo
   *         description: Post's HardVideo.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: HardAudio
   *         description: Post's HardAudio.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/addCardExerciseData', cpUpload, function (req, res) {
    if (req.body.editCardID != null && req.body.editCardExerciseID != null) {
        let id = req.body.editCardID
        let editCardExerciseID = req.body.editCardExerciseID
        var date = new Date();
        console.log("req :", id)

        Card.findById(id, function (err, card) {
            if (card == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'do not exist this Card ID in database',
                    'data': 'flase'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", card)

                let dIndex = -1
                card.exercisesData.map((item, key) => {
                    if (editCardExerciseID == item.id) {
                        dIndex = key
                    }
                });

                if (dIndex != -1) {
                    const exerciseName = (req.body.exerciseName) ? req.body.exerciseName : card.exercisesData[dIndex].exerciseName;
                    const exerciseDescription = (req.body.exerciseDescription) ? req.body.exerciseDescription : card.exercisesData[dIndex].exerciseDescription
                    const exerciseTag = (req.body.exerciseTag) ? req.body.exerciseTag : card.exercisesData[dIndex].exerciseTag
                    const audioTag = (req.body.audioTag) ? req.body.audioTag : card.exercisesData[dIndex].audioTag
                    const EasierExerciseName = (req.body.EasierExerciseName) ? req.body.EasierExerciseName : card.exercisesData[dIndex].EasierExerciseName
                    const EasierExerciseDescription = (req.body.EasierExerciseDescription) ? req.body.EasierExerciseDescription : card.exercisesData[dIndex].EasierExerciseDescription
                    const HardExerciseName = (req.body.HardExerciseName) ? req.body.HardExerciseName : card.exercisesData[dIndex].HardExerciseName
                    const HardExerciseDescription = (req.body.HardExerciseDescription) ? req.body.HardExerciseDescription : card.exercisesData[dIndex].HardExerciseDescription

                    console.log("card.exercisesData[editCardExerciseID]:", card.exercisesData[0])
                    var newBody = {}
                    newBody.id =  "card" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                    newBody.exerciseName = exerciseName
                    newBody.exerciseDescription = exerciseDescription
                    newBody.exerciseTag = exerciseTag
                    newBody.audioTag = audioTag
                    newBody.EasierExerciseName = EasierExerciseName
                    newBody.EasierExerciseDescription = EasierExerciseDescription
                    newBody.HardExerciseName = HardExerciseName
                    newBody.HardExerciseDescription = HardExerciseDescription
                    if (req.files['BaseThumbnail']) {
                        console.log("BaseThumbnail :", req.files['BaseThumbnail'][0], inputDate + "-" + req.files['BaseThumbnail'][0].originalname);
                        newBody.BaseThumbnail_fileName = inputDate + "-" + req.files['BaseThumbnail'][0].originalname;
                    } else {
                        newBody.BaseThumbnail_fileName = card.exercisesData[dIndex].BaseThumbnail_fileName
                    }
                    if (req.files['BaseVideo']) {
                        console.log("BaseVideo :", req.files['BaseVideo'][0], inputDate + "-" + req.files['BaseVideo'][0].originalname);
                        newBody.BaseVideo_fileName = inputDate + "-" + req.files['BaseVideo'][0].originalname;
                    } else {
                        newBody.BaseVideo_fileName = card.exercisesData[dIndex].BaseVideo_fileName
                    }
                    if (req.files['BaseAudio']) {
                        console.log("BaseAudio :", req.files['BaseAudio'][0], inputDate + "-" + req.files['BaseAudio'][0].originalname);
                        newBody.BaseAudio_fileName = inputDate + "-" + req.files['BaseAudio'][0].originalname;
                    } else {
                        newBody.BaseAudio_fileName = card.exercisesData[dIndex].BaseAudio_fileName
                    }
                    if (req.files['EasierVideo']) {
                        console.log("EasierVideo :", req.files['EasierVideo'][0], inputDate + "-" + req.files['EasierVideo'][0].originalname);
                        newBody.EasierVideo_fileName = inputDate + "-" + req.files['EasierVideo'][0].originalname;
                    } else {
                        newBody.EasierVideo_fileName = card.exercisesData[dIndex].EasierVideo_fileName
                    }
                    if (req.files['EasierAudio']) {
                        console.log("EasierAudio :", req.files['EasierAudio'][0], inputDate + "-" + req.files['EasierAudio'][0].originalname);
                        newBody.EasierAudio_fileName = inputDate + "-" + req.files['EasierAudio'][0].originalname;
                    } else {
                        newBody.EasierAudio_fileName = card.exercisesData[dIndex].EasierAudio_fileName
                    }
                    if (req.files['HardVideo']) {
                        console.log("HardVideo :", req.files['HardVideo'][0], inputDate + "-" + req.files['HardVideo'][0].originalname);
                        newBody.HardVideo_fileName = inputDate + "-" + req.files['HardVideo'][0].originalname;
                    } else {
                        newBody.HardVideo_fileName = card.exercisesData[dIndex].HardVideo_fileName
                    }
                    if (req.files['HardAudio']) {
                        console.log("HardAudio :", req.files['HardAudio'][0], inputDate + "-" + req.files['HardAudio'][0].originalname);
                        newBody.HardAudio_fileName = inputDate + "-" + req.files['HardAudio'][0].originalname;
                    } else {
                        newBody.HardAudio_fileName = card.exercisesData[dIndex].HardAudio_fileName
                    }

                    card.exercisesData.push(newBody);

                    card.exercisesData.splice(dIndex, 1);

                    card.save()
                        .then(todo => {
                            res.status(200).json({
                                'status': 200,
                                'message': 'success',
                                'data': card
                            });
                            console.log("err->", card);
                            // fileName = null
                        })
                        .catch(err => {
                            res.status(403).json({
                                'status': 403,
                                'message': 'edit failed',
                                'data': 'flase'
                            });
                        });
                } else {
                    res.status(401).json({
                        'status': 401,
                        'message': 'do not exist this cardExercise  ID in database',
                        'data': 'flase'
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
   * /adminapi/delCardExerciseData:
   *   delete:
   *     description: delete Card Exercise API
   *     tags: [AdminPanel_Cards]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Card's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: delexercisesDataID
   *         description: Card's delexercisesDataID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/delCardExerciseData', function (req, res) {
    if (req.body.delexercisesDataID != null && req.body.editID != null) {
        let editID = req.body.editID;
        let delexercisesDataID = req.body.delexercisesDataID;
        Card.findOne({ _id: editID }).then(function (card) {
            if (card == null) {
                return res.status(401).json({
                    'status': 401,
                    'message': 'Post error',
                    'data': 'do not exist Post'
                });
            } else {
                let dIndex = -1
                card.exercisesData.map((item, key) => {
                    if (delexercisesDataID == item.id) {
                        dIndex = key
                        console.log("Commit_dIndex:", dIndex)
                    }
                });
                if (dIndex != -1) {
                    card.exercisesData.splice(dIndex, 1);
                }
                card.save(() => {
                    return res.status(200).json({
                        'status': 200,
                        'message': 'success',
                        'data': card
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
