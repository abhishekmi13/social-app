const bcrypt = require("bcryptjs")
const validator = require("validator")
const md5 = require('md5')
const app = require("../app")
const usersCollection = require('../db').db().collection("users")



let User = function(data, getAvatar) {
    this.data = data 
    this.errors = []   
    if(getAvatar == undefined) { getAvatar = false } 
    if(getAvatar) {this.getAvatar}
    }
    
    User.prototype.cleanUp = function() {
        if(typeof(this.data.username)!= "string"){this.data.username = ""}
        if(typeof(this.data.email)!= "string"){this.data.email = ""}
        if(typeof(this.data.password)!= "string"){this.data.password = ""}

         //remove/eliminate any unncessary properties e.g. favoriteColor : "blue"

        this.data = {
            username: this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password: this.data.password,
            added_date: new Date()
        }
    }

    User.prototype.validate = function() {
        return new Promise(async (resolve, reject) => {
       
            if (this.data.username == '') {this.errors.push("Enter your username")}
            if(this.data.username!= "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain valid letters and numbers")}
            if (!validator.isEmail(this.data.email)){this.errors.push("Provide a valid email")}
            if (this.data.password== ''){this.errors.push("Provide your password")}
            if (this.data.password.length >0 && this.data.password.length < 5) {this.errors.push("password to be mininum 5 letters")}
            if (this.data.username.length >0 && this.data.username.length < 4) {this.errors.push("username to be minimum 4 letters")} 
    
            // only if username is valid check if it's already taken in db
            if(this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
                let usernameExists = await usersCollection.findOne({username: this.data.username})
                if(usernameExists) { this.errors.push("That username is already taken")} 
            }
    
            // only if email is valid check if it's already taken in db
            if(validator.isEmail(this.data.email)) {
                let emailExists = await usersCollection.findOne({email: this.data.email})
                if(emailExists) { this.errors.push("That email is already taken")} 
            }
            resolve()
    
        })
    }

    User.prototype.login = function(){
        return new Promise((resolve, reject) => {
            this.cleanUp()
            usersCollection.findOne({username: this.data.username}).then((attemtedUser) => {
                if (attemtedUser && bcrypt.compareSync(this.data.password, attemtedUser.password)){
                    this.data = attemtedUser
                    this.getAvatar()
                    resolve("congrats!")
                }   else {
                    reject("Invalid Username/Password")
                }
            }).catch(function() {
                reject("please try again later!")
            })
        })
    }

    User.prototype.register = async function() {
        
        return new Promise(async  (resolve, reject) => {
            this.cleanUp()
            await this.validate()
    
            if(!this.errors.length){
            //hash user password
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt) 
            await usersCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
            } else {
                reject(this.errors)
            }

        })

        //step 1: validate user data
        //step 2: only if there are no errors then save the user data into a DB
        
        
    }

    User.prototype.getAvatar = function (){
        this.avatar = `http://gravatar.com/avatar/${md5(this.data.email)}?s=128`
    }
    
    module.exports = User