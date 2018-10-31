var mongoose = require('mongoose');
var autoIncrement =  require('mongoose-sequence')(mongoose);
var customModel = new mongoose.Schema({
    imageLink : { type : String, required : true},
    text : [String],
    timestamp : { type : Date, required : true , default : new Date().toISOString()}
})
customModel.plugin(autoIncrement, {inc_field: 'customId'})
module.exports = customModel;