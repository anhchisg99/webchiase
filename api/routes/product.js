
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Product = require('../models/product');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../../config/auth');
const LocalStrategy = require('passport-local').Strategy;

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


  router.get("/", (req, res, next) => {
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

router.get('/product',(req,res)=>{
    Product.find().then(kq=>{console.log(kq)});
})
router.get('/product123',(req,res)=>{
  res.send('vui');
});
router.post("/posts", upload.single('productimage'), (req, res, next) => {
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
      res.redirect('/trangchu');
  });
//   router.get("/posts",(req,res)=>{
//       if(req.isAuthenticated()){
//         res.render('dashboard');

//       }
//       else{
//           res.redirect('/trangchu')
//       }
      
//   })

  
    





// app.get('/vuibuon',(req,res)=>{
//     const cat = new Cat({
//         name:'cuongcuoi',
//         tuoi:'kocuoi'
//     });
//     cat.save((err)=>{
//         if(err){
//             console.log('loi');
//         }else{
//             console.log('ko loi');
//         }
//     })
// })



    
// })


module.exports = router;