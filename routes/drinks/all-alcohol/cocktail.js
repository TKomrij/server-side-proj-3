const express = require('express');
const router = express.Router();
const Cocktail = require('../../../models/drinks/Cocktail')
const User = require("../../../models/User");

router.get("/cocktails", (request, response) => {
  Cocktail.find({})
      .then((cocktails)=> {
          response.json(cocktails)
      })
      .catch(error => {
          console.log(error)
        })  
})

router.get("/cocktails/:id", (request, response) => {
  
  Cocktail.findById(req.params.id)
      .then((cocktail)=> {
          response.json(cocktail)
      })
      .catch(error => {
          console.log(error)
        })  
})

router.post('/drinkdetails/favorite/:id', (req, res) => {
  let imageID = req.params.id;
  let userID = req.session.user._id;
  User.findById(req.session.user._id)
      .then((user) => {
      let {favorites} = user;
      if(favorites.includes(imageID)){
          User.updateOne({"_id": userID}, {"$pull": {"favorites": imageID}})
              .then((reponse) => {
              res.send({favorite: false})
              })
              .catch((err) => {
              console.log(err)
              })
      } else {
          User.updateOne({"_id": userID}, {"$push": {"favorites": imageID}}, {new: true})
          .then((response) => {
              res.send({favorite: true})
          })
          .catch((err) => {
              console.log(err)
          })
          }
  })
})

module.exports = router;