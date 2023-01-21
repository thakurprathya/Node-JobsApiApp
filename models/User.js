const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//schemas our userdefined structures for database collection as mongoDB noSQL db it doesn't have any predefined structure
//models are fancy structures compiled from schema definations, instance of model is called a document, they are responsible for creating and reading documents from database.
//we have provided validation to our schema, for further validation props refer mongoose docs-> validation.
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          //regex for email
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    }
});

//hashing is one way, it cannot be reversed, also if input changes a bit hash will be completely diff
//bcryptjs is library used for password hashing
//pre middleware functions are executed one after the other, when each middleware calls next
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10); //bigger the no. more random bytes will be generated, more secure pass and more processing is required
    this.password = await bcrypt.hash(this.password, salt);  //hashing the password( generating random bytes and combining them with passwords)
}); //since not sending bad req so no need of any next();

UserSchema.methods.createJWT = function () {  //creating a function for UserSchema to create a token
    return jwt.sign(
        { userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME }
    );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {  //creating a function for userSchema to compare passwords
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
