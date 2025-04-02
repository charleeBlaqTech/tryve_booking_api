const express       = require('express');
const dotenv        = require('dotenv').config()
const cors          = require('cors')
const helmet        = require('helmet');
const morgan        = require('morgan');
const compression   = require('compression')
const rateLimit     = require('express-rate-limit');
const fileUpload    = require("express-fileupload");
const cookieParser  = require("cookie-parser");
const {engine} = require('express-handlebars')
const path          = require("path");
const connectDb     = require('./src/config/database.setup')
const logger = require("./src/utils/logger");

const app = express();

// creating cors options for accepted urls
const cors_array = process.env.ACCEPTED_URL;
const whitelist = cors_array || ["http://localhost:3000/"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS"));
    }
  },
  credentials: true,
};



// APP MIDDLEWARES==================
// security middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(compression())
app.use(cors(corsOptions));

// requests middlewares
app.use(fileUpload({limits: { fileSize: 500 * 1024 * 1024 },})); // 500MB limit 
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static('public'));
app.use("/statics", express.static(path.join(__dirname, "public")));
app.use((req, res, next) => { logger.info(`${req.method} ${req.url} - ${req.ip}`); next(); });

// TEMPLATE-ENGINE=HBS
app.engine("hbs", engine({
    extname: ".hbs", defaultLayout: "main", runtimeOptions:{
        allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault:true
    }
}))
app.set('views', path.join(__dirname, 'src/views'));
app.set("view engine", "hbs")


//====== Application available endpoints========

//require each routes from the route folder
const registerRoute = require("./src/routes/registerRoute");
const authRoute = require("./src/routes/authRoute");
const usersRoute = require("./src/routes/userRoute");
const adminRoute = require("./src/routes/adminRoute");
const eventRoute = require("./src/routes/eventRoute");
const artistRoute = require("./src/routes/artistRoute");
const dashboardRoute = require("./src/routes/dashboardRoute");

// ENPOINTS PATHS=================================
app.get("/", (req, res) => {res.status(200).render('home')});
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/register", registerRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/event", eventRoute);
app.use("/api/v1/artist", artistRoute);





//server listening function...
const port = process.env.PORT || 9090;
app.listen(port, async () => {
  await connectDb()
  console.log(`listening on port ${port} on the local serverrr`);
});
