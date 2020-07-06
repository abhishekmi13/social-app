const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const router = require('./router')
const flash = require("connect-flash")
const app = express()

let sessionOptions = session({
    secret: "Javascript is awesome",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))
app.set('views','views')
app.set('view engine', 'ejs')

app.use(sessionOptions)
app.use(flash())
app.use('/', router)

//making our express app to be used everywhere (models, controllers, and all other files)
module.exports =  app
