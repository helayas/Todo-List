const express = require('express')
const mongoose = require('mongoose')
const homeRoutes = require('./routes/userRoutes')
const path = require('path')
require('dotenv').config()
const app = express()

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
const cookieParser = require('cookie-parser') 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

// Don't know if could enter in conflict
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
const DB_KEY = process.env.DB_KEY
const PORT = process.env.PORT

mongoose.connect(DB_KEY)

const db = mongoose.connection

db.once('error', () => { console.log(`DataBase wasn't load!`) })
db.once('open', () => {
    app.use('/', homeRoutes)

    app.listen(PORT, () => { console.log(`App running on PORT: ${PORT}`) })
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))