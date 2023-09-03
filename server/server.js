require('dotenv').config();
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
var cors = require('cors');
const { v4: uuidv4 } = require('uuid');


const app = express();


app.set("view engine", "ejs"); //use EJS as its view engine
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, "../client/build")));

app.use(cookieParser());

// app.options('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", ['X-Requested-With', 'content-type', 'credentials']);
//     res.header('Access-Control-Allow-Methods', 'GET,POST');
//     res.status(200);
//     next();
// })
const store = new MongoDBStore({
    uri: "mongodb+srv://noamtamari98:noam8deshalit@cluster0.mwumbab.mongodb.net/dollUsersDB",
    collection: 'sessions'
});

store.on('error', function (error) {
    console.log(error);
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: store
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors({
        origin: "http://localhost:5000", // Adjust this according to your React client URL
        methods: 'GET,POST,PUT,DELETE',
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

mongoose.connect("mongodb+srv://noamtamari98:noam8deshalit@cluster0.mwumbab.mongodb.net/dollUsersDB");

const userSchema = new mongoose.Schema({
    password: String,
    wishList: Array,
    cartList: Array,
    googleId: String,
    displayName: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then(user => {
        done(null, user);
    })
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/VardasDolls",
    scope: ['profile', 'email']
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id, displayName: profile.displayName }, function (err, user) {
            return cb(err, user);
        });

    }
));

const guestSchema = new mongoose.Schema({
    identifier: String,
    wishList: Array,
    cartList: Array,
});

const Guest = new mongoose.model("Guest", guestSchema);

// const logSessionData = (req, res, next) => {
//     console.log('Session data:', req.session);
//     next();
// };

// // Add the logSessionData middleware before your route handlers
// app.use(logSessionData);

app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "UserTwo"] })
})




//   app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "/public/index.html"));
// });

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// })

app.get('/api/set-wishList', (req, res) => {
    const selectedDoll = req.query.doll;
    const dollURL = req.query.url;
    selectedDoll.dollURL = dollURL;
    if (req.isAuthenticated()) {
        console.log("user is Authenticated set-wishList")
        User.findById(req.user.id)
            .then((foundUser) => {
                if (foundUser) {
                    foundUser.wishList.push(selectedDoll);
                    return foundUser.save();
                }
            }).catch((err) => {
                console.log(err);
                console.log('error finding user):');
                res.redirect("/");
            });
    } else {
        const guestIdentifier = req.cookies.identifier;
        // Check if guest identifier exists
        if (guestIdentifier) {
            // Guest identifier exists, search for the associated document in the database
            Guest.findOne({ identifier: guestIdentifier })
                .then(guest => {
                    if (guest) {
                        // Guest found, update the wish-list data in the document
                        guest.wishList.push(selectedDoll);
                        return guest.save();
                    } else {
                        // Guest not found (rare case), create a new document with the guest identifier
                        const newGuest = new Guest({
                            identifier: guestIdentifier,
                            wishList: [selectedDoll],
                            cartList: [],
                        });
                        return newGuest.save();
                    }
                })
                .then(savedGuest => {
                    // Wishlist updated or new guest document created successfully
                    console.log('Doll added to wishlist');
                    res.sendStatus(200);
                })
                .catch(error => {
                    // Error occurred while updating wishlist or creating new guest document
                    console.error('Error adding doll to wishlist', error);
                    res.sendStatus(500);
                });
        } else {
            // Guest identifier not found in the cookie, create a new identifier
            const newGuestIdentifier = uuidv4();

            // Save the new guest identifier in the cookie
            res.cookie('identifier', newGuestIdentifier, {
                maxAge: 86400000,
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
                path: '/',
            });

            // Create a new guest document with the new identifier and the selected doll

            const newGuest = new Guest({
                identifier: newGuestIdentifier,
                wishList: [selectedDoll],
                cartList: []
            });

            newGuest.save()
                .then(savedGuest => {
                    // New guest document created successfully
                    console.log('Doll added to wishlist and this is a new guest');
                    res.sendStatus(200);
                })
                .catch(error => {
                    // Error occurred while creating new guest document
                    console.error('Error adding doll to wishlist', error);
                    res.sendStatus(500);
                });
        }
    }


});


