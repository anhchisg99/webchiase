
const express = require("express");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const multer = require('multer');
const bodyParser  = require('body-parser');
//const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const Product = require('./api/models/product');
// Passport Config
require('./config/passport')(passport);
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
//ejs

//cookie parser
//app.use(cookieParser());
//swagger
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "4.1.4",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: ["http://localhost:2000"]
      }
    },
    // ['.routes/*.js']
    apis: ["app.js"]
  };
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /test/aproduct:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/customers", (req, res) => {
    res.status(200).send("Customer results");
  });
  /**
 * @swagger
 * /test/euser:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *      description: A successful response
 */
  /**
   * @swagger
   * /customers:
   *    post:
   *      description: Use to return all customers
   *    parameters:
   *      - name: customer
   *        in: query
   *        description: Name of our customer
   *        required: false
   *        schema:
   *          type: string
   *          format: string
   *    responses:
   *      '201':
   *        description: Successfully created user
   * 
   */
  
  /**
 * @swagger
 * /test/euser/{id}:
 *  get:
 *    summary: Get user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer
 *    responses:
 *      '201':
 *         description: Sussessfully
 *             
 */
 /**
 * @swagger
 * /test/achange/{id}:
 *  get:
 *    summary: Delete Product by Id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer
 *    responses:
 *      '201':
 *         description: Sussessfully delete product
 *             
 */
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  // Connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
//ejs
app.set("view engine","ejs");
app.set("views","./views")
mongoose.Promise = global.Promise;
//connect mongoose 
//mongodb+srv://chi_duong:<haivlk123>@tm-wc4xv.mongodb.net/<batdaulai>?retryWrites=true&w=majority
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/batdaulai',{useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://localhost:27017/batdaulai', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected',()=>{
    console.log('da ket noi');
})
app.use('/uploads', express.static('uploads'));
app.get('/',(req,res)=>{console.log('vuii')});
const product = require('./api/routes/product');
app.use('/api',product);

const user = require('./api/routes/user');
app.use('/users/',user);

app.use('/', require('./api/routes/index'));

//ejs
const testapi = require('./api/routes/apitester');
app.use('/test/',testapi);


app.get('/trangchu',(req,res)=>{
    Product.find({}).then(kq=>{
        res.render("trangchu", {product:kq});
    })

   
})

const port = process.env.PORT || 2000;

app.listen(port, () => console.log(`Server started on port ${port}`));