'use strict';

const express = require('express');
const router = express.Router();
const app = express();
var path = require('path');
const http = require('http');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDoc = require('./swagger.json')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const swaggerJsDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3002;

var mobileUserRouter = require('./Controllers/mobileApis_user');
var mobileTestRouter = require('./Controllers/mobileApis_TEST');
var TestRouter = require('./Controllers/server_swagger');
var mobileChallengesRouter = require('./Controllers/mobileApis_challenges');
var mobilePostRouter = require('./Controllers/mobileApis_Post');
var mobileCategoryRouter = require('./Controllers/mobileApis_Category');
var mobileWorkoutRouter = require('./Controllers/mobileApis_Workout');
var adminPlanRouter = require('./Controllers/adminApis_plan');
var adminCardRouter = require('./Controllers/adminApis_Card');

app.use(cors());
app.use('/static', express.static('public'))

//rest API requirements
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Couple the application to the Swagger module.
// endpoints(app);
// swaggerDoc(app);

app.use('/mobileapi', mobileUserRouter);
app.use('/mobileapi', mobileTestRouter);
app.use('/api', TestRouter);
app.use('/mobileapi', mobileChallengesRouter);
app.use('/mobileapi', mobilePostRouter);
app.use('/mobileapi', mobileCategoryRouter);
app.use('/mobileapi', mobileWorkoutRouter);
app.use('/adminapi', adminPlanRouter);
app.use('/adminapi', adminCardRouter);

// mongoose.connect('mongodb://127.0.0.1:27017/DashApp', { useNewUrlParser: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully");
// })

const URI = "mongodb://127.0.0.1:27017/DashApp"
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            URI,
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }
        )
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`MongoDB error when connecting: ${error}`);
    }
}
connectDB()

//Extended: http://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0-Dash",
            title: 'Dash API',
            description: "API for Dash application",
            license: {
                "name": "MIT",
                "url": "https://opensource.org/licenses/MIT"
            },
            contact: {
                name: "Amazing Developer"
            },
            servers: ["https://dashchallengesapi.com"],
            host: "dashchallengesapi.com",
            basePath: '/'
        }
    },
    //['.routes/*.js]
    apis: ["server/server.js", "server/Controllers/mobileApis_user.js", "server/Controllers/mobileApis_challenges.js", "server/Controllers/mobileApis_Category.js", "server/Controllers/mobileApis_Post.js", "server/Controllers/mobileApis_TEST.js", "server/Controllers/mobileApis_Workout.js", "server/Controllers/adminApis_Card.js", "server/Controllers/adminApis_plan.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-apis', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

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

//ROUTES WILL GO HERE
app.get('/myapi_test', function (req, res) {
    res.status(200).json({
        'status': 200,
        'message': 'WELCOME',
        'data': 'Dash App Backend running correctly',
        "UUID": Math.random().toString().replace("0.", "")
    });
});





// app.use('/swagger-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Open http://<app_host>:<app_port>/api-docs in your browser to view the documentation.
// const expressSwagger = require('express-swagger-generator')(app);
// let options = {
//     swaggerDefinition: {
//         info: {
//             description: 'API for DashApi application',
//             title: 'DashApi',
//             version: '1.0.0-SNAPSHOT',
//         },
//         host: 'https://dashchallengesapi.com',
//         basePath: '/v1',
//         produces: [
//             "application/json",
//             "application/xml"
//         ],
//         schemes: ['http', 'https'],
//         securityDefinitions: {
//             JWT: {
//                 type: 'apiKey',
//                 in: 'header',
//                 name: 'Authorization',
//                 description: "",
//             }
//         }
//     },
//     basedir: __dirname, //app absolute path
//     files: ['./routes/**/*.js'] //Path to the API handle folder
// };
// expressSwagger(options)

// //MVC pattern
// var Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost:27017/swagger-demo');

// var UserSchema = new Schema({
//     email: {
//         type: String, required: true,
//         trim: true, unique: true,
//         match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
//     },
//     firstName: { type: String },
//     lastName: { type: String }
// });

// mongoose.model('User', UserSchema);
// var User = require('mongoose').model('User');

// //middleware for create
// var createUser = function (req, res, next) {
//     var user = new User(req.body);

//     user.save(function (err) {
//         if (err) {
//             next(err);
//         } else {
//             res.json(user);
//         }
//     });
// };

// var updateUser = function (req, res, next) {
//     User.findByIdAndUpdate(req.body._id, req.body, { new: true }, function (err, user) {
//         if (err) {
//             next(err);
//         } else {
//             res.json(user);
//         }
//     });
// };

// var deleteUser = function (req, res, next) {
//     req.user.remove(function (err) {
//         if (err) {
//             next(err);
//         } else {
//             res.json(req.user);
//         }
//     });
// };

// var getAllUsers = function (req, res, next) {
//     User.find(function (err, users) {
//         if (err) {
//             next(err);
//         } else {
//             res.json(users);
//         }
//     });
// };

// var getOneUser = function (req, res) {
//     res.json(req.user);
// };

// var getByIdUser = function (req, res, next, id) {
//     User.findOne({ _id: id }, function (err, user) {
//         if (err) {
//             next(err);
//         } else {
//             req.user = user;
//             next();
//         }
//     });
// };

// router.route('/userapi')
//     .post(createUser)
//     .get(getAllUsers);

// router.route('/userapi/:userId')
//     .get(getOneUser)
//     .put(updateUser)
//     .delete(deleteUser);

// router.param('userId', getByIdUser);


// app.use('/mobileapi', router);


// mongoose.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});



// var nodemailer = require('nodemailer');
// var billing_email = require('express-email')(__dirname + '/email/billing');

// const multer = require("multer");

// const todoRoutes = express.Router();

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }))
// "start": "node --max-old-space-size=8000 server/server.js",
// var limit = _limit(options.limit || '100mb');
// app.use(connect.multipart({
//     limit: '1000mb'
// }));
// app.use(connect.bodyParser({
//     limit: '1000mb'
//   }));
// app.use(express.limit('8M'));
// app.use(express.bodyParser());

