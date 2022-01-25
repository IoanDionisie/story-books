const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GoogleStrategy ( 
        {
            clientID: "392665145133-6q3ush4ob26fu6lgecafc1irn3qk9dnj.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: '/auth/google/callback'
        },
        async(accessToken, refreshToken, profile, done) => {
            console.log(profile);
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}