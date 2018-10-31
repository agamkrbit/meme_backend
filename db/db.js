var mongoose = require('mongoose');
//models
var userModel = require('./models/userModel');
var postModel = require('./models/postModel');
var customModel = require('./models/customModel');
mongoose.connect('mongodb://agam:agamkr123@cluster0-shard-00-00-9hkbn.mongodb.net:27017,cluster0-shard-00-01-9hkbn.mongodb.net:27017,cluster0-shard-00-02-9hkbn.mongodb.net:27017/meme?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('open', function(){
    console.log('connected');
})
db.on('error', err => console.log(err));

var User = mongoose.model('user', userModel);
var Post = mongoose.model('post', postModel);
var Custom = mongoose.model('custom', customModel);

module.exports = {
    User,
    Post,
    Custom
}
