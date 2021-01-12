var express = require('express');
var router = express.Router();
// const mongoose = require('mongoose');
const multer = require("multer");

// mongoose.connect('mongodb://127.0.0.1:27017/DashApp', { useNewUrlParser: true });
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully");
// })

let Category = require('../Model/mobile_category.model');


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
   *   name: Mobile_Categorys
   *   description: Category management API
   */

//my Category API//

/**
   * @swagger
   * /mobileapi/categoryapi:
   *   post:
   *     description: add Category API
   *     tags: [Mobile_Categorys]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: title
   *         description: Category's title.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: description
   *         description: Category's description.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: color
   *         description: Category's color.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: picture
   *         description: Category's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.post('/categoryapi', upload.single('picture'), function (req, res) {
    if (req.body.title != null && req.body.description != null && req.body.color != null) {
        let category = new Category(req.body);
        category.save()
            .then(todo => {
                let id = category._id
                Category.findById(id, function (err, category2) {
                    category2.picture = (fileName != null) ? fileName : category2.picture;
                    category2.save(() => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': category2
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
* /mobileapi/categoryapi:
*  get:
*      description: Use to request all category
*      tags: [Mobile_Categorys]
*      responses:
*          '200':
*              description: A successful response
*/
router.get('/categoryapi', function (req, res) {
    Category.find(function (err, category) {
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
                'data': category
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/categoryapi/{id}:
   *   get:
   *     description: show a Category database API with ID
   *     tags: [Mobile_Categorys]
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
router.get('/categoryapi/:id', function (req, res) {
    let id = req.params.id;
    console.log("params:", req.params)
    console.log("body:", req.body)
    Category.findById(id, function (err, category) {
        // console.log(user.displayname);
        if (category == null) {
            res.status(401).json({
                'status': 401,
                'message': 'flase',
                'data': 'Do not exist Data'
            });
        } else {
            res.status(200).json({
                'status': 200,
                'message': 'success',
                'data': category
            });
        }
    });
});

/**
   * @swagger
   * /mobileapi/categoryapi/{id}:
   *   delete:
   *     description: delete a Category database API with ID
   *     tags: [Mobile_Categorys]
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
router.delete('/categoryapi/:id', function (req, res) {
    if (req.params.id != null) {
        let id = req.params.id;
        console.log("id->", id);
        Category.deleteOne({ _id: id }, function (err, category) {
            if (err) {
                res.status(401).json({
                    'status': 401,
                    'message': 'delete failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                Category.find(function (err2, category2) {
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
                            'data': category2
                        });
                        console.log("err->", category2);
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
   * /mobileapi/categoryapi:
   *   patch:
   *     description: edit Category API
   *     tags: [Mobile_Categorys]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editID
   *         description: Category's editID.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: title
   *         description: Category's title.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: description
   *         description: Category's description.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: color
   *         description: Category's color.
   *         in: formData
   *         required: false
   *         type: string
   *       - name: picture
   *         description: Category's Image.
   *         in: formData
   *         required: false
   *         type: file
   *     responses:
   *       200:
   *         description: A successful response
   */
router.patch('/categoryapi', upload.single('picture'), function (req, res) {
    if (req.body.editID != null) {
        let id = req.body.editID
        console.log("req :", id)
        Category.findById(id, function (err, category) {
            if (category == null) {
                res.status(401).json({
                    'status': 401,
                    'message': 'edit failed',
                    'data': 'do not exist this ID in database'
                });
                console.log("err->", err);
            } else {
                console.log("doc : ", category)
                category.title = (req.body.title != null) ? req.body.title : category.title;
                category.description = (req.body.description != null) ? req.body.description : category.description;
                category.color = (req.body.color != null) ? req.body.color : category.color;
                category.picture = (fileName != null) ? fileName : category.picture;
                category.save()
                    .then(todo => {
                        res.status(200).json({
                            'status': 200,
                            'message': 'success',
                            'data': category
                        });
                        console.log("err->", category);
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
