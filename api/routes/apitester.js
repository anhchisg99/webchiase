const express = require("express");
const router = express.Router();
const multer = require('multer');

//data base
const Product = require('../models/product');
const User = require('../models/user');
//multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

//tim san pham
router.get("/aproduct", (req, res, next) => {
    Product.find()
      .select("name price _id productimage sdt")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              sdt: doc.sdt,
              productimage: doc.productimage,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:2000/products/" + doc._id
              }
            };
          })
        };
        //   if (docs.length >= 0) {
        res.status(200).json(response);
        //   } else {
        //       res.status(404).json({
        //           message: 'No entries found'
        //       });
        //   }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  // post san pham 
  router.post("/apost", upload.single('productimage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
      
      name: req.body.name,
      price: req.body.price,
      sdt : req.body.sdt,
      productimage: req.file.path
      
     
    });
    product
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
              name: result.name,
              price: result.price,
              sdt : result.sdt,
              _id: result._id,
              request: {
                  type: 'GET',
                  url: "http://localhost:2000/products/" + result._id
              }
          }
        });
        
        
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
      
  });
  // xoa san pham
  router.get('/achange/:id',(req,res)=>{
    Product.findByIdAndRemove({_id:req.params.id}).then((kq)=>{
        if(kq){
            res.send('xoa thanh cong');
            return;
        }else{
            res.send('... ');
            return;
        }
        
    })
    
    
});

router.get('/euser/:id',(req,res)=>{
    User.findById({_id:req.params.id})
    .select("name email role _id")
    .exec()
    .then(docs => {
     res.send(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    
});
router.get('/euser',(req,res)=>{
    User.find().then(kq => res.send(kq));

});
module.exports = router;