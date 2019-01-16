require("dotenv").config();

const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const passportConfig = require("./passport-config");
const sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1.21e+9 }
};


module.exports = {
     init(app, express){
     app.set("views", viewsFolder);
     app.set("view engine", "ejs");
     app.use(bodyParser.urlencoded({ extended: true }));
     app.use(express.static(path.join(__dirname, "..", "assets")));
     app.use(expressValidator());
     if (process.env.NODE_ENV === 'production') {
       app.set('trust proxy', 1) // trust first proxy
       sess.cookie.secure = true // serve secure cookies
     }
     app.use(session(sess));
     app.use(flash());
     passportConfig.init(app);
     app.use((req,res,next) => {
        res.locals.currentUser = req.user;
        next();
      })
  }
};
