var mongoose = require('mongoose');
var autoIncrement =  require('mongoose-sequence')(mongoose);
var commentModel = new mongoose.Schema({
    comment : { type : String, required : true},
    commentedBy : { type : Number, required: true},
    commentedByName : { type : String, require : true},
    timestamp : { type : Date, required : true , default : new Date().toISOString()}
})
commentModel.plugin(autoIncrement, {inc_field: 'commentId'})
module.exports = commentModel;