app.get('/api/get-wishList', (req, res) => {
    if (req.isAuthenticated()) {
        console.log("user is Authenticated get-wishList")
        User.findById(req.user.id)
            .then((foundUser) => {
                res.send(foundUser.wishList);
            }).catch((err) => {
                console.log(err);
                console.log('error finding user):');
                res.redirect("/");
            });
    } else {
        const guestIdentifier = req.cookies.identifier;

        if (guestIdentifier) {
            // Guest identifier exists, search for the associated document in the database
            Guest.findOne({ identifier: guestIdentifier })
                .then(guest => {
                    if (guest) {
                        // Guest found, return the wish-list data
                        // console.log(guest.identifier)
                        res.send(guest.wishList);
                    } else {
                        // Guest not found (rare case), return an empty array
                        console.log('Guest not found');
                        res.send([]);
                    }
                })
                .catch(error => {
                    // Error occurred while retrieving wish-list data
                    console.error('Error retrieving wish-list data', error);
                    res.sendStatus(500);
                });
        } else {
            // Guest identifier not found in the cookie, return an empty array
            console.log('Guest identifier not found');
            res.send([]);
        }
    }

});
app.post('/api/update-wishList', (req, res) => {
    let newWishList = req.body.params.updateWishList; // Retrieve the updated wishlist from the request body
    console.log("update")
    User.findById(req.user.id)
        .then((foundUser) => {
            if (foundUser) {
                foundUser.wishList = newWishList;
                res.sendStatus(200);
                return foundUser.save();
            } else {
                const identifier = req.cookies.identifier;
                Guest.findOne({ identifier: identifier })
                    .then(guest => {
                        if (guest) {
                            // Guest found, update the wish-list data in the document
                            guest.wishList = newWishList;
                            return guest.save();
                        } else {
                            guest.newWishList = [];
                            return guest.save();
                        }
                    })
                    .then(savedGuest => {
                        console.log('Doll have been removed from the WishList');
                        res.sendStatus(200);
                    })
                    .catch(error => {
                        // Error occurred while updating cartlist or creating new guest document
                        console.error('Error removing doll to WishList', error);
                        res.sendStatus(500);
                    });
            }
        }).catch((err) => {
            console.log(err);
            console.log('error finding user):');
            res.redirect("/");
        });

});

app.get('/api/get-cart', (req, res) => {
    if (req.isAuthenticated()) {
        User.findById(req.user.id)
            .then((foundUser) => {
                const userCartList = foundUser.cartList;
                if (userCartList.length !== 0) {
                    res.send(foundUser.cartList);
                } else {
                    res.send(["empty cart"]);
                }
            }).catch((err) => {
                console.log(err);
                console.log('error finding user):');
                res.redirect("/");
            });
    } else {
        const guestIdentifier = req.cookies.identifier;
        if (guestIdentifier) {
            // Guest identifier exists, search for the associated document in the database
            Guest.findOne({ identifier: guestIdentifier })
                .then(guest => {
                    if (guest) {
                        // Guest found, return the wish-list data
                        res.send(guest.cartList);
                    } else {
                        // Guest not found (rare case), return an empty array
                        console.log('Guest not found');
                        res.send([]);
                    }
                })
                .catch(error => {
                    // Error occurred while retrieving wish-list data
                    console.error('Error retrieving cartList data', error);
                    res.sendStatus(500);
                });
        } else {
            // Guest identifier not found in the cookie, return an empty array
            console.log('Guest identifier not found');
            res.send([]);
        }

    }

});

app.get('/api/addTo-cart', (req, res) => {
    const selectedDoll = req.query.doll;
    const dollURL = req.query.url;
    const dollCount = req.query.dollCount;

    selectedDoll.dollURL = dollURL;
    selectedDoll.dollCount = dollCount;
    // console.log(selectedDoll); // Log the request URL
    if (req.isAuthenticated()) {
        User.findById(req.user.id)
            .then((foundUser) => {
                foundUser.cartList.push(selectedDoll);
                return foundUser.save();
            }).catch((err) => {
                console.log(err);
                console.log('error finding user):');
                res.redirect("/");
            });
    } else {
        // Retrieve the guest identifier from the cookie
        const guestIdentifier = req.cookies.identifier;
        // Check if guest identifier exists
        if (guestIdentifier) {
            // Guest identifier exists, search for the associated document in the database
            Guest.findOne({ identifier: guestIdentifier })
                .then(guest => {
                    if (guest) {
                        // Guest found, update the wish-list data in the document
                        guest.cartList.push(selectedDoll);
                        return guest.save();
                    } else {
                        // Guest not found (rare case), create a new document with the guest identifier
                        const newGuest = new Guest({
                            identifier: guestIdentifier,
                            wishList: [],
                            cartList: [selectedDoll],
                        });
                        return newGuest.save();
                    }
                })
                .then(savedGuest => {
                    // Wishlist updated or new guest document created successfully
                    console.log('Doll added to cart-lisy');
                    res.sendStatus(200);
                })
                .catch(error => {
                    // Error occurred while updating wishlist or creating new guest document
                    console.error('Error adding doll to cart-list', error);
                    res.sendStatus(500);
                });
        } else {
            // Guest identifier not found in the cookie, create a new identifier
            const newGuestIdentifier = uuidv4();

            // Save the new guest identifier in the cookie
            res.cookie('identifier', newGuestIdentifier, {
                maxAge: 86400000,
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
                path: '/',
            });

            // Create a new guest document with the new identifier and the selected doll

            const newGuest = new Guest({
                identifier: newGuestIdentifier,
                wishList: [],
                cartList: [selectedDoll]
            });

            newGuest.save()
                .then(savedGuest => {
                    // New guest document created successfully
                    console.log('Doll added to cart list and this is a new guest');
                    res.sendStatus(200);
                })
                .catch(error => {
                    // Error occurred while creating new guest document
                    console.error('Error adding doll to cart-list', error);
                    res.sendStatus(500);
                });
        }
    }
});

