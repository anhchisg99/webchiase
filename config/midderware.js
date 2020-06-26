// var user = require('../api/models/user');


// module.exports.requireAuth = function(req,res,next){
//     if(!req.cookies.userId){
//         res.redirect('/users/login');
//         return;
//     }
//      user.findById({_id:req.cookies.userId},(err,user)=>{
//          if(err)
        
//          throw err;
         
//          if(user){

         
//               res.redirect('/dashboard');
//               return;
             
//          }
//      });
//      next();
// };