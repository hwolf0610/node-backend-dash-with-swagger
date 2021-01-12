var express = require('express');
var router = express.Router();
const multer = require("multer");

let Test = require('../Model/mobile_test.model');

/**
   * @swagger
   * tags:
   *   name: Server API Test
   *   description: This is server test api
   */

/**
 * @swagger
 * /myapi_test:
 *  get:
 *      description: Use to request all customers
 *      tags: [Server API Test]
 *      responses:
 *          '200':
 *              description: A successful response
 */

 
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
   *   name: Test_Model
   *   description: Test_Model management API
   */

//my Category API//

/**
   * @swagger
   * /api/Test_Model_API:
   *   post:
   *     description: add Test_Model API
   *     tags: [Test_Model]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: title
   *         description: Test_Model's title.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: description
   *         description: Test_Model's description.
   *         in: formData
   *         required: true
   *         type: string 
   *       - name: picture
   *         description: Test_Model's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/Test_Model_API', upload.single('picture'), function (req, res) {
    if (req.body.title != null && req.body.description != null) {
        let test = new Test(req.body);
        test.save()
            .then(todo => {
                let id = test._id
                Test.findById(id, function (err, test2) {
                    test2.picture = (fileName != null) ? fileName : test2.picture;
                    test2.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': test2
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
* /api/Test_Model_API:
*  get:
*      description: Use to request all Test_Model
*      tags: [Test_Model]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/Test_Model_API', function (req, res) {
    Test.find(function (err, test) {
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
                'data': test
            });
        }
    });
});

/**
   * @swagger
   * /api/Test_Model_API/{id}:
   *   get:
   *     description: show a Test_Model database API with ID
   *     tags: [Test_Model]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Test_Model's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.get('/Test_Model_API/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    Test.findById(id, function (err, test) {
        // console.log(user.displayname);
        if (test == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': test
            });
        }
    });
});

/**
   * @swagger
   * /api/Test_Model_API/{id}:
   *   delete:
   *     description: delete a Test_Model database API with ID
   *     tags: [Test_Model]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Test_Model's id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A successful response
   */
router.delete('/Test_Model_API/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        Test.deleteOne({ _id: id }, function (err, test) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                Test.find(function (err2, test2) {
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
                            'data': test2
                        });
                        console.log("err->", test2);
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
   * /api/Test_Model_API:
   *   patch:
   *     description: edit Test_Model API
   *     tags: [Test_Model]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Test_Model's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: Test_Model's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: description
   *         description: Test_Model's description.
   *         in: formData
   *         required: false
   *         type: string 
   *       - name: picture
   *         description: Test_Model's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/Test_Model_API', upload.single('picture'), function (req, res) {
    if (req.body.editID != null) {
        let id = req.body.editID
        console.log("req :", id)
        Test.findById(id, function (err, test) {
            if (test == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", test)
                test.title = (req.body.title != null) ? req.body.title : test.title;
                test.description = (req.body.description != null) ? req.body.description : test.description;
                test.picture = (fileName != null) ? fileName : test.picture;
                test.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': test
                        });
                        console.log("err->", test);
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


module.exports = router;


 