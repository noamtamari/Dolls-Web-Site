/**
 * server.js
 *
 * This file serves as the main entry point for the backend server of the application.
 * It sets up the Express server, connects to the MongoDB database, configures middleware,
 * and defines routes for handling user authentication, wishlist, cart, and payment functionality.
 *
 * Key Features:
 * - User authentication using Passport.js (local and Google OAuth strategies).
 * - Session management with MongoDB-backed session storage.
 * - Wishlist and cart management for authenticated users and guests.
 * - Payment processing using Stripe.
 * - Serves static files for the React frontend.
 */

require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express framework
const path = require("path"); // Import path module for handling file paths
const bodyParser = require("body-parser"); // Import body-parser middleware for parsing request bodies
const mongoose = require("mongoose"); // Import Mongoose for MongoDB object modeling
const session = require("express-session"); // Import express-session for session management for user authentication
const cookieParser = require("cookie-parser"); // Import cookie-parser for parsing cookies
const MongoDBStore = require("connect-mongodb-session")(session); // Import MongoDBStore for storing session data in MongoDB
// const passportLocalMongoose = require('passport-local-mongoose'); // Import passport-local-mongoose for local authentication
const passport = require('passport'); // Import Passport.js for user authentication
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Import Google OAuth strategy for Passport.js
// const findOrCreate = require('mongoose-findorcreate'); // Import mongoose-findorcreate for simplifying user lookup or creation
var cors = require("cors"); // Import CORS middleware for handling Cross-Origin Resource Sharing
const { v4: uuidv4 } = require("uuid"); // Import UUID for generating unique identifiers, will be used for guest users
const stripe = require("stripe")(process.env.STRIPE_API_KEY); // Import Stripe for payment processing

const checkOutRoute = require("./checkOutRoute"); // Import checkout route for handling payment and order processing
const ordersRoute = require("./ordersRoute"); // Import orders route for handling order-related operations
// const paymentRoute = require('./paymentRoute');

const app = express();

// View engine setup
app.set("view engine", "ejs"); //use EJS as its view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory for EJS templates

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies, needed for form submissions
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory, like images
app.use(express.static(path.join(__dirname, "..", "client", "build"))); // Serve static files from the React app build directory
app.use(cookieParser()); // Parse cookies from incoming requests

const store = new MongoDBStore({
  uri:
    "mongodb+srv://noamtamari98:" +
    process.env.MONGODB_CONNECTION +
    "@cluster0.mwumbab.mongodb.net/dollUsersDB",
  collection: "sessions",
});

// Catch errors from the store like connection errors
store.on("error", function (error) {
  console.log(error);
});

// Set up session middleware for user authentication and session management
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: store,
  })
);

// Initialize Passport.js for user authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    // origin: "http://localhost:3000", // Adjust this according to React client URL
    origin: "https://varda-dolls.onrender.com",
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

mongoose.connect(
  "mongodb+srv://noamtamari98:" +
    process.env.MONGODB_CONNECTION +
    "@cluster0.mwumbab.mongodb.net/dollUsersDB"
);

const User = require("./userModel"); // Import the User model

// Configure Passport.js for local authentication
passport.use(User.createStrategy());

// Configure Passport.js for Google OAuth authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user from session for authentication
passport.deserializeUser(function (id, done) {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// Configure Google OAuth strategy for Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callbackURL: "/auth/google/VardasDolls",
      callbackURL: "https://varda-dolls.onrender.com/auth/google/VardasDolls",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // Look for an existing user
        let user = await User.findOne({ googleId: profile.id });

        // If no user found by googleId, try by email
        if (!user && profile.emails && profile.emails.length) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        // If no user found, create one
        if (!user) {
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        // Log them in (success)
        return cb(null, user);
      } catch (err) {
        // Handle errors
        return cb(err);
      }
    }
  )
);

// Define the Guest schema for guest users
// This schema is used to store guest user data, including their wishlist and cart
const guestSchema = new mongoose.Schema({
  identifier: String,
  wishList: Array,
  cartList: Array,
});

const Guest = new mongoose.model("Guest", guestSchema);

app.use("/", checkOutRoute);
app.use("/", ordersRoute);
// app.use('/create-payment-intent', paymentRoute);

