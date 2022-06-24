const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const User = require('../models/user')
const userController = require('../controllers/userController')

// GET ROUTES
router.get('/', auth, userController.homePage)
router.get('/login', userController.loginPage)
router.get('/register', userController.registerPage)
router.get('/error', userController.errorPage)
router.get('/delete/todo/:_id', async (req, res) => {
    const _id = req.params._id;

    let checkuser = req.cookies.username;

    let userFind = await User.findOne({ username: checkuser })
    console.log(userFind)


    let deletingTodo = User.updateOne({ username: checkuser }, { $pull: { todos: { _id: _id } } }).then(() => {
        console.log("Deleted")
        res.redirect("/")
    })
        .catch((err) => {
            console.log(err)
        })
})


// POST ROUTES
router.post('/register', express.urlencoded({ extended: true }), userController.addUser)
router.post('/login', express.urlencoded({ extended: true }), userController.login)
router.post('/to-do', express.urlencoded({ extended: true }), userController.addTodo);


module.exports = router