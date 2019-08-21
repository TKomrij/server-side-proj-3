const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
var createError = require('http-errors')
require('dotenv').config();

mongoose.connect('mongodb://localhost/drinks', {useNewUrlParser: true}, (err)=> {
    if(err) console.log("ERROR EROROROR", err)
    else console.log("connected")
});

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));


app.use(session({
  secret: 'some secret goes here',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 60*60,
    maxAge: 60000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: (14 * 24 * 60 * 60) 
})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));



app.use((req,res,next)=> {
  console.log("check", req.session.user)
  next()
})

app.use("/", express.static('doc'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

// routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/auth/auth'))
app.use('/api', require('./routes/drinks/all-alcohol/cocktail'));
app.use('/profile', require('./routes/profile'));


app.use((req,res, next)=> {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  if(err)res.status(err.status).json({message: err.message})
  else res.status(500).json({message: "Oeeeps, something went wrong."})
})


app.listen(process.env.PORT, ()=> {
  console.log("App listening");
})
