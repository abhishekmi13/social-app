const express = require('express')
const router = require('./router')
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))
app.set('views','views')
app.set('view engine', 'ejs')

app.use('/', router)

//making our express app to be used everywhere (models, controllers, and all other files)
module.exports =  app