app.post('/api/update-cart', (req, res) => {
    let newCartList = req.body.params.updateCartList; // Retrieve the updated wishlist from the request body
    console.log("update")
    if (req.isAuthenticated()) {
        User.findById(req.user.id)
            .then((foundUser) => {
                if (foundUser) {
                    foundUser.cartList = newCartList;
                    return foundUser.save();
                }
            }).catch((err) => {
                console.log(err);
                console.log('error finding user):');
                res.redirect("/");
            });
    } else {
        const identifier = req.cookies.identifier;
        Guest.findOne({ identifier: identifier })
            .then(guest => {
                if (guest) {
                    // Guest found, update the wish-list data in the document
                    guest.cartList = newCartList;
                    return guest.save();
                } else {
                    guest.cartList = [];
                    return guest.save();
                }
            })
            .then(savedGuest => {
                console.log('Doll have been removed from the cart-list');
                res.sendStatus(200);
            })
            .catch(error => {
                // Error occurred while updating cartlist or creating new guest document
                console.error('Error removing doll to cart-list', error);
                res.sendStatus(500);
            });
    }


});

app.get("/api/get-login", (req, res) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.send("true");
    } else {
        res.send("false");
    }
});
app.post("/api/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    console.log(user)
    req.login(user, function (err) {
        if (err || user.username === '' || user.password === '') {
            console.log("login error " + err);
            res.redirect('/login');
        } else {
            User.find({ "username": user.username }).then(foundUser => {
                passport.authenticate("local")(req, res, function () {
                    var userData = {
                        cartList: foundUser.cartList,
                        wishList: foundUser.wishList,
                    };
                    // res.send(JSON.stringify(userData));
                    res.redirect("http://localhost:5000/");
                })
            }).catch(err => {
                console.log("user not found");
            })
        }
    })

});
app.post("/api/log-out", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log("logout error " + err);
        }
        // res.send('logged-out');
        res.redirect("http://localhost:5000/");
    });
});

app.post("/api/register", function (req, res) {
    if (req.isAuthenticated()) {
        User.findById(req.user.id).then(foundUser => {
            var userData = {
                cartList: foundUser.cartList,
                wishList: foundUser.wishList
            };
            passport.authenticate("local")(req, res, function () {
                res.send(JSON.stringify(userData));
                res.redirect("http://localhost:5000/");
            })
        })
    } else {
        User.register({ username: req.body.username }, req.body.password, function (err, user) {
            // console.log(res);
            if (err) {
                console.log("Register Error" + err);
                res.send('error');
            } else {
                console.log("Register : " + req.body.username)

                passport.authenticate("local", { failureRedirect: '/', failureMessage: true }, function (req, res) {
                    console.log("Register succsuflly");
                    var userData = {
                        cartList: [],
                        wishList: []
                    };
                    res.send(JSON.stringify(userData));
                    res.redirect("http://localhost:5000/");
                })
            }
        })
    }


})

app.get("/api/get-user-data", (req, res) => {
    if (req.isAuthenticated()) {
        User.findById(req.user.id)
            .then((foundUser) => {
                console.log(foundUser);
                res.send(foundUser);

            }).catch((err) => {
                console.log(err);
                console.log('error finding user):');
                res.redirect("http://localhost:5000/");
            });
    } else {
        res.send("false");
    }
});
app.get("/auth/google", passport.authenticate('google', {
    scope: ['profile', 'email']
}));



app.get("/auth/google/VardasDolls",
    passport.authenticate('google', { failureRedirect: "/", failureMessage: true }),
    function (req, res) {
        // Successful authentication, redirect to the homepage or a success page.
        res.redirect("http://localhost:5000/");
    });

app.post("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html");
    res.sendFile(path.join(__dirname, "index.html"));
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log("server started on port 5000") })