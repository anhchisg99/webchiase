
const express = require("express");
const router = express.Router();

const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated,forwardAuthenticated } = require('../../config/auth');
// const Product = require('../models/user');
// Load User model
// Load User model
const User = require('../models/user');
const Product = require('../models/product');

//login page
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login');
});
//register page
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render('register');
})
//register handle
router.post('/register',(req,res)=>{
    const {name, email,password} = req.body;
    let errors = [];
    if (!name || !email || !password ) {
        errors.push({ msg: 'Please enter all fields' });
      }
    
     
      if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
      }
    
      if (errors.length > 0) {
        res.render('register', {
          errors,
          name,
          email,
          password,
        
        });
      } else {
        User.findOne({ email: email }).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              errors,
              name,
              email,
              password,
             
            });
          } else {
            const newUser = new User({
              name,
              email,
              password
            });
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
})
// Login

  
//   router.post('/login',(req,res,next)=>{
//     User.findOne({
//         email: req.body.email
//       }).then(user => {
//         if (!user) {
//           res.send('sai ');
//         }
    
//         // Match password
//         bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
//           if (err) throw err;
//           if (isMatch) {
//               console.log('thanhcong');
//               res.cookie('userId',user._id);
//             res.redirect('/dashboard');
//           } else {
//             return done(null, false, { message: 'Password incorrect' });
//           }
//         });
//       });
//   })
  
// Logout
router.get('/logout', (req, res) => {
    req.logout();
    
    res.redirect('/users/login');
  });
  
//change
router.get('/change/:id',(req,res)=>{
    Product.findByIdAndRemove({_id:req.params.id}).then((kq)=>{
        console.log(kq);
        res.redirect('/users/change');
    })
    
    
});
router.get('/change',(req,res)=>{
    Product.find().then(kq=>{
        res.render('change',{product1:kq})

    });
    
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

module.exports = router;