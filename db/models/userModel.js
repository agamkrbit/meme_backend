var mongoose = require('mongoose');
var autoIncrement =  require('mongoose-sequence')(mongoose);
var userModel = new mongoose.Schema({
    firstname : { type : String, required : true},
    lastname : { type : String, required : true},
    email : { type : String, required : true},
    password : { type : String, required : true}
})
userModel.plugin(autoIncrement, {inc_field: 'userId'})
module.exports = userModel;