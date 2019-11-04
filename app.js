const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const secret = require('./secretValues');
const LocalStrategy = require('passport-local').Strategy;
const Session = require('./models/session');
const compression = require('compression');


// ###### CONNECT TO THE DB

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// Set connection to database.
// userNewUrlParser is necessary to prevent mongodb warnings.
mongoose.connect(secret.dbConnection, {
  useNewUrlParser: true,
   useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);



// ###### REQUIRE ROUTES

const indexRoute = require('./routes/index');
const userRoute = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const pointRoutes = require('./routes/points');
const habitRoutes = require('./routes/habits');
const projectRoutes = require('./routes/projects');
const categoryRoutes = require('./routes/categories');



// ###### CONFIGURE EXPRESS

const app = express();

// To reduce final file size.
app.use(compression());

//static files
app.use(express.static('./public'));

// Set body parser middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());

// Set express session.
app.use(session({
  secret: secret.sessionSecret,
  saveUninitialized: true,
  resave: true
}));

// Init passport.
app.use(passport.initialize());
app.use(passport.session());

//Set up express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    let namespace = param.split('.'), root = namespace.shift(), formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }

    return{
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Set up flash and global variables.
app.use(flash());
app.use(function (req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//set up template engine.
app.set('view engine', 'ejs');

//set up routes
indexRoute(app);
userRoute(app);
pointRoutes(app);
taskRoutes(app);
habitRoutes(app);
projectRoutes(app);
categoryRoutes(app);

//Error handling middleware
app.use(function(err,req,res,next){
  console.log(err.message);
  res.status(422).send({error:err.message});
});

//listen to port
let port = process.env.PORT;
if(port == null || port == ""){
  port = 8000;
}
const server = app.listen(port);
console.log("Listening to port 8000.");



// ###### SET UP SOCKET IO
// Used to prevent that a same users initiates two or more sessions
// in the applicaction at the same time.

//Attach IO to server
const SocketIO = require('socket.io');
const io = SocketIO(server);

// Listen for new connections
io.on('connection', (socket) => {

  // User sends back it's own user id value as
  // soon as the connection is made.
  socket.on('connected', (data) => {

    //We check if a session with such user id exists in the database.
    Session.getSessionByUserId(data.userId, function(err, session){
      if(err) throw err;

      //If the session does not exist,
      //we add the session to the database and do noting else.
      if(!session){

        let request = {userId: data.userId, socketId : socket.id};

        Session.saveSession([request], function(err, savedSession){
          if (err) return next(err);
        });

      //If the session exists, request the other socket to log out
      //and modify the socket id info of the existing session.
      }else{

        if(session.socketId!=socket.id){
          io.to(session.socketId).emit('disconnect',{});
          Session.patchById(session._id, {socketId: socket.id}, function(err, updatedSession){
            if (err) return next(err);
          });
        }
      }
    });
  });
});
