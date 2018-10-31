var router = require('express').Router();
var Post = require('../db/db').Post;
var request = require('request');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.userId + '-' + Date.now()+file.originalname)
    }
})
var upload = multer({storage : storage});
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
    Post.aggregate([{
        $sort : { timestamp : 1}
    }]).then(posts => {
        res.status(200).json({
            status : 'success',
            posts : posts.map((val) => {
                return {
                    ...val,
                    isLiked : val.likedBy.includes(req.user.userId)
                }
            })
        })
    }).catch(err => {
        res.status(200).json({
            status : 'error',
            message : err.errMsg
        })
    })
})
router.post('/upload/:userId', upload.single('post'), function(req, res){
    if(req.body.caption && (req.file || req.body.imageLink)){
        if(req.body.imageLink){
            let filelocation =  path.join(__dirname,'..', 'public', 'uploads', req.params.userId+'-'+new Date().getTime()+'.'+req.body.imageLink.split('.').pop());
            request(req.body.imageLink).pipe(fs.createWriteStream(filelocation));
            req.body.imageLink = filelocation.replace(/^.+public/, '');
        }
        var post = new Post({
            caption : req.body.caption,
            imageURL : req.file ? req.file.path.replace(/^public/ , '') : req.body.imageLink,
            postedBy : req.params.userId,
            likedBy :[],
            comments : []
        })
        post.save(function(err){
            if(err){
                res.status(200).json({
                    status : 'error',
                    message : err
                })
            }else{
                res.status(200).json({
                    status : 'success',
                    message : 'saved'
                })
            }
        })
    }else{
        res.status(200).json({
            status : 'error',
            message : 'parameter missing'
        })
    }
});
router.post('/:postId/like/:userId', function(req, res){
    if(req.params.postId && req.params.userId){
        Post.findOne({postId : req.params.postId}, function(err, data){
            if(err){
                res.status(200).json({
                    status : 'error',
                    message : 'internal error'
                })
            }else{
                if(data.postId){
                    var { likedBy } = data;
                    likedBy.push(req.params.userId);
                    if(!likedBy.includes(req.params.userId)){
                        Post.updateOne({postId : req.params.postId}, {
                            $set : {likedBy : likedBy}
                        }, function(err, data){
                            if(err){
                                res.status(200).json({
                                    status : 'error',
                                    message : 'internal error'
                                })
                            }else{
                                res.status(200).json({
                                    status : 'success',
                                    message : 'liked'
                                })
                            }
                        })
                    }else{
                        res.status(200).json({
                            status : 'error',
                            message : 'already liked'
                        })
                    }
                }else{
                    res.status(200).json({
                        status : 'error',
                        message : 'invalid post'
                    })
                }
            }
        });
    }else{
        res.status(200).json({
            status : 'error',
            message : 'missing parameter'
        })
    }
})


router.post('/:postId/unlike/:userId', function(req, res){
    if(req.params.postId && req.params.userId){
        Post.findOne({postId : req.params.postId}, function(err, data){
            if(err){
                res.status(200).json({
                    status : 'error',
                    message : 'internal error'
                })
            }else{
                if(data.imageURL){
                    var { likedBy } = data;
                    console.log(likedBy);
                    console.log(req.params.userId);
                    if(likedBy.includes(parseInt(req.params.userId))){
                        Post.updateOne({postId : parseInt(req.params.postId)}, {
                        $set : {likedBy : likedBy.filter( val => val !== parseInt(req.params.userId))
                        }}, function(err, data){
                            if(err){
                                res.status(200).json({
                                    status : 'error',
                                    message : 'internal error'
                                })
                            }else{
                                res.status(200).json({
                                    status : 'success',
                                    message : 'unliked'
                                })
                            }
                        })
                    }else{
                        res.status(200).json({
                            status : 'error',
                            message : 'already unliked'
                        })
                    }
                }else{
                    res.status(200).json({
                        status : 'error',
                        message : 'invalid post'
                    })
                }
            }
        });
    }else{
        res.status(200).json({
            status : 'error',
            message : 'missing parameter'
        })
    }
})


router.post('/:postId/comment/:userId', function(req, res){
    if(req.params.postId && req.params.userId && req.body.comment){
        Post.findOne({postId : req.params.postId}, function(err, data){
            if(err){
                res.status(200).json({
                    status : 'error',
                    message : 'internal error'
                })
            }else{
                if(data.postId){
                    Post.updateOne({
                        postId : req.params.postId
                    }, {
                        $addToSet : { comments : {
                            comment : req.body.comment,
                            commentedBy : req.params.userId,
                            commentedByName : req.user.firstname + ' ' + req.user.lastname,
                        }}
                    }, function(err, data){
                        if(err){
                            console.log(err)
                            res.status(200).json({
                                status : 'error',
                                message : err
                            })
                        }else{
                            res.status(200).json({
                                status : 'success',
                                comment : 'commented'
                            })
                        }
                    })
                }else{
                    res.status(200).json({
                        status : 'error',
                        message : 'invalid post'
                    })
                }
            }
        });
    }else{
        res.status(200).json({
            status : 'error',
            message : 'missing parameter'
        })
    }
})

module.exports = router;