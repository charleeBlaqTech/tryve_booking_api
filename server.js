const express       = require('express');
const dotenv        = require('dotenv').config()
const cors          = require('cors')
const helmet        = require('helmet');
const morgan        = require('morgan');
const rateLimit     = require('express-rate-limit');
const fileUpload    = require("express-fileupload");
const cookieParser  = require("cookie-parser");
const {engine} = require('express-handlebars')
const path          = require("path");
const connectDb     = require('./src/config/database.setup')

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

// Request rate limiter per IP
// const limiter = rateLimit({
//     window: 15 * 60 * 1000,
//     maxHeaderSize : 100
// })

// APP MIDDLEWARES==================
// security middlewares
app.use(helmet());
app.use(morgan('dev'));
// app.use()
app.use(cors(corsOptions));

// requests middlewares
app.use(fileUpload({limits: { fileSize: 500 * 1024 * 1024 },})); // 500MB limit 
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static('public'));
app.use("/statics", express.static(path.join(__dirname, "public")));



//require each routes from the route folder
const registerRoute = require("./src/routes/registerRoute");
const loginRoute = require("./src/routes/loginRoute");
const usersRoute = require("./src/routes/userRoute");
const paymentRoute = require("./src/routes/paymentRoute");
const dashboardRoute = require("./src/routes/dashboardRoute");

// TEMPLATE-ENGINE=HBS
app.engine("hbs", engine({
    extname: ".hbs", defaultLayout: "main", runtimeOptions:{
        allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault:true
    }
}))
app.set("view engine", "hbs")


//====== Application available endpoints========//

app.get("/", (req, res) => {
  res.status(200).render('home');
});

app.use("/dashboard", dashboardRoute);
app.use("/register", registerRoute);
app.use("/auth", loginRoute);
app.use("/users", usersRoute);
app.use("/checkout", paymentRoute);



const port = process.env.PORT || 9090;

//server listening function...
app.listen(port, async () => {
  // await connectDb()
  console.log(`listening on port ${port} on the local serverrr`);
});
