const registerUser = require('../models/register')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { append } = require('express/lib/response');
require('dotenv').config()
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

JWT_SECRET = process.env.JWT_SECRET

// GET HOME
const homePage = async (req, res) => {
    let username = req.cookies.username
    let firstname = req.cookies.firstname
    let lastname = req.cookies.lastname
    let fullName = `${firstname} ${lastname}`

    let email = req.cookies.email

    let usercheck = await User.findOne({username: username})

    const allTodos = usercheck.todos



    res.render('home', { username, fullName, firstname, lastname, email, allTodos })
}

// GET LOGIN
const loginPage = (req, res) => {
    res.status(200)
    res.render('login', { body: '' })

}

// GET REGISTER
const registerPage = (req, res) => {
    res.status(200)
    res.render('register', { body: '' })
}

// GET ERROR
const errorPage = (req, res) => {
    res.render('error', message)
}

// POST REGISTER
const addUser = async (req, res) => {
    let username = req.body.username.trim()
    let password = req.body.password.trim()
    let email = req.body.email.trim()
    let firstname = req.body.firstname.trim()
    let lastname = req.body.lastname.trim()

    // clone password to verify - not necessary but it helps me not to mess up
    let passwordVerify = password

    let userFind = await User.findOne({ username: username })
    if (userFind) {
        res.redirect('error', { message: `This Username already exist!` })
    }
    if (!passwordVerify) {
        res.redirect('error', { message: `Invalid Username or Password.` })
    }
    if (passwordVerify.length < 5) {
        res.redirect('error', { message: `Password too small! Should be atleast 6 characters.` })
    }

    // Hashing the verified password with the original let
    password = await bcrypt.hashSync(req.body.password.trim(), 10)

    // Creating a greeting massage in the todo array
    let todos = [{todo: `Hello, ${firstname}! We are glad to see you're here, let's start creating your to-do list?`}]


    // Storing user infos in database
    try {
        const response = await registerUser.create({
            username,
            password,
            firstname,
            lastname,
            email,
            todos
        })
        /* console.log(`User created successfuly. ${response}`) */
        res.redirect('/')
    } catch (error) {
        throw error
    }
}


// POST LOGIN
const login = async (req, res) => {
    // GETING THE INPUTS
    let username = req.body.username.trim()
    let password = req.body.password.trim()

    // FINDING THE USER
    let userFind = await User.find({ username })

    if (!userFind) {
        res.redirect('error', { message: `Invalid Username or Password.` })
    }

    if (userFind) {
        // GETTING THE DATA INFO
        let userFinder = await User.findOne({ username: username })

        if (!userFinder) {
            res.render('/error', { message: `Invalid Username or Password.` })
        }
        let savedUsername = userFinder.username
        let savedPassword = userFinder.password



        // TURN ON THE MAX AGE TO USER SAFETY
        if (await bcrypt.compareSync(password, savedPassword)) {
            const token = jwt.sign({ username: savedUsername }, JWT_SECRET)
            res.cookie('token', token, { /* maxAge: 900000, */ httpOnly: true })
            res.cookie('username', userFinder.username, { /* maxAge: 900000, */ httpOnly: true })
            res.cookie('firstname', userFinder.firstname, { /* maxAge: 900000, */ httpOnly: true })
            res.cookie('lastname', userFinder.lastname, { /* maxAge: 900000, */ httpOnly: true })
            res.cookie('email', userFinder.email, { /* maxAge: 900000, */ httpOnly: true })

            res.status(200)
            res.redirect('/')
        } else {
            res.status(400)
            res.render('error', { message: `Invalid Username of Password.` })
        }
    } else {
        res.render('error', { message: `Invalid Username of Password.` })
    }
}

// POST TODO
const addTodo = async (req, res) => {
    let todo = req.body.todoValue;
    let checkuser = req.cookies.username;
    let userFind = await User.findOne({ username: checkuser })
    

    let newTodo = await user.updateOne({ username: userFind.username }, { $push: { todos: {todo:todo} } })

 /*    userFind = await User.findOne({ username: checkuser })
    console.log(userFind)
 */
    res.redirect('/')

}


module.exports = { homePage, loginPage, login, registerPage, addUser, errorPage, addTodo }