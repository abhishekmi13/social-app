const User = require('../models/User')

exports.home = function(req, res) {
    res.render('home-guest')
}

exports.register = function(req, res) {
    let user = new User(req.body)
    user.register()
   
   
   if(user.errors.length){
    res.send(user.errors)
    } else {
       res.send("Success")
   }
    res.send(user.errors)
}

exports.login = function(req, res){
    let user = new User(req.body)
    user.login().then(function(x){
        res.send(x)
    }).catch(function(e) {
        res.send(e)
    })
}