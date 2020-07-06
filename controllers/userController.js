const User = require('../models/User')

exports.home = function(req, res) {
    if(req.session.user){
        res.render("home-dashboard", {username: req.session.user.username})
    } else {
        res.render('home-guest')
    }
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
        req.session.user = {username: user.data.username, validUser: true}
        req.session.save(function (){
            res.redirect("/")
        })
    }).catch(function(e) {
        res.send(e)
    })
}

exports.logout = function(req, res){
    req.session.destroy(function() {
        res.redirect("/")
    })
    
}