var express = require('express');
var router = express.Router();
const multer = require("multer");

let Plan = require('../Model/admin_plan.model');
let PlanVersion = require('../Model/admin_plan_version.model');


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
    }
})

const upload = multer({ storage });

var upload_fileds = multer({ storage })
var cpUpload = upload_fileds.fields([{ name: 'picture', maxCount: 100 }, { name: 'video', maxCount: 100 }])

/**
   * @swagger
   * tags:
   *   name: AdminPanel_Plans
   *   description: Plan management API
   */


//my Plan API//
/**
   * @swagger
   * /adminapi/planapi:
   *   post:
   *     description: add admin Plan API
   *     tags: [AdminPanel_Plans]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: createdBy
   *         description: admin Plan's createdBy.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: admin Plan's title.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: description
   *         description: admin Plan's description.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: host
   *         description: admin Plan's host.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: totalCreations
   *         description: admin Plan's totalCreations.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: status
   *         description: admin Plan's status.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: public
   *         description: admin Plan's public.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: admin Plan's Image.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: video
   *         description: admin Plan's Video.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/planapi', cpUpload, function (req, res) {
    if (req.body.createdBy != null && req.body.title != null) {
        let plan = new Plan(req.body);
        plan.save()
            .then(todo => {
                let id = plan._id
                Plan.findById(id, function (err, plan2) {
                    if (req.files['picture']) {
                        console.log("picture :", req.files['picture'][0], inputDate + "-" + req.files['picture'][0].originalname);
                        plan2.planImage = inputDate + "-" + req.files['picture'][0].originalname;
                    }
                    if (req.files['video']) {
                        console.log("video :", req.files['video'][0], inputDate + "-" + req.files['video'][0].originalname);
                        plan2.planVideo = inputDate + "-" + req.files['video'][0].originalname;
                    }
                    plan2.status = (req.body.status) ? req.body.status : "current";
                    plan2.public = (req.body.public) ? req.body.public : "yes";
                    plan2.host = (req.body.host) ? req.body.host : "Dash";
                    plan2.totalCreations = (req.body.totalCreations) ? req.body.totalCreations : "0";
                    plan2.description = (req.body.description) ? req.body.description : "---";
                    plan2.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': plan2
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
* /adminapi/planapi:
*  get:
*      description: Use to request all plan
*      tags: [AdminPanel_Plans]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/planapi', function (req, res) {
    Plan.find(function (err, plan) {
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
                'data': plan
            });
        }
    });
});

/**
   * @swagger
   * /adminapi/planapi/{id}:
   *   get:
   *     description: show a Plan database API with ID
   *     tags: [AdminPanel_Plans]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Plan's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/planapi/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    Plan.findById(id, function (err, plan) {
        if (plan == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': plan
            });
        }
    });
});


/**
   * @swagger
   * /adminapi/planapi/{id}:
   *   delete:
   *     description: delete a Plan database API with ID
   *     tags: [AdminPanel_Plans]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Plan's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/planapi/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        Plan.deleteOne({ _id: id }, function (err, plan) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                Plan.find(function (err2, plan2) {
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
                            'data': plan2
                        });
                        console.log("err->", plan2);
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
   * /adminapi/planapi:
   *   patch:
   *     description: edit Plan API
   *     tags: [AdminPanel_Plans]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Plan's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: Plan's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: host
   *         description: Plan's host.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: totalCreations
   *         description: Plan's totalCreations.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: createdBy
   *         description: Plan's createdBy.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: description
   *         description: Plan's description.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: status
   *         description: admin Plan's status.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: public
   *         description: admin Plan's public.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: Plan's Image.
   *         in: formData
   *         required: false
   *         type: file
   *       - name: video
   *         description: admin Plan's Video.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/planapi', cpUpload, function (req, res) {
    if (req.body.editID != null) {
        let id = req.body.editID
        console.log("req :", id)
        Plan.findById(id, function (err, plan) {
            if (plan == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", plan)
                plan.createdBy = (req.body.createdBy != null) ? req.body.createdBy : plan.createdBy;
                plan.status = (req.body.status != null) ? req.body.status : plan.status;
                plan.title = (req.body.title != null) ? req.body.title : plan.title;
                plan.description = (req.body.description != null) ? req.body.description : plan.description;
                plan.host = (req.body.host != null) ? req.body.host : plan.host;
                plan.public = (req.body.public != null) ? req.body.public : plan.public;


                if (req.files['picture']) {
                    console.log("picture :", req.files['picture'][0], inputDate + "-" + req.files['picture'][0].originalname);
                    plan.planImage = inputDate + "-" + req.files['picture'][0].originalname;
                }
                if (req.files['video']) {
                    console.log("video :", req.files['video'][0], inputDate + "-" + req.files['video'][0].originalname);
                    plan.planVideo = inputDate + "-" + req.files['video'][0].originalname;
                }

                if (req.body.totalCreations != null && req.body.totalCreations == "true") {
                    plan.totalCreations = eval(plan.totalCreations) + 1
                }


                plan.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': plan
                        });
                        console.log("err->", plan);
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
   * /adminapi/addPlanNewVersionData:
   *   post:
   *     description: add Plan NewVersionData API
   *     tags: [AdminPanel_Plans]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Plan's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: version
   *         description: Plan's version
   *         in: formData
   *         required: true
   *         type: number
   *       - name: created
   *         description: Plan's created.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: finished
   *         description: Plan's finished.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addPlanNewVersionData', function (req, res) {
    if (req.body.editID != null && req.body.version != null && req.body.created != null && req.body.finished != null) {
        let id = req.body.editID
        var date = new Date();
        console.log("req :", req.body)
        Plan.findById(id, function (err, plan) {
            if (plan == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                const version = req.body.version
                const created = req.body.created
                const finished = req.body.finished
                if (Array.isArray(version)) {
                    for (var i = 0; i < version.length; i++) {
                        var newBody = {}
                        newBody.id = "plan" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                        newBody.version = version[i]
                        newBody.created = created[i]
                        newBody.finished = finished[i]
                        newBody.versionData = []
                        plan.planTypeData.push(newBody)
                        plan.save()
                            .then(todo => {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': plan
                                });

                                var newPlanVersionBody = {}
                                newPlanVersionBody.version = newBody.version;
                                newPlanVersionBody.planTypeVersionID = newBody.id;
                                newPlanVersionBody.planVersionID = plan._id;
                                let planVersion = new PlanVersion(newPlanVersionBody);
                                planVersion.save()
                                    .then(todo => {
                                        console.log("plan Version Data:", planVersion)
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
                    newBody.id = "plan" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                    newBody.version = version
                    newBody.created = created
                    newBody.finished = finished
                    newBody.versionData = []
                    plan.planTypeData.push(newBody)
                    plan.save()
                        .then(todo => {
                            res.status(200).json({
                                'status': 200,
                                'message': 'success',
                                'data': plan
                            });

                            var newPlanVersionBody = {}
                            newPlanVersionBody.version = newBody.version;
                            newPlanVersionBody.planTypeVersionID = newBody.id;
                            newPlanVersionBody.planVersionID = plan._id;
                            let planVersion = new PlanVersion(newPlanVersionBody);
                            planVersion.save()
                                .then(todo => {
                                    console.log("plan Version Data:", planVersion)
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
   * /adminapi/addPlanNewVersionData:
   *   patch:
   *     description: add Plan NewVersionData API
   *     tags: [AdminPanel_Plans]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Plan's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: planTypeDataID
   *         description: Plan's planTypeDataID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: version
   *         description: Plan's version
   *         in: formData
   *         required: false
   *         type: number
   *       - name: created
   *         description: Plan's created.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: finished
   *         description: Plan's finished.
   *         in: formData
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/addPlanNewVersionData', function (req, res) {
    if (req.body.editID != null && req.body.planTypeDataID != null) {
        let id = req.body.editID
        let planTypeDataID = req.body.planTypeDataID
        var date = new Date();
        console.log("req :", req.body)
        Plan.findById(id, function (err, plan) {
            if (plan == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                var dIndex = -1;
                plan.planTypeData.map((item, idx) => {
                    if (item.id == planTypeDataID) {
                        dIndex = idx;
                    }
                })
                if (dIndex != -1) {
                    const version = (req.body.version) ? req.body.version : plan.planTypeData[dIndex].version
                    const created = (req.body.created) ? req.body.created : plan.planTypeData[dIndex].created
                    const finished = (req.body.finished) ? req.body.finished : plan.planTypeData[dIndex].finished


                    var newBody = {}
                    newBody.id = plan.planTypeData[dIndex].id
                    newBody.version = version
                    newBody.created = created
                    newBody.finished = finished
                    newBody.versionData = []
                    // newBody.versionData = VersionData
                    plan.planTypeData[dIndex] = newBody
                    plan.updateOne(
                        { planTypeData: plan.planTypeData },
                        function (err, result) {
                            if (err) {
                                res.status(401).json({
                                    'status': 401,
                                    'message': 'fail',
                                    result
                                })
                            } else {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': plan
                                })
                                PlanVersion.findOne({ planTypeVersionID: planTypeDataID }, function (err, planVersion) {
                                    if (planVersion == null) {
                                        res.status(401).json({
                                            'status': 401,
                                            'message': 'flase',
                                            'data': 'Do not exist Data'
                                        });
                                    } else {
                                        planVersion.version = version;
                                        planVersion.save()
                                            .then(todo => {
                                                console.log("plan Version Data:", planVersion)
                                            });
                                    }
                                });
                            }
                        }
                    ); 

                } else {
                    res.status(402).json({
                        'status': 402,
                        'message': 'Donot exist planTypeData with this id',
                        'data': 'flase'
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
   * /adminapi/deletePlanNewVersionData/{id}:
   *   delete:
   *     description: delete a Plan's PlanVersion database API with ID
   *     tags: [AdminPanel_Plans]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Plan's id.
   *         in: path
   *         required: true
   *         type: string
   *       - name: planTypeVersionID
   *         description: Plan's planTypeVersionID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/deletePlanNewVersionData/:id', function (req, res) {
    if (req.params.id != null && req.body.planTypeVersionID != null) {
        let id = req.params.id;
        let planTypeVersionID = req.body.planTypeVersionID;
        console.log("id->", id);
        Plan.findById(id, function (err, plan) {
            if (plan == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'donot exsit data',
                    'data': 'flase'
                });
            } else {
                dIndex = -1;
                plan.planTypeData.map((itemSub, idx) => {
                    if (itemSub.id == planTypeVersionID) {
                        dIndex = idx;
                    }
                })
                if (dIndex != -1) {
                    plan.planTypeData.splice(dIndex, 1);
                }
                PlanVersion.deleteOne({ planTypeVersionID: planTypeVersionID }, function (err, planVersion) {
                    if (err) {
                        res.status(401).json({
                            'status': 401,
                            'message': 'delete failed',
                            'data': 'do not exist this ID in database'
                        });
                        console.log("err->", err);
                    } else {

                        plan.save()
                            .then(todo => {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': plan
                                });
                            })
                            .catch(err => {
                                res.status(403).json({
                                    'status': 403,
                                    'message': 'delete failed',
                                    'data': 'flase'
                                });
                            });
                    }
                })


            }
        });
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
   * tags:
   *   name: AdminPanel_PlanVersion
   *   description: PlanVersion management API
   */