// import https packages

// const https = require('https');
// const fs = require('fs');

// const key = fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert'));
// const cert = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'));
// const server = https.createServer({ key: key, cert: cert }, app);

// var mqttHandler = require('./mqtt_handler');

// const jwt = require("jsonwebtoken");

// let User = require('./models/User.model');
// let Category = require('./models/category.model');
// let Challenges = require('./models/challenges.model');
// let Post = require('./models/myPost.model');
// let Workout = require('./models/workout.model');

// var mqttClient = new mqttHandler();
// mqttClient.connect();

// // Routes
// app.post("/send-mqtt", function(req, res) {
//   mqttClient.sendMessage(req.body.message);
//   mqttClient.receiveMessage();
//   res.status(200).send("Message sent to mqtt");
// });

// app.use('/mqtt', require('../routes/index'));

const swaggerOption = {
    swaggerDefinition: {
        info: {
            version: "1.0.0-Dash",
            title: 'Dash API',
            description: "API for Dash application",
            contact: {
                name: "Amazing Developer"
            },
            servers: ["https://dashchallengesapi.com"],
            host: "dashchallengesapi.com",
            basePath: '/'
        }
    },
    //['.routes/*.js]
    apis: ["server/Controllers/server_swagger.js"]
}

const swaggerDoc = swaggerJsDoc(swaggerOption);
app.use('/swagger-apis-UI', swaggerUi.serve, swaggerUi.setup(swaggerDoc))



if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.listen(PORT, function () {
    console.log("HTTP Server is running on Port: " + PORT + " Go to http://localhost:" + PORT)
    console.log(" Go to test Backend http://localhost:" + PORT + "/myapi")
    console.log(" Go to Swagger API Doc http://localhost:" + PORT + "/swagger-apis")
});


// // ROUTES
// app.get('/kkk', function (req, res) {
//     res.sendFile(__dirname + '/Resume/kkk/index.html');
// });

// app.use('/todos', todoRoutes);



// const httpsServer = https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app);

//   httpsServer.listen(httpsPORT, () => {
//         console.log("Server is running on Port: " + httpsPORT + " Go to https://localhost:" + httpsPORT)
//   });

// server.listen(httpsPORT, () => {
//     console.log("Server is running on Port: " + httpsPORT + " Go to https://localhost:" + httpsPORT)
// });


// // serve the API on 80 (HTTP) port
// const httpServer = http.createServer(app);

// httpServer.listen(httpPORT, () => {
//     console.log("HTTP Server is running on Port: " + httpPORT + " Go to http://localhost:" + httpPORT)
// });
