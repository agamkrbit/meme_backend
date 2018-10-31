var mongoose = require('mongoose');
var autoIncrement =  require('mongoose-sequence')(mongoose);
var commentModel = require('./comment');
var postModel = new mongoose.Schema({
    caption : { type : String, required : true},
    imageURL : { type : String, required : true},
    timestamp : { type : Date, required : true, default : new Date().toISOString()},
    postedBy : { type : Number, required : true},
    likedBy :[Number],
    comments : [commentModel]
})
postModel.plugin(autoIncrement, {inc_field: 'postId'})
module.exports = postModel;