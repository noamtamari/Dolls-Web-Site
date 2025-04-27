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
const stripe = require("stripe")(process.env.STRIPE_API_KEY);


const checkOutRoute = require('./checkOutRoute');
const ordersRoute = require('./ordersRoute');
// const paymentRoute = require('./paymentRoute');



const app = express();



app.set("view engine", "ejs"); //use EJS as its view engine
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, 'public')));


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
        // origin: "http://localhost:3000", // Adjust this according to your React client URL
        origin: "https://varda-dolls.onrender.com", // Adjust this according to your React client URL
        methods: 'GET,POST,PUT,DELETE',
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

mongoose.connect("mongodb+srv://noamtamari98:noam8deshalit@cluster0.mwumbab.mongodb.net/dollUsersDB");

const User = require('./userModel'); // Import the User model


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
    // callbackURL: "/auth/google/VardasDolls",
    callbackURL: "https://varda-dolls.onrender.com/auth/google/VardasDolls",
    scope: ['profile', 'email']
},
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile);
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


app.use('/', checkOutRoute);
app.use('/', ordersRoute);
// app.use('/create-payment-intent', paymentRoute);


const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};
app.post("/create-payment-intent", async (req, res) => {
    const { items, formData, cartProducts } = req.body;
    console.log(req.body)
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });
    console.log(paymentIntent.client_secret)
    req.session.formData = formData;
    req.session.cartProducts = cartProducts;
    req.session.client_secret = paymentIntent.client_secret;
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});


app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "UserTwo"] })
})

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/build", "index.html"));
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
    // console.log(user)
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
                    // res.redirect("http://localhost:3000/");
                    res.redirect("https://varda-dolls.onrender.com");
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
        // res.redirect("http://localhost:3000/");
        res.redirect("https://varda-dolls.onrender.com");
    });
});

app.post("/api/register", function (req, res) {
    console.log("Registerin new Web version")
    if (req.isAuthenticated()) {
        User.findById(req.user.id).then(foundUser => {
            var userData = {
                cartList: foundUser.cartList,
                wishList: foundUser.wishList
            };
            passport.authenticate("local")(req, res, function () {
                res.send(JSON.stringify(userData));
                // res.redirect("http://localhost:3000/");
                res.redirect("https://varda-dolls.onrender.com");
            })
        })
    } else {
        User.register({ username: req.body.username }, req.body.password, function (err, user) {
            // console.log(res);
            if (err) {
                console.log("Register Error: " + err);
                res.status(400).send("Registration error");
            } else {
                console.log("Register: " + req.body.username);

                passport.authenticate("local", function (err, user, info) {
                    if (err) {
                        console.error("Authentication error:", err);
                        res.status(500).send("Authentication error");
                    } else {
                        console.log("Register successfully");
                        var userData = {
                            cartList: [],
                            wishList: []
                        };
                        res.json(userData); // Send JSON response to the client
                    }
                })(req, res);
            }
        })
    }


})

app.get("/api/get-user-data", (req, res) => {
    if (req.isAuthenticated()) {
        User.findById(req.user.id)
            .then((foundUser) => {
                // console.log(foundUser);
                res.send(foundUser);

            }).catch((err) => {
                console.log(err);
                console.log('error finding user):');
                // res.redirect("http://localhost:3000/");
                res.redirect("https://varda-dolls.onrender.com");
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
        // res.redirect("http://localhost:3000/");
        res.redirect("https://varda-dolls.onrender.com");
    });

const PORT = process.env.PORT || 5000;
app.post("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
    // res.sendFile(path.join(__dirname, "../client/build", "index.html"));
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => { console.log("server started on port 5000") })