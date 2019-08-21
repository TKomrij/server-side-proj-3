const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.model('user', new Schema ({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    // favorites: Array
    }, 
    {
    timestamps: true
    }
));

module.exports = userSchema;