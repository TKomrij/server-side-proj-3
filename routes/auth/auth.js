const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../../models/User");

var createError = require('http-errors');

// signup
router.post("/signup", (req, res) => {
    
  
    const bcryptSalt = 10;
    const {firstname, lastname, email, password} = req.body
    
    if(!firstname || !lastname|| !email || !password) {
        res.status(400).json({
            errorMessage: "Please fill in all the credentials"
        });
    }
    if(password.length < 4) {
        
        res.status(400).json({
            errorMessage: "Please fill in a password longer than 4 characters"
        });
    }

    User.findOne({"email" : email})
    .then(user => {
     
        if(!user == null) {
            res.status(400).json({
                errorMessage: "This email address is already in use. Please choose a different one"
            })
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashPass
        })
        newUser.save()
        .then(aNewUser => {
            
            req.session.currentUser = aNewUser;

            res.status(200).json(`${aNewUser.firstname} ${aNewUser.lastname}`
            )
        })
        .catch(err => console.log('err' + err));



    })
    .catch(err => console.log('err' + err));
})

  
  // Fill login page
  router.post("/login", (req,res,next)=> {
     
    User.findOne({email: req.body.email})
        .then((user)=> {
            
            if(!user) next(createError(401), "Invalid credentials.");
            else if (bcrypt.compareSync(req.body.password, user.password)) {

                req.session.currentUser = user;

                res.status(200).json(`${user.firstname} ${user.lastname}`
                );
            } else {    
                next(createError(401, "Invalid credentials."))
            }
            
        })
        .catch((error)=> {
            next(createError(500));
        })
})
  
router.post('/logout', function(req, res, next) {
    console.log(`req session ${req.session}`)
    if (req.session) {
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.status(200).send("User successfully logged out");
        }
      });
    }
    
  });
  
  module.exports = router
  