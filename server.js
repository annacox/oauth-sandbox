var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var config = require('config');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

// ==========================================================
// setup passport

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// use GitHubStrategy with Passport
passport.use(new GitHubStrategy({
        clientID: (process.env.GH_CLIENT_ID || config.github.clientID),
        clientSecret: (process.env.GH_CLIENT_SECRET || config.github.clientSecret),
        callbackURL: config.github.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification
        process.nextTick(function () {
            // return the user's GitHub profile to represent the logged-in user
            console.info("logged in as " + profile.displayName);
            return done(null, profile);
        });
    }
));

// middleware function to be used for every secured route
var auth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.send(401);
    } else  {
        next();
    }
};

// ================================================================
// setup express application

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cookieParser());
app.use(bodyParser());
app.use(expressSession({ secret: 'SECRET' }));

// initialize passport and use passport.session() to support persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

// ================================================================
// ===== authentication page routing ======

// GET /auth/github
// use passport.authenticate() as route middleware to authenticate the request
app.get('/auth/github',
    passport.authenticate('github'),
    function(req, res) {
        //the request will be redirected to github for auth, so this function will not be called
    });

// GET /auth/github/callback
// use passport.authenticate() as route middleware to authenticate the request
// if auth fails, the user will be redirected back to the login page
// otherwise, the primary route function will be called which will redirect the user to the home page
app.get('/auth/github/callback',
    passport.authenticate('github', {
        scope: ['user', 'repo'],
        failureRedirect: '/#/login'
    }),
    function(req, res) {
        res.redirect('/#/profile');
    });

// ===============================================================

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log out
app.post('/logout', function(req, res){
    req.logOut();
    res.send(200);
});


app.get('/securedResource', auth, function(req, res) {
    res.send([]);
});

// ===============================================================

app.use(express.static(__dirname + '/app'));

app.listen(app.get('port'), function() {
    console.info("Node app is running on port " + app.get('port'));
});