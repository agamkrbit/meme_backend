var router = require('express').Router();
var User = require('../db/db').User;
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

router.get('/details', function(req, res){
    User.findOne({email : req.user.email}, function(err, data){
        if(err){
            res.status(200).json({
                status : 'error',
                message : 'internal error'
            })
        }else{
            if(!data){
                res.status(200).json({
                    status : 'error',
                    message : 'Please Sign In'
                })
            }else{
                res.status(200).json({
                    status : 'success',
                    user : {
                        firstname : data.firstname,
                        lastname : data.firstname,
                        email : data.email,
                        userId : data.userId
                    }
                })
            }
        }
    })
})

module.exports = router;