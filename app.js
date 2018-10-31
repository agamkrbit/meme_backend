var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

//routers
var authRouter = require('./router/auth');
var postRouter = require('./router/post');
var customRouter = require('./router/custom');
var userRouter = require('./router/user');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/custom', customRouter);
app.use('/user', userRouter);

app.listen(3030, console.log('listing to port 3030'));