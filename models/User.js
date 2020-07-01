const validator = require("validator")
const app = require("../app")
const usersCollection = require('../db').collection("users")

let User = function(data) {
    this.data = data 
    this.errors = []   
    }
    
    User.prototype.cleanUp = function() {
        if(typeof(this.data.username)!= "string"){this.data.username = ""}
        if(typeof(this.data.email)!= "string"){this.data.email = ""}
        if(typeof(this.data.password)!= "string"){this.data.password = ""}

         //remove/eliminate any unncessary properties e.g. favoriteColor : "blue"

        this.data = {
            username: this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password: this.data.password
        }
    }

    User.prototype.validate = function(){
       
        if (this.data.username == '') {this.errors.push("Enter your username")}
        if(this.data.username!= "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain valid letters and numbers")}
        if (!validator.isEmail(this.data.email)){this.errors.push("Provide a valid email")}
        if (this.data.password== ''){this.errors.push("Provide your password")}
        if (this.data.password.length >0 && this.data.password.length < 5) {this.errors.push("password to be mininum 5 letters")}
        if (this.data.username.length >0 && this.data.username.length < 4) {this.errors.push("username to be minimum 4 letters")} 

    }

    User.prototype.register = function(){
        //step 1: validate user data
        //step 2: only if there are no errors then save the user data into a DB
        this.cleanUp()
        this.validate()
    
         if(!this.errors.length){
             usersCollection.insertOne(this.data)
         }
    }
    
    module.exports = User