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
let Post = require('../Model/mobile_Post.model');


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
   *   name: Mobile_Posts
   *   description: Post management API
   */

//my post API//
/**
   * @swagger
   * /mobileapi/postapi:
   *   post:
   *     description: add Post API
   *     tags: [Mobile_Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: createdBy
   *         description: Post's createdBy.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: detail
   *         description: Post's detail.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: creationDate
   *         description: Post's creationDate.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: challengeId
   *         description: Post's challengeId.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: postStatus
   *         description: Post's Status.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: Post's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/postapi', upload.single('picture'), function (req, res) {
    if (req.body.createdBy != null && req.body.detail != null && req.body.creationDate != null && req.body.challengeId != null) {
        let post = new Post(req.body);
        post.save()
            .then(todo => {
                let id = post._id
                console.log("req :", id)

                Post.findById(id, function (err, post) {
                    if (err) console.log("err ; ", err)
                    console.log("doc : ", post)
                    post.postImage = (fileName != null) ? fileName : post.postImage;
                    post.postStatus = (req.body.postStatus) ? req.body.postStatus : "UnFlagged";
                    post.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': post
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
* /mobileapi/postapi:
*  get:
*      description: Use to request all post
*      tags: [Mobile_Posts]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/postapi', function (req, res) {
    Post.find(function (err, post) {
        console.log(post.createdBy);
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
                'data': post
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/postapi/{id}:
   *   get:
   *     description: show a Post database API with ID
   *     tags: [Mobile_Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Post's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/postapi/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    Post.findById(id, function (err, post) {
        // console.log(user.displayname);
        if (post == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': post
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/postapi/{id}:
   *   delete:
   *     description: delete a Post database API with ID
   *     tags: [Mobile_Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Post's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/postapi/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        Post.deleteOne({ _id: id }, function (err, post) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                Post.find(function (err2, post2) {
                    console.log(post2.createdBy);
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
                            'data': post2
                        });
                        console.log("err->", post2);
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
   * /mobileapi/postapi:
   *   patch:
   *     description: add Post API
   *     tags: [Mobile_Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editPostID
   *         description: Post's editPostID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: createdBy
   *         description: Post's createdBy.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: detail
   *         description: Post's detail.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: postStatus
   *         description: Post's Status.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: creationDate
   *         description: Post's creationDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: challengeId
   *         description: Post's challengeId.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: Post's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/postapi', upload.array('picture', 12), function (req, res) {
    if (req.body.editPostID != null) {
        const files = req.files
        let id = req.body.editPostID
        console.log("req :", req.body)
        Post.findById(id, function (err, post) {
            if (post == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                // console.log("doc : ", post)
                if (files.length > 0) {
                    post.postImage = (files[0].filename != null) ? files[0].filename : post.postImage;
                }
                post.detail = (req.body.detail != null) ? req.body.detail : post.detail;
                post.postStatus = (req.body.postStatus != null) ? req.body.postStatus : post.postStatus;
                post.challengeId = (req.body.challengeId != null) ? req.body.challengeId : post.challengeId;
                post.creationDate = (req.body.creationDate != null) ? req.body.creationDate : post.creationDate;
                post.createdBy = (req.body.createdBy != null) ? req.body.createdBy : post.createdBy;
                if (req.body.friendsIds != null) {
                    post.friendsIds.push(req.body.friendsIds)
                }
                post.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': post
                        });
                        console.log("err->", post);
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
            'message': 'please input editID or all commit data',
            'data': 'flase'
        });
    }
});

/**
   * @swagger
   * /mobileapi/addPostCommit:
   *   post:
   *     description: add Post commit API
   *     tags: [Mobile_Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editPostID
   *         description: Post's editPostID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: commitIds
   *         description: PostCommit's User ID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: commitTypes
   *         description: PostCommit's commitTypes.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: commitDetails
   *         description: PostCommit's commitDetails.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: creatorDate
   *         description: PostCommit's creatorDate.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: picture
   *         description: PostCommit's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/addPostCommit', upload.array('picture', 12), function (req, res) {
    if (req.body.editPostID != null && req.body.commitIds != null && req.body.commitTypes != null && req.body.commitDetails != null && req.body.creatorDate) {
        var files;
        var date = new Date();
        // var creatorDate = date.getFullYear() + "-" + eval(date.getMonth() + 1) + "-" + eval(date.getDate() + 1) + "-" + eval(date.getDay() + 1);
        if (req.files != null) {
            files = req.files
        }
        let id = req.body.editPostID
        console.log("req :", req.body)
        Post.findById(id, function (err, post) {
            if (post == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                const commitIds = req.body.commitIds
                const commitTypes = req.body.commitTypes
                const commitDetails = req.body.commitDetails
                const creatorDate = req.body.creatorDate
                const commitStatus = "unflagged"
                const userStatus = "no warned"
                const postUUID = req.body.editPostID
                if (Array.isArray(commitIds)) {
                    for (var i = 0; i < commitIds.length; i++) {
                        User.findById(commitIds[i], function (err, user) {
                            if (user != null) {
                                var newBody = {}
                                newBody.id = "commit" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                                newBody.commitUserId = commitIds[i]
                                newBody.commitUsername = user.username
                                newBody.commitUserAvata = user.profileImage
                                newBody.commitTypes = commitTypes[i]
                                newBody.commitDetails = commitDetails[i]
                                newBody.creatorDate = creatorDate[i]
                                newBody.commitStatus = commitStatus
                                newBody.userStatus = userStatus
                                newBody.postUUID = postUUID
                                newBody.DateFlagged = "unFlagged"

                                if (req.files != null && files.length > i) {
                                    newBody.commitPicture = files[i].filename
                                }
                                post.commitData.push(newBody)
                                post.save()
                                    .then(todo => {
                                        res.status(200).json({
                                            'status': 200,
                                            'message': 'success',
                                            'data': post
                                        });
                                        // console.log("err->", post);
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
                    User.findById(commitIds, function (err, user) {
                        if (user != null) {
                            var newBody = {}
                            newBody.id = "commit" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + Math.random().toString().replace("0.", "")
                            newBody.commitUserId = commitIds
                            newBody.commitUsername = user.username
                            newBody.commitUserAvata = user.profileImage
                            newBody.commitTypes = commitTypes
                            newBody.commitDetails = commitDetails
                            newBody.creatorDate = creatorDate
                            newBody.commitStatus = commitStatus
                            newBody.userStatus = userStatus
                            newBody.postUUID = postUUID
                            newBody.DateFlagged = "unFlagged"
                            
                            if (req.files != null && files.length > 0) {
                                newBody.commitPicture = files[0].filename
                            }
                            post.commitData.push(newBody)
                            post.save()
                                .then(todo => {
                                    res.status(200).json({
                                        'status': 200,
                                        'message': 'success',
                                        'data': post
                                    });
                                    // console.log("err->", post);
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
                // if (req.files != null && files.length > 0) {
                //     for (var i = 0; i < files.length; i++) {
                //         post.commitPicture.push(files[i].filename)
                //     }
                // }                

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
   * /mobileapi/addPostCommit:
   *   patch:
   *     description: add Post commit API
   *     tags: [Mobile_Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editPostID
   *         description: Post's editPostID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: commitIds
   *         description: PostCommit's commitIds
   *         in: formData
   *         required: true
   *         type: string
   *       - name: commitTypes
   *         description: PostCommit's commitTypes.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: commitDetails
   *         description: PostCommit's commitDetails.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: creatorDate
   *         description: PostCommit's creatorDate.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: commitStatus
   *         description: PostCommit's commitStatus.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: userStatus
   *         description: PostCommit's userStatus.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: DateFlagged
   *         description: PostCommit's DateFlagged.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: PostCommit's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/addPostCommit', upload.array('picture', 12), function (req, res) {
    if (req.body.editPostID != null && req.body.commitIds != null) {
        var files;
        var date = new Date();
        // var creatorDate = date.getFullYear() + "-" + eval(date.getMonth() + 1) + "-" + eval(date.getDate() + 1) + "-" + eval(date.getDay() + 1);
        if (req.files != null) {
            files = req.files
        }
        let id = req.body.editPostID
        console.log("req :", req.body)
        Post.findById(id, function (err, post) {
            if (post == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                // console.log("err->", err);
            } else {
                const commitIds = req.body.commitIds

                let dIndex = -1
                post.commitData.map((item, key) => {
                    if (commitIds == item.id) {
                        dIndex = key
                    }
                });
                if (dIndex != -1) {
                    const commitTypes = (req.body.commitTypes) ? req.body.commitTypes : post.commitData[dIndex].commitTypes
                    const commitDetails = (req.body.commitDetails) ? req.body.commitDetails : post.commitData[dIndex].commitDetails
                    const creatorDate = (req.body.creatorDate) ? req.body.creatorDate : post.commitData[dIndex].creatorDate
                    const commitStatus = (req.body.commitStatus) ? req.body.commitStatus : post.commitData[dIndex].commitStatus
                    const userStatus = (req.body.userStatus) ? req.body.userStatus : post.commitData[dIndex].userStatus
                    const DateFlagged = (req.body.DateFlagged) ? req.body.DateFlagged : post.commitData[dIndex].DateFlagged
                    const postUUID = req.body.editPostID
                    const commitUsername = post.commitData[dIndex].commitUsername
                    const commitUserAvata = post.commitData[dIndex].commitUserAvata
                    const id = post.commitData[dIndex].id
                    const commitUserId = post.commitData[dIndex].commitUserId
                     
                    var newBody = {}
                    newBody.id = id
                    newBody.commitUserId = commitUserId
                    newBody.commitUsername = commitUsername
                    newBody.commitUserAvata =commitUserAvata
                    newBody.commitTypes = commitTypes
                    newBody.commitDetails = commitDetails
                    newBody.creatorDate = creatorDate
                    newBody.commitStatus = commitStatus
                    newBody.userStatus = userStatus
                    newBody.postUUID = postUUID
                    newBody.DateFlagged = DateFlagged

                    if (req.files != null && files.length > 0) {
                        newBody.commitPicture = files[0].filename
                    }
                    post.commitData[dIndex] = newBody

                    post.updateOne(
                        { commitData: post.commitData },
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
                                    'data': post
                                })
                                fileName = null
                            }
                        }
                    );
                    // post.save()
                    //     .then(todo => {
                    //         res.status(200).json({
                    //             'status': 200,
                    //             'message': 'success',
                    //             'data': post
                    //         });
                    //         // console.log("err->", post);
                    //         fileName = null
                    //     })
                    //     .catch(err => {
                    //         res.status(402).json({
                    //             'status': 402,
                    //             'message': 'edit failed',
                    //             'data': 'flase'
                    //         });
                    //     });
                }else{
                    res.status(401).json({
                        'status': 401,
                        'message': 'do not exist this  Commit ID in database',
                        'data': 'false'
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
   * /mobileapi/delPostCommit:
   *   delete:
   *     description: delete Post commit API
   *     tags: [Mobile_Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editPostID
   *         description: Post's editPostID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: delCommitID
   *         description: Post's delCommitID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/delPostCommit', function (req, res) {
    if (req.body.delCommitID != null && req.body.editPostID != null) {
        let editPostID = req.body.editPostID;
        let delCommitID = req.body.delCommitID;
        Post.findOne({ _id: editPostID }).then(function (post) {
            if (post == null) {
                return res.status(401).json({
                    'status': 401,
                    'message': 'Post error',
                    'data': 'do not exist Post'
                });
            } else {
                let dIndex = -1
                post.commitData.map((item, key) => {
                    if (delCommitID == item.id) {
                        dIndex = key
                        console.log("Commit_dIndex:", dIndex)
                    }
                });
                if (dIndex != -1) {
                    post.commitData.splice(dIndex, 1);
                }
                post.save(() => {
                    return res.status(200).json({
                        'status': 200,
                        'message': 'success',
                        'data': post
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
