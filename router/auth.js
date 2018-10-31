var router = require('express').Router();
var User = require('../db/db').User;
var jsonwebtoken = require('jsonwebtoken');

router.post('/login', function(req, res){
    if(req.body.username && req.body.password){
        User.findOne({email : req.body.username , password : req.body.password},
            function(err, data){
                if(err){
                    res.status(200).json({
                      status : 'error',
                      message : 'db error'  
                    })
                }else{
                    if(data){
                        jsonwebtoken.sign({
                            firstname : data.firstname,
                            lastname : data.lastname,
                            email : data.email,
                            userId : data.userId
                        }, 'memeapp', function(err, token){
                            if(err){
                                res.status(200).json({
                                    status : 'error',
                                    message : 'internal error'
                                })
                            }else{
                                var user = {
                                    firstname : data.firstname,
                                    lastname : data.lastname,
                                    email : data.email,
                                    userId : data.userId
                                };
                                res.status(200).json({
                                    status : 'success',
                                    token : token,
                                    user : user
                                })
                            }
                        })
                    }else{
                        res.status(200).json({
                            status : 'error',
                            message : 'username or password did not matched'
                        })
                    }
                }
            }
        )
    }else{
        res.status(200).json({
            status : 'error',
            message : 'missing parameters'
        })
    }
})

router.post('/signup', function(req, res){
    var {
        firstname,
        lastname,
        email,
        password,
        confirmPassword
    } = req.body;
    if(firstname && lastname && email && password && confirmPassword){
        if(!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)){
            res.status(200).json({
                status : 'error',
                message : 'invalid email'
            })
        }else if(password !== confirmPassword){
            res.status(200).json({
                status : 'error',
                message : 'password shoudl matched'
            })
        }else{
            User.findOne({email : email}, function(err, data){
                if(err){
                    res.status(200).json({
                        status : 'error',
                        message : 'db error'
                    })
                }else{
                    if(data){
                        res.status(200).json({
                            status : 'error',
                            message : 'already exists'
                        })
                    }else{
                        var user = new User({
                            firstname,
                            lastname,
                            email,
                            password
                        })
                        user.save(function(err, data){
                            if(err){
                                res.status(200).json({
                                    status : 'error',
                                    message : 'internal error'
                                })
                            }else{
                                console.log(data);
                                jsonwebtoken.sign({
                                    firstname : data.firstname,
                                    lastname : data.lastname,
                                    email : data.email,
                                    userId : data.userId
                                } ,  'memeapp', function(err, token){
                                    if(err){
                                        res.status(200).json({
                                            status : 'error',
                                            message : err
                                        })
                                    }else{
                                        console.log(token);
                                        res.status(200).json({
                                            status : 'success',
                                            token : token,
                                            user : {
                                                firstname,
                                                lastname,
                                                email,
                                                userId : data.userId
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }else{
        res.status(200).json({
            status : 'error',
            message : 'missing parameter'
        })
    }
})

module.exports = router;