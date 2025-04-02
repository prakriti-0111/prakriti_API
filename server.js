const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const http = require('http');
const https = require(`https`);
const socketIO = require('socket.io');
const path = require('path');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require('fs');
const Pusher = require("pusher");
require('module-alias/register');
require('dotenv').config()

const app = express();
app.use(helmet());
const router = express.Router();

const corsConfig = require('./config/cors.config');
app.use(cors(corsConfig.corsOptions));
// app.use(cors())

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: "50mb"}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/public/uploads', express.static('public/uploads'));
app.use('/public/uploads/products', express.static('public/uploads/products'));
app.use('/public/user_image', express.static('public/user_image'));
app.use('/public/invoices', express.static('public/invoices'));
app.use('/public/images', express.static('public/images'));
app.use('/public/salaries', express.static('public/salaries'));

const swaggeroptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ratan Vihar API',
      version: '1.0.0',
    },
  },
  apis: ['./app/routes/app/*.routes.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(swaggeroptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification, { explorer: true })
);

/**
 * Pusher initialize
 */
const pusher = new Pusher({
  appId: "1331621", //"1495977",
  key: "09f950cd54a3bae697ec", //"f618012d7514b9b54d03",
  secret: "675fe2d11d89d687f2f0", //"4574eb2b2610191007ec",
  cluster: "ap2",
  useTLS: true
});


app.use((req, res, next) => {
  req.io = io;
  req.pusher = pusher;
  return next();
});


/**
 * log routes & time taken
 */
const { demoLogger } = require('./app/middlewares');
app.use(demoLogger);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to our PRAKRITI API application server."});
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

/**
 * Routes
 */
//super admin
require("./app/routes/superadmin.routes")(app, express);

//admin
require("./app/routes/admin.routes")(app, express);

//distributor
require("./app/routes/distributor.routes")(app, express);

//sales executive
require("./app/routes/sales_executive.routes")(app, express);

//retailer
require("./app/routes/retailer.routes")(app, express);

//customer
require("./app/routes/customer.routes")(app, express);

//supplier
require("./app/routes/supplier.routes")(app, express);

//manager
require("./app/routes/manager.routes")(app, express);

//employee
require("./app/routes/employee.routes")(app, express);

//team
require("./app/routes/team.routes")(app, express);



/**
 * Socket Server
 */
let server = http.createServer(app);
// let server;
// if(process.env.IS_SSL_ON == "true"){
//   const https_options = {
//     key: fs.readFileSync( process.env.SSLCertificateKey),
//     cert: fs.readFileSync(process.env.SSLCertificateFile)
//   };
//   server = https.createServer(https_options, app);
// }else{
//   server = http.createServer(app);
// }

let io = socketIO(server)
io.sockets.on('connection', function (socket) {
  socket.on('echo', function (data) {

  });
});


//set timezone
process.env.TZ = "Asia/Calcutta";

// set port, listen for requests
const PORT = process.env.PORT;
//server.listen(PORT)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
}).on('error', (error) => { 
  console.log(`Something wrong`, error);
  log = JSON.stringify(error);
  fs.appendFile("logs/request_logs.txt", log + "\n", err => {
    if (err) {
      console.log(err);
    }
  });
});