// Payment intent creation using Stripe API
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

// Create a payment intent with the order amount and currency
// This endpoint is called from the client-side to initiate the payment process
app.post("/create-payment-intent", async (req, res) => {
  const { items, formData, cartProducts } = req.body;
  console.log(req.body);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log(paymentIntent.client_secret);
  req.session.formData = formData;
  req.session.cartProducts = cartProducts;
  req.session.client_secret = paymentIntent.client_secret;
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Hanling a call from DollProduct.jsx to add a doll to the wishlist
// This endpoint is called when a user adds a doll to their wishlist
app.get("/api/set-wishList", (req, res) => {
  const selectedDoll = req.query.doll;
  const dollURL = req.query.url;
  selectedDoll.dollURL = dollURL;
  if (req.isAuthenticated()) {
    console.log("user is Authenticated set-wishList");
    User.findById(req.user.id)
      .then((foundUser) => {
        if (foundUser) {
          foundUser.wishList.push(selectedDoll);
          return foundUser.save();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("error finding user):");
        res.redirect("/");
      });
  }
  // If the user is not authenticated, check for a guest identifier in the cookie so guest users can also have a wishlist
  else {
    const guestIdentifier = req.cookies.identifier;
    // Check if guest identifier exists
    if (guestIdentifier) {
      // Guest identifier exists, search for the associated document in the database
      Guest.findOne({ identifier: guestIdentifier })
        .then((guest) => {
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
        .then((savedGuest) => {
          // Wishlist updated or new guest document created successfully
          console.log("Doll added to wishlist");
          res.sendStatus(200);
        })
        .catch((error) => {
          // Error occurred while updating wishlist or creating new guest document
          console.error("Error adding doll to wishlist", error);
          res.sendStatus(500);
        });
    } else {
      // Guest identifier not found in the cookie, create a new identifier
      const newGuestIdentifier = uuidv4();

      // Save the new guest identifier in the cookie, this cookie will be available for 1 day
      res.cookie("identifier", newGuestIdentifier, {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
      });

      // Create a new guest document with the new identifier and the selected doll

      const newGuest = new Guest({
        identifier: newGuestIdentifier,
        wishList: [selectedDoll],
        cartList: [],
      });

      newGuest
        .save()
        .then((savedGuest) => {
          // New guest document created successfully
          console.log("Doll added to wishlist and this is a new guest");
          res.sendStatus(200);
        })
        .catch((error) => {
          // Error occurred while creating new guest document
          console.error("Error adding doll to wishlist", error);
          res.sendStatus(500);
        });
    }
  }
});

// Sending the wishlist to the client
// This endpoint is called to retrieve the wishlist data for the authenticated user or guest
app.get("/api/get-wishList", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("user is Authenticated get-wishList");
    User.findById(req.user.id)
      .then((foundUser) => {
        res.send(foundUser.wishList);
      })
      .catch((err) => {
        console.log(err);
        console.log("error finding user):");
        res.redirect("/");
      });
  } else {
    const guestIdentifier = req.cookies.identifier;

    if (guestIdentifier) {
      // Guest identifier exists, search for the associated document in the database
      Guest.findOne({ identifier: guestIdentifier })
        .then((guest) => {
          if (guest) {
            // Guest found, return the wish-list data
            // console.log(guest.identifier)
            res.send(guest.wishList);
          } else {
            // Guest not found (rare case), return an empty array
            console.log("Guest not found");
            res.send([]);
          }
        })
        .catch((error) => {
          // Error occurred while retrieving wish-list data
          console.error("Error retrieving wish-list data", error);
          res.sendStatus(500);
        });
    } else {
      // Guest identifier not found in the cookie, return an empty array
      console.log("Guest identifier not found");
      res.send([]);
    }
  }
});

// Hanling a call from WishListTable.jsx to remove a doll from the wishlist
app.post("/api/update-wishList", (req, res) => {
  let newWishList = req.body.params.updateWishList; // Retrieve the updated wishlist from the request body
  console.log("update");
  User.findById(req.user.id)
    .then((foundUser) => {
      if (foundUser) {
        foundUser.wishList = newWishList;
        res.sendStatus(200);
        return foundUser.save();
      } else {
        const identifier = req.cookies.identifier;
        Guest.findOne({ identifier: identifier })
          .then((guest) => {
            if (guest) {
              // Guest found, update the wish-list data in the document
              guest.wishList = newWishList;
              return guest.save();
            } else {
              guest.newWishList = [];
              return guest.save();
            }
          })
          .then((savedGuest) => {
            console.log("Doll have been removed from the WishList");
            res.sendStatus(200);
          })
          .catch((error) => {
            // Error occurred while updating cartlist or creating new guest document
            console.error("Error removing doll to WishList", error);
            res.sendStatus(500);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("error finding user):");
      res.redirect("/");
    });
});

// Hanling a call from Cart.jsx to get the cart data
// This endpoint is called to retrieve the cart data for the authenticated user or guest
app.get("/api/get-cart", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id)
      .then((foundUser) => {
        const userCartList = foundUser.cartList;
        if (userCartList.length !== 0) {
          res.send(foundUser.cartList);
        } else {
          res.send(["empty cart"]);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("error finding user):");
        res.redirect("/");
      });
  } else {
    const guestIdentifier = req.cookies.identifier;
    if (guestIdentifier) {
      // Guest identifier exists, search for the associated document in the database
      Guest.findOne({ identifier: guestIdentifier })
        .then((guest) => {
          if (guest) {
            // Guest found, return the wish-list data
            res.send(guest.cartList);
          } else {
            // Guest not found (rare case), return an empty array
            console.log("Guest not found");
            res.send([]);
          }
        })
        .catch((error) => {
          // Error occurred while retrieving wish-list data
          console.error("Error retrieving cartList data", error);
          res.sendStatus(500);
        });
    } else {
      // Guest identifier not found in the cookie, return an empty array
      console.log("Guest identifier not found");
      res.send([]);
    }
  }
});

// Hanling a call from Cart.jsx to add a doll to the cart
// This endpoint is called when a user adds a doll to their cart
app.get("/api/addTo-cart", (req, res) => {
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
      })
      .catch((err) => {
        console.log(err);
        console.log("error finding user):");
        res.redirect("/");
      });
  } else {
    // Retrieve the guest identifier from the cookie
    const guestIdentifier = req.cookies.identifier;
    // Check if guest identifier exists
    if (guestIdentifier) {
      // Guest identifier exists, search for the associated document in the database
      Guest.findOne({ identifier: guestIdentifier })
        .then((guest) => {
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
        .then((savedGuest) => {
          // Wishlist updated or new guest document created successfully
          console.log("Doll added to cart-lisy");
          res.sendStatus(200);
        })
        .catch((error) => {
          // Error occurred while updating wishlist or creating new guest document
          console.error("Error adding doll to cart-list", error);
          res.sendStatus(500);
        });
    } else {
      // Guest identifier not found in the cookie, create a new identifier
      const newGuestIdentifier = uuidv4();

      // Save the new guest identifier in the cookie
      res.cookie("identifier", newGuestIdentifier, {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
      });

      // Create a new guest document with the new identifier and the selected doll

      const newGuest = new Guest({
        identifier: newGuestIdentifier,
        wishList: [],
        cartList: [selectedDoll],
      });

      newGuest
        .save()
        .then((savedGuest) => {
          // New guest document created successfully
          console.log("Doll added to cart list and this is a new guest");
          res.sendStatus(200);
        })
        .catch((error) => {
          // Error occurred while creating new guest document
          console.error("Error adding doll to cart-list", error);
          res.sendStatus(500);
        });
    }
  }
});

// Hanling a call from Cart.jsx to remove a doll from the cart
// This endpoint is called when a user removes a doll from their cart
app.post("/api/update-cart", (req, res) => {
  let newCartList = req.body.params.updateCartList; // Retrieve the updated wishlist from the request body
  console.log("update");
  if (req.isAuthenticated()) {
    User.findById(req.user.id)
      .then((foundUser) => {
        if (foundUser) {
          foundUser.cartList = newCartList;
          res.sendStatus(200);
          return foundUser.save();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("error finding user):");
        res.redirect("/");
      });
  } else {
    const identifier = req.cookies.identifier;
    Guest.findOne({ identifier: identifier })
      .then((guest) => {
        if (guest) {
          // Guest found, update the wish-list data in the document
          guest.cartList = newCartList;
          return guest.save();
        } else {
          guest.cartList = [];
          return guest.save();
        }
      })
      .then((savedGuest) => {
        console.log("Doll have been removed from the cart-list");
        res.sendStatus(200);
      })
      .catch((error) => {
        // Error occurred while updating cartlist or creating new guest document
        console.error("Error removing doll to cart-list", error);
        res.sendStatus(500);
      });
  }
});

// Check if the user is authenticated if so send "true" else send "false"
// This endpoint is called to check if the user is logged in
app.get("/api/get-login", (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.send("true");
  } else {
    res.send("false");
  }
});

// Hanling a call from Login.jsx to log in the user
// This endpoint is called when a user attempts to log in not using Google OAuth
// It uses the passport.authenticate middleware to handle the authentication process
app.post("/api/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  // console.log(user)
  req.login(user, function (err) {
    if (err || user.username === "" || user.password === "") {
      console.log("login error " + err);
      res.redirect("/login");
    } else {
      User.find({ username: user.username })
        .then((foundUser) => {
          passport.authenticate("local")(req, res, function () {
            var userData = {
              cartList: foundUser.cartList,
              wishList: foundUser.wishList,
            };
            // res.send(JSON.stringify(userData));
            // res.redirect("http://localhost:3000/");
            res.redirect("https://varda-dolls.onrender.com");
          });
        })
        .catch((err) => {
          console.log("user not found");
        });
    }
  });
});

// Hanling a call from Login.jsx to log out the user
// This endpoint is called when a user attempts to log out
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

// Hanling a call from RegisterFrame.jsx to register a new user
// This endpoint is called when a user attempts to register
// if the user is already logged in, it will send the user data
// if the user is not logged in, it will register the user and send an empty wishlist and cartlist
app.post("/api/register", function (req, res) {
  if (req.isAuthenticated()) {
    User.findById(req.user.id).then((foundUser) => {
      var userData = {
        cartList: foundUser.cartList,
        wishList: foundUser.wishList,
      };
      passport.authenticate("local")(req, res, function () {
        res.send(JSON.stringify(userData));
        // res.redirect("http://localhost:3000/");
        res.redirect("https://varda-dolls.onrender.com");
      });
    });
  } else {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        // console.log(res);
        if (err) {
          console.log("Register Error: " + err);
          res.status(400).send("Registration error");
        } else {
          // console.log("Register: " + req.body.username);
          passport.authenticate("local", function (err, user, info) {
            if (err) {
              console.error("Authentication error:", err);
              res.status(500).send("Authentication error");
            } else {
              console.log("Register successfully");
              var userData = {
                cartList: [],
                wishList: [],
              };
              res.json(userData); // Send JSON response to the client
            }
          })(req, res);
        }
      }
    );
  }
});

