const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    todos: [{
        todo: String
    }]
}, {
    collection: 'Users'
})

module.exports = mongoose.model('User', userSchema)