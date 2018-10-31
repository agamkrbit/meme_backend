var router = require('express').Router();
var Custom = require('../db/db').Custom;
var jsonwebtoken = require('jsonwebtoken');

router.use('/', function(req, res, next){
    let bearer = req.headers.authorization || '';
    let bearerToken = bearer.split(' ')[1];
    if(bearerToken){
        jsonwebtoken.verify(bearerToken, 'memeapp', function(err, decode){
            if(err){
                res.status('200').json({
                    status : 'error',
                    message : 'unauthorized'
                })
            }
            req.user = decode;
            next();
        })
    }else{
        res.status('200').json({
            status : 'error',
            message : 'unauthorized'
        })
    }
})

router.get('/all', function(req, res){
    Custom.find(function(err, data){
        if(err){
            res.status(200).json({
                status : 'error',
                message : 'internal error'
            })
        }else{
            console.log(data);
            res.status(200).json({
                status : 'success',
                custom : data.map(val => ({
                    customId : val.customId,
                    imageLink : val.imageLink,
                    text : val.text
                })) || []
            })
        }
    })
})

module.exports = router;