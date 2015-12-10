'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema({
  name: String,
  password: String
});

userSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) {
    return next;
  }

  bcrypt.genSalt((err, salt) => {
    if (err) {
      console.log('salt creation failed', err);
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        console.log('hash failed', err);
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePasswords = function(pwd, callback) {
  bcrypt.compare(pwd, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);