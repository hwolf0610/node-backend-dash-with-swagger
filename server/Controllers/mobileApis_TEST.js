var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
var Jsonwebtoken;

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)  2073600s
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '2073600s' });
    // //no expired token
    // jwt.sign({email:'sivamanismca@gmail.com',role:'User'}, "Secret", {});
}

//Mobile API Test with HTTP Methods
router.get('/test', function (req, res) {
    Jsonwebtoken = generateAccessToken({ UserID: "WELCOME GET" });
    res.status(200).json({
        'status': 200,
        'message': 'WELCOME GET',
        'data': 'Received a GET HTTP method',
        'JwtWebToken': Jsonwebtoken,
        "UUID": Math.random().toString().replace("0.", "")
    });
});

router.post('/test', (req, res) => {
    Jsonwebtoken = generateAccessToken({ UserID: "WELCOME POST" });
    res.status(200).json({
        'status': 200,
        'message': 'WELCOME POST',
        'data': 'Received a POST HTTP method',
        'JwtWebToken': Jsonwebtoken,
        "UUID": Math.random().toString().replace("0.", "")
    });
});

router.put('/test', (req, res) => {
    Jsonwebtoken = generateAccessToken({ UserID: "WELCOME PUT" });
    res.status(200).json({
        'status': 200,
        'message': 'WELCOME PUT',
        'data': 'Received a PUT HTTP method',
        'JwtWebToken': Jsonwebtoken,
        "UUID": Math.random().toString().replace("0.", "")
    });
});

router.delete('/test', (req, res) => {
    Jsonwebtoken = generateAccessToken({ UserID: "WELCOME DELETE" });
    res.status(200).json({
        'status': 200,
        'message': 'WELCOME DELETE',
        'data': 'Received a DELETE HTTP method',
        'JwtWebToken': Jsonwebtoken,
        "UUID": Math.random().toString().replace("0.", "")
    });
});

module.exports = router;