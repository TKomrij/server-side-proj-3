const express = require("express");
const router = express.Router();
// const axios = require ('axios');


// router.get('/profile/:id', function (req, res) {
//     User.findById(req.params.id)
//     .then(oneUser => {
//         const favorites = oneUser.favorites
//         console.log(`favorites ${favorites}`)
//         var getPromises = [];
//         for (i=0; i< favorites.length; i++){
//             getPromises.push(axios.get('REACT_APP_API/profile/${favorites[i]}`).then(response => response.data))
//         }

//         Promise.all(getPromises)
//         .then ((response) =>{
//             res.render('profile', {favorites : response, user: oneUser});
//         })
//         .catch((error)=> {
//             console.log(error)
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })


router.get("/profile", (req,res, next)=> {
    
    res.status(200).json(req.session.user);
})


module.exports = router;