/**
* @swagger
* /adminapi/PlanVersionapi:
*  get:
*      description: Use to request all PlanVersion
*      tags: [AdminPanel_PlanVersion]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/PlanVersionapi', function (req, res) {
    PlanVersion.find(function (err, planVersion) {
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
                'data': planVersion
            });
        }
    });
});

/**
   * @swagger
   * /adminapi/PlanVersionapi/{id}:
   *   get:
   *     description: show a AdminPanel_Plans API with ID
   *     tags: [AdminPanel_PlanVersion]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: PlanVersion's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/PlanVersionapi/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    PlanVersion.findById(id, function (err, planVersion) {
        if (planVersion == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': planVersion
            });
        }
    });
});




// /**
//    * @swagger
//    * /adminapi/PlanVersionapi:
//    *   patch:
//    *     description: edit Card API
//    *     tags: [AdminPanel_PlanVersion]
//    *     produces:
//    *       - application/json
//    *     parameters:
//    *       - name: editID
//    *         description: PlanVersion's editID.
//    *         in: formData
//    *         required: true
//    *         type: string
//    *       - name: planTypeVersionID
//    *         description: PlanVersion's planTypeVersionID.
//    *         in: formData
//    *         required: false
//    *         type: string
//    *       - name: planVersionID
//    *         description: PlanVersion's planVersionID.
//    *         in: formData
//    *         required: false
//    *         type: string 
//    *       - name: version
//    *         description: PlanVersion's version.
//    *         in: formData
//    *         required: false
//    *         type: string 
//    *     responses:
//    *       200:
//    *         description: A successful response
//    */
router.patch('/PlanVersionapi', upload.single('picture'), function (req, res) {
    if (req.body.editID != null) {
        let id = req.body.editID
        console.log("req :", id)
        PlanVersion.findById(id, function (err, planVersion) {
            if (planVersion == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", planVersion)
                planVersion.version = (req.body.version != null) ? req.body.version : planVersion.version;
                planVersion.planTypeVersionID = (req.body.planTypeVersionID != null) ? req.body.planTypeVersionID : planVersion.planTypeVersionID;
                planVersion.planVersionID = (req.body.planVersionID != null) ? req.body.planVersionID : planVersion.planVersionID;

                planVersion.save()
                    .then(todo => {
                        // Plan.findById(planVersion.planVersionID, function (err, plan) {
                        //     if (plan == null) {
                        //         res.status(401).json({
                        //             'status': 401,
                        //             'message': 'edit failed',
                        //             'data': 'do not exist this ID in database'
                        //         });
                        //         console.log("err->", err);
                        //     } else {
                        //         console.log("doc : ", plan)
                        //         let dIndex = -1
                        //         plan.planTypeData.map((item, key) => {
                        //             if (planVersion.planTypeVersionID == item.id) {
                        //                 dIndex = key
                        //             }
                        //         });
                        //         if (dIndex != -1) {
                        //             const version = (req.body.version) ? req.body.version : plan.planVersionDayTaskData[dIndex].version
                        //             const created = (req.body.created) ? req.body.created : plan.planVersionDayTaskData[dIndex].created
                        //             const finished = (req.body.finished) ? req.body.finished : plan.planVersionDayTaskData[dIndex].finished
                        //             const id = plan.planTypeData[dIndex].id

                        //             var newBody = {}
                        //             newBody.id = id
                        //             newBody.version = version
                        //             newBody.created = created
                        //             newBody.finished = finished
                        //             newBody.versionData = []

                        //             plan.planTypeData[dIndex] = []
                        //             plan.planTypeData[dIndex] = newBody
                        //             plan.updateOne(
                        //                 { planTypeData: plan.planTypeData },
                        //                 function (err, result) {
                        //                     if (err) {
                        //                         res.status(401).json({
                        //                             'status': 401,
                        //                             'message': 'fail',
                        //                             result
                        //                         })
                        //                     } else {
                        //                         res.status(200).json({
                        //                             'status': 200,
                        //                             'message': 'success',
                        //                             'data': planVersion
                        //                         })
                        //                     }
                        //                 }
                        //             );
                        //         } else {
                        //             res.status(401).json({
                        //                 'status': 401,
                        //                 'message': 'do not exist this  planTypeVersionID in database',
                        //                 'data': 'false'
                        //             });
                        //         }
                        //     }
                        // });

                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': planVersion
                        });

                        console.log("err->", planVersion);
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
   * /adminapi/addPlanVersionDayNewTask:
   *   post:
   *     description: add PlanVersion  DayNewTask API
   *     tags: [AdminPanel_PlanVersion]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: planTypeVersionID
   *         description: PlanVersion's planTypeVersionID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: PlanVersion's title
   *         in: formData
   *         required: true
   *         type: string
   *       - name: description
   *         description: PlanVersion's description.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: versionDay
   *         description: PlanVersion's versionDay.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addPlanVersionDayNewTask', upload.single('picture'), function (req, res) {
    if (req.body.planTypeVersionID != null && req.body.title != null && req.body.description != null && req.body.versionDay != null) {
        PlanVersion.findOne({ planTypeVersionID: req.body.planTypeVersionID }, function (err, planVersion) {
            if (planVersion == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'flase',
                    'data': 'Do not exist Data'
                });
            } else {
                const title = req.body.title;
                const description = req.body.description;
                const versionDay = req.body.versionDay;
                const versionDayTaskCard = (req.body.versionDayTaskCard) ? req.body.versionDayTaskCard : null;

                // var dIndex = -1;
                // planVersion.planVersionDayTaskData.map((item, idx) => {
                //     if (item.versionDay == versionDay) {
                //         dIndex = idx;
                //     }
                // })
                // if (dIndex == -1) {
                if (Array.isArray(title)) {
                    for (var i = 0; i < title.length; i++) {
                        var date = new Date();
                        var newBody2 = {}
                        newBody2.id = "versionDayTask" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                        newBody2.taskTitle = title[i]
                        newBody2.taskDescription = description[i]
                        newBody2.versionDay = versionDay[i]
                        newBody2.versionDayTaskCard = []
                        newBody2.versionDayTaskCard = versionDayTaskCard[i]
                        planVersion.planVersionDayTaskData.push(newBody2)
                        planVersion.save()
                            .then(todo => {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': planVersion
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
                    var date = new Date();
                    var newBody2 = {}
                    newBody2.id = "versionDayTask" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                    newBody2.taskTitle = title
                    newBody2.taskDescription = description
                    newBody2.versionDay = versionDay
                    newBody2.versionDayTaskCard = []
                    newBody2.versionDayTaskCard = versionDayTaskCard
                    planVersion.planVersionDayTaskData.push(newBody2)
                    planVersion.save()
                        .then(todo => {
                            res.status(200).json({
                                'status': 200,
                                'message': 'success',
                                'data': planVersion
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
                // } else {
                //     res.status(402).json({
                //         'status': 402,
                //         'message': 'already exist version Day Task',
                //         'data': 'flase'
                //     });
                // }

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
   * /adminapi/editPlanVersionDayNewTask:
   *   patch:
   *     description: edit  planVersionDayTaskData API
   *     tags: [AdminPanel_PlanVersion]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editPlanVersionID
   *         description: PlanVersion's editPlanVersionID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: planVersionDayTaskDataID
   *         description: PlanVersion's planVersionDayTaskDataID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: taskTitle
   *         description: PlanVersion's planVersionDayTaskData's  taskTitle
   *         in: formData
   *         required: false
   *         type: string
   *       - name: taskDescription
   *         description: PlanVersion's planVersionDayTaskData's  taskDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: versionDay
   *         description: PlanVersion's planVersionDayTaskData's  versionDay.
   *         in: formData
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/editPlanVersionDayNewTask', function (req, res) {
    if (req.body.editPlanVersionID != null && req.body.planVersionDayTaskDataID != null) {
        var date = new Date();
        let id = req.body.editPlanVersionID
        console.log("req :", req.body)
        PlanVersion.findById(id, function (err, planVersion) {
            if (planVersion == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                const planVersionDayTaskDataID = req.body.planVersionDayTaskDataID
                let dIndex = -1
                planVersion.planVersionDayTaskData.map((item, key) => {
                    if (planVersionDayTaskDataID == item.id) {
                        dIndex = key
                    }
                });

                if (dIndex != -1) {
                    const taskTitle = (req.body.taskTitle) ? req.body.taskTitle : planVersion.planVersionDayTaskData[dIndex].taskTitle
                    const taskDescription = (req.body.taskDescription) ? req.body.taskDescription : planVersion.planVersionDayTaskData[dIndex].taskDescription
                    const versionDay = (req.body.versionDay) ? req.body.versionDay : planVersion.planVersionDayTaskData[dIndex].versionDay
                    const id = planVersion.planVersionDayTaskData[dIndex].id
                    const versionDayTaskCard = (req.body.versionDayTaskCard) ? req.body.versionDayTaskCard : planVersion.planVersionDayTaskData[dIndex].versionDayTaskCard

                    var newBody = {}
                    newBody.id = id
                    newBody.taskTitle = taskTitle
                    newBody.taskDescription = taskDescription
                    newBody.versionDay = versionDay
                    newBody.versionDayTaskCard = []
                    newBody.versionDayTaskCard = versionDayTaskCard

                    planVersion.planVersionDayTaskData[dIndex] = []
                    planVersion.planVersionDayTaskData[dIndex] = newBody
                    planVersion.updateOne(
                        { planVersionDayTaskData: planVersion.planVersionDayTaskData },
                        function (err, result) {
                            if (err) {
                                res.status(401).json({
                                    'status': 401,
                                    'message': 'fail',
                                    result
                                })
                            } else {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': planVersion
                                })
                            }
                        }
                    );
                } else {
                    res.status(401).json({
                        'status': 401,
                        'message': 'do not exist this  planVersionDayTaskDataID in database',
                        'data': 'false'
                    });
                }
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'please input editID or all edit data',
            'data': 'flase'
        });
    }
});

/**
   * @swagger
   * /adminapi/delPlanVersionDayNewTask:
   *   delete:
   *     description: delete PlanVersion planVersionDayTaskData API
   *     tags: [AdminPanel_PlanVersion]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editPlanVersionID
   *         description: PlanVersion's editPlanVersionID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: planVersionDayTaskDataID
   *         description: PlanVersion's planVersionDayTaskDataID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/delPlanVersionDayNewTask', function (req, res) {
    if (req.body.planVersionDayTaskDataID != null && req.body.editPlanVersionID != null) {
        let editPlanVersionID = req.body.editPlanVersionID;
        let planVersionDayTaskDataID = req.body.planVersionDayTaskDataID;
        PlanVersion.findOne({ _id: editPlanVersionID }).then(function (planVersion) {
            if (planVersion == null) {
                return res.status(401).json({
                    'status': 401,
                    'message': 'Post error',
                    'data': 'do not exist Post'
                });
            } else {
                let dIndex = -1
                planVersion.planVersionDayTaskData.map((item, key) => {
                    if (planVersionDayTaskDataID == item.id) {
                        dIndex = key
                        console.log("Commit_dIndex:", dIndex)
                    }
                });
                if (dIndex != -1) {
                    planVersion.planVersionDayTaskData.splice(dIndex, 1);
                }
                planVersion.save(() => {
                    return res.status(200).json({
                        'status': 200,
                        'message': 'success',
                        'data': planVersion
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

router.patch('/editAllPlanVersionDayNewTask', function (req, res) {
    if (req.body.editPlanVersionID != null && req.body.editAllData != null) {
        var date = new Date();
        let id = req.body.editPlanVersionID
        console.log("req :", req.body)
        PlanVersion.findById(id, function (err, planVersion) {
            if (planVersion == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                const editAllData = req.body.editAllData;

                planVersion.updateOne(
                    { planVersionDayTaskData: editAllData },
                    function (err, result) {
                        if (err) {
                            res.status(401).json({
                                'status': 401,
                                'message': 'fail',
                                result
                            })
                        } else {
                            res.status(200).json({
                                'status': 200,
                                'message': 'success',
                                'data': planVersion
                            })
                        }
                    }
                );
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'please input editID or all edit data',
            'data': 'flase'
        });
    }
});

router.patch('/editAllPlanVersionDayTaskCard', function (req, res) {
    if (req.body.editPlanVersionID != null && req.body.versionDay != null && req.body.editAllData != null && req.body.DayTaskTitle != null && req.body.DayTaskDescription != null) {
        var date = new Date();
        let id = req.body.editPlanVersionID
        console.log("req :", req.body)
        PlanVersion.findById(id, function (err, planVersion) {
            if (planVersion == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                const editAllData = req.body.editAllData;
                const versionDay = req.body.versionDay;
                const DayTaskTitle = req.body.DayTaskTitle;
                const DayTaskDescription = req.body.DayTaskDescription;
                var dIndex = -1;
                planVersion.planVersionDayTaskData.map((item, idx) => {
                    if (item.versionDay = versionDay) {
                        dIndex = idx;
                        planVersion.planVersionDayTaskData[idx].versionDayTaskCard = editAllData
                        planVersion.planVersionDayTaskData[idx].taskTitle = DayTaskTitle
                        planVersion.planVersionDayTaskData[idx].taskDescription = DayTaskDescription
                    }
                })
                if (dIndex != -1) {
                    planVersion.updateOne(
                        { planVersionDayTaskData: planVersion.planVersionDayTaskData },
                        function (err, result) {
                            if (err) {
                                res.status(401).json({
                                    'status': 401,
                                    'message': 'fail',
                                    result
                                })
                            } else {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': planVersion
                                })
                            }
                        }
                    );
                }
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'please input editID or all edit data',
            'data': 'flase'
        });
    }
});

/**
   * @swagger
   * /adminapi/addPlanVersionDayTaskCard:
   *   post:
   *     description: add PlanVersion DayTaskCard API
   *     tags: [AdminPanel_PlanVersion]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: planVersionUUID
   *         description: PlanVersion's planVersionUUID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: planVersionDayTaskID
   *         description: PlanVersion's planVersionDayTaskID
   *         in: formData
   *         required: true
   *         type: string
   *       - name: type
   *         description: PlanVersion's card  type.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: PlanVersion's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: videoDescription
   *         description: PlanVersion's videoDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: restTime
   *         description: PlanVersion's restTime.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: noteDescription
   *         description: PlanVersion's noteDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Reps
   *         description: PlanVersion's Reps.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: Sets
   *         description: PlanVersion's Sets.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: RepCount
   *         description: PlanVersion's RepCount.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: Rest
   *         description: PlanVersion's Rest.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: AutoPlayNextCard
   *         description: PlanVersion's AutoPlayNextCard.
   *         in: formData
   *         required: false
   *         type: boolean
   *       - name: cycles
   *         description: PlanVersion's cycles.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: cardFile
   *         description: PlanVersion's cardFile.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addPlanVersionDayTaskCard', upload.array('cardFile', 12), function (req, res) {
    if (req.body.planVersionUUID != null && req.body.planVersionDayTaskID != null && req.body.type != null) {
        var files, editFlag;
        var date = new Date();
        // var creatorDate = date.getFullYear() + "-" + eval(date.getMonth() + 1) + "-" + eval(date.getDate() + 1) + "-" + eval(date.getDay() + 1);

        if (req.files != null) {
            files = req.files
        }

        let planVersionUUID = req.body.planVersionUUID
        let planVersionDayTaskID = req.body.planVersionDayTaskID
        // console.log("req :", req.body)
        PlanVersion.findById(planVersionUUID, function (err, planVersion) {
            // console.log("before:", planVersion);Qinglu
            if (planVersion == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'false',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                planVersion.planVersionDayTaskData.map((item, key) => {
                    if (planVersionDayTaskID == item.id) {
                        editFlag = true
                        const type = req.body.type;
                        const title = (req.body.title != null) ? req.body.title : planVersion.title;
                        const videoDescription = (req.body.videoDescription != null) ? req.body.videoDescription : planVersion.videoDescription;
                        const restTime = (req.body.restTime != null) ? req.body.restTime : planVersion.restTime;
                        const noteDescription = (req.body.noteDescription != null) ? req.body.noteDescription : planVersion.noteDescription;
                        const Reps = (req.body.Reps != null) ? req.body.Reps : planVersion.Reps;
                        const Sets = (req.body.Sets != null) ? req.body.Sets : planVersion.Sets;
                        const RepCount = (req.body.RepCount != null) ? req.body.RepCount : planVersion.RepCount;
                        const Rest = (req.body.Rest != null) ? req.body.Rest : planVersion.Rest;
                        const AutoPlayNextCard = (req.body.AutoPlayNextCard != null) ? req.body.AutoPlayNextCard : planVersion.AutoPlayNextCard;
                        const cycles = (req.body.cycles != null) ? req.body.cycles : planVersion.cycles;
                        var newBody = {}

                        if (type == "circuit") {
                            newBody.id = "Circuit_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.title = title;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            newBody.Reps = Reps;
                            newBody.Sets = Sets;
                            newBody.RepCount = RepCount;
                            newBody.Rest = Rest;
                            newBody.cycles = cycles;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard.push(newBody)
                        } else if (type == "exercise") {
                            newBody.id = "Exercise_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.title = title;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            newBody.Reps = Reps;
                            newBody.Sets = Sets;
                            newBody.RepCount = RepCount;
                            newBody.Rest = Rest;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard.push(newBody)
                        } else if (type == "video") {
                            newBody.id = "Video_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.title = title;
                            newBody.videoDescription = videoDescription;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            if (req.files != null && files.length > 0) {
                                newBody.cardFile = files[0].filename;
                            }
                            // let prevList = JSON.parse(planVersion.planVersionDayTaskData[key].versionDayTaskCard)
                            // prevList.push(newBody)
                            // console.log("updated array : ", prevList, newBody,  planVersion.planVersionDayTaskData[key])
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard.push(newBody)
                        } else if (type == "rest") {
                            newBody.id = "Rest_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.restTime = restTime;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard.push(newBody)
                        } else if (type == "note") {
                            newBody.id = "Note_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.noteDescription = noteDescription;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard.push(newBody)
                        } else {
                            console.log("new array : ", planVersion)
                        }
                    } else {
                        editFlag = false
                    }
                })
                if (editFlag == true) {
                    planVersion.updateOne(
                        { planVersionDayTaskData: planVersion.planVersionDayTaskData },
                        function (err, result) {
                            if (err) {
                                res.status(401).json({
                                    'status': 401,
                                    'message': 'fail',
                                    result
                                })
                            } else {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': planVersion
                                })
                            }
                        }
                    );
                } else {
                    res.status(400).json({
                        'status': 400,
                        'message': 'flase',
                        'data': 'please correct ID'
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
   * /adminapi/addPlanVersionDayTaskCard:
   *   patch:
   *     description: add PlanVersion DayTaskCard API
   *     tags: [AdminPanel_PlanVersion]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: planVersionUUID
   *         description: PlanVersion's planVersionUUID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: planVersionDayTaskID
   *         description: PlanVersion's planVersionDayTaskID
   *         in: formData
   *         required: true
   *         type: string
   *       - name: planVersionDayTaskCardID
   *         description: PlanVersion's planVersionDayTaskCardID
   *         in: formData
   *         required: true
   *         type: string
   *       - name: type
   *         description: PlanVersion's card  type.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: PlanVersion's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: videoDescription
   *         description: PlanVersion's videoDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: restTime
   *         description: PlanVersion's restTime.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: noteDescription
   *         description: PlanVersion's noteDescription.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: Reps
   *         description: PlanVersion's Reps.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: Sets
   *         description: PlanVersion's Sets.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: RepCount
   *         description: PlanVersion's RepCount.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: Rest
   *         description: PlanVersion's Rest.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: AutoPlayNextCard
   *         description: PlanVersion's AutoPlayNextCard.
   *         in: formData
   *         required: false
   *         type: boolean
   *       - name: cycles
   *         description: PlanVersion's cycles.
   *         in: formData
   *         required: false
   *         type: number
   *       - name: cardFile
   *         description: PlanVersion's cardFile.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/addPlanVersionDayTaskCard', upload.array('cardFile', 12), function (req, res) {
    if (req.body.planVersionUUID != null && req.body.planVersionDayTaskID != null && req.body.type != null && req.body.planVersionDayTaskCardID != null) {
        var files, editFlag;
        var date = new Date();
        // var creatorDate = date.getFullYear() + "-" + eval(date.getMonth() + 1) + "-" + eval(date.getDate() + 1) + "-" + eval(date.getDay() + 1);

        if (req.files != null) {
            files = req.files
        }

        let planVersionUUID = req.body.planVersionUUID
        let planVersionDayTaskID = req.body.planVersionDayTaskID
        let planVersionDayTaskCardID = req.body.planVersionDayTaskCardID
        // console.log("req :", req.body)
        PlanVersion.findById(planVersionUUID, function (err, planVersion) {
            // console.log("before:", planVersion);Qinglu
            if (planVersion == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                planVersion.planVersionDayTaskData.map((item, key) => {
                    if (planVersionDayTaskID == item.id) {
                        editFlag = true
                        const type = req.body.type;
                        const title = (req.body.title != null) ? req.body.title : planVersion.title;
                        const videoDescription = (req.body.videoDescription != null) ? req.body.videoDescription : planVersion.videoDescription;
                        const restTime = (req.body.restTime != null) ? req.body.restTime : planVersion.restTime;
                        const noteDescription = (req.body.noteDescription != null) ? req.body.noteDescription : planVersion.noteDescription;
                        const Reps = (req.body.Reps != null) ? req.body.Reps : planVersion.Reps;
                        const Sets = (req.body.Sets != null) ? req.body.Sets : planVersion.Sets;
                        const RepCount = (req.body.RepCount != null) ? req.body.RepCount : planVersion.RepCount;
                        const Rest = (req.body.Rest != null) ? req.body.Rest : planVersion.Rest;
                        const AutoPlayNextCard = (req.body.AutoPlayNextCard != null) ? req.body.AutoPlayNextCard : planVersion.AutoPlayNextCard;
                        const cycles = (req.body.cycles != null) ? req.body.cycles : planVersion.cycles;
                        var newBody = {}

                        let dIndex = -1
                        planVersion.planVersionDayTaskData[key].versionDayTaskCard.map((item, key) => {
                            if (planVersionDayTaskCardID == item.id) {
                                dIndex = key
                            }
                        });

                        if (type == "circuit") {
                            newBody.id = "Circuit_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.title = title;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            newBody.Reps = Reps;
                            newBody.Sets = Sets;
                            newBody.RepCount = RepCount;
                            newBody.Rest = Rest;
                            newBody.cycles = cycles;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard[dIndex] = newBody
                        } else if (type == "exercise") {
                            newBody.id = "Exercise_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.title = title;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            newBody.Reps = Reps;
                            newBody.Sets = Sets;
                            newBody.RepCount = RepCount;
                            newBody.Rest = Rest;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard[dIndex] = newBody
                        } else if (type == "video") {
                            newBody.id = "Video_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.title = title;
                            newBody.videoDescription = videoDescription;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            if (req.files != null && files.length > 0) {
                                newBody.cardFile = files[0].filename;
                            }
                            // let prevList = JSON.parse(planVersion.planVersionDayTaskData[key].versionDayTaskCard)
                            // prevList.push(newBody)
                            // console.log("updated array : ", prevList, newBody,  planVersion.planVersionDayTaskData[key])
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard[dIndex] = newBody
                        } else if (type == "rest") {
                            newBody.id = "Rest_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.restTime = restTime;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard[dIndex] = newBody
                        } else if (type == "note") {
                            newBody.id = "Note_planVersionDayTaskcard" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.type = type;
                            newBody.noteDescription = noteDescription;
                            newBody.AutoPlayNextCard = AutoPlayNextCard;
                            planVersion.planVersionDayTaskData[key].versionDayTaskCard[dIndex] = newBody
                        } else {
                            console.log("new array : ", planVersion)
                        }
                    } else {
                        editFlag = false
                    }
                })
                if (editFlag == true) {
                    planVersion.updateOne(
                        { planVersionDayTaskData: planVersion.planVersionDayTaskData },
                        function (err, result) {
                            if (err) {
                                res.status(401).json({
                                    'status': 401,
                                    'message': 'fail',
                                    result
                                })
                            } else {
                                res.status(200).json({
                                    'status': 200,
                                    'message': 'success',
                                    'data': planVersion
                                })
                            }
                        }
                    );
                } else {
                    res.status(400).json({
                        'status': 400,
                        'message': 'flase',
                        'data': 'please correct ID'
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
   * /adminapi/showJoinedPlanData/{id}:
   *   get:
   *     description: This is show own all plan data API
   *     tags: [AdminPanel_PlanVersion]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Plan's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/showJoinedPlanData/:id', function (req, res) {
    let plan_VersionID = req.params.id;

    PlanVersion.find({
        'planVersionID': plan_VersionID
    }, function (err, result) {
        if (err) {
            res.status(401).json({
                'status': 401,
                'message': 'failed',
                'data': 'Do not exist data in database with this post ID'
            });
        } else if (result) {


            Plan.findById(plan_VersionID, function (err, plan) {
                if (err) {
                    res.status(401).json({
                        'status': 401,
                        'message': 'failed',
                        'data': 'Do not exist data in database with this post ID'
                    });
                } else {
                    result.map((item, key) => {
                        console.log("result Count:", key)
                        plan.planTypeData.map((item2, key2) => {
                            if (item2.id == item.planTypeVersionID) {
                                plan.planTypeData[key2].versionData.push(item)
                            }
                        })
                    })
                    res.status(200).json({
                        'status': 200,
                        'message': 'success',
                        'data': plan
                    });
                }
            })
        } else {
            res.send(JSON.stringify({
                error: 'Error'
            }))
        }
    })

});


/**
   * @swagger
   * tags:
   *   name:    =============== Dash project swagger API doc ===============
   *   description:  <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
   */


module.exports = router;