// Hanling a call from AccountContent.jsx to get the user data
// This endpoint is called to retrieve the user data for the authenticated user
app.get("/api/get-user-data", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id)
      .then((foundUser) => {
        // console.log(foundUser);
        res.send(foundUser);
      })
      .catch((err) => {
        console.log(err);
        console.log("error finding user):");
        // res.redirect("http://localhost:3000/");
        res.redirect("https://varda-dolls.onrender.com");
      });
  } else {
    res.send("false");
  }
});

// Handling a call from LoginFrame.jsx to handle Google login
// This endpoint is called when a user attempts to log in using Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Handling the callback after Google has authenticated the user
// This endpoint is called after Google redirects back to the application
app.get(
  "/auth/google/VardasDolls",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureMessage: true,
  }),
  function (req, res) {
    // Successful authentication, redirect to the homepage or a success page.
    // res.redirect("http://localhost:3000/");
    res.redirect("https://varda-dolls.onrender.com");
  }
);

// Getting the port from the environment variable or default to 5000
// This allows the server to run on different ports in different environments
const PORT = process.env.PORT || 5000;

// Serve the React app from the build directory
// This endpoint serves the React app when the user accesses the root URL
app.post("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "index.html"));
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  // res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Serve the React app for all other routes
// This endpoint serves the React app for all other routes that are not defined above
app.get("*", (req, res) => {
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  // res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log("server started on port :" + PORT);
});
