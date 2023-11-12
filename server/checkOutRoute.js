const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require('./userModel'); // Import the User model

const orderSchema = new mongoose.Schema({
    orderNumber: String,
    name: String,
    lastName: String,
    telephone: String,
    email: String,
    address: {
        street: String,
        houseNumber: String,
        apartmentNumber: String,
        city: String,
        zip: String
    },
    orderNotes: String,
    productsList: Array,
    orderPrice: Number,
    date: String,
});

const Order = new mongoose.model("Order", orderSchema);

function generateOrderNumber() {
    const uniqueIdentifier = Date.now(); // Use a timestamp as a unique identifier
    const randomComponent = Math.floor(Math.random() * 10000); // Add a random number component

    // Combine the unique identifier and random component
    const orderNumber = `${uniqueIdentifier}-${randomComponent}`;

    return orderNumber;
}

router.get("/api/check-out", async (req, res) => {
    // console.log(req.isAuthenticated())
    const formData = req.session.formData;
    const cartProducts = req.session.cartProducts;
    const client_secret = req.session.client_secret;

    req.session.formData = null;
    req.session.cartProducts = null;
    req.session.client_secret = null;
    const orderNumber = generateOrderNumber();
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    console.log("formData: ",formData)
    if (formData !== null) {
        const newOrder = new Order({
            orderNumber: orderNumber, // You need to implement this function
            name: formData.name,
            lastName: formData.lastName,
            telephone: formData.telephone,
            email: formData.email,
            address: {
                street: formData.address.street,
                houseNumber: formData.address.houseNumber,
                apartmentNumber: formData.address.apartmentNumber,
                city: formData.address.city,
                zip: formData.address.zip,
            },
            orderNotes: formData.orderNotes,
            productsList: cartProducts, // Assuming you have products data in cartProducts
            orderPrice: formData.orderPrice,
            date: formattedDate, // Use a proper date format
        });

        if (req.isAuthenticated()) {
            console.log("Order Number: ", orderNumber);
            try {
                // Save the new order document to the database
                const savedOrder = await newOrder.save();

                // Associate the order with the user
                User.findById(req.user.id)
                    .then((foundUser) => {
                        if (foundUser) {
                            foundUser.orders.push(newOrder);
                            return foundUser.save();
                        }
                    })
                    .then(() => {
                        // Send a response to the client with the order number
                        res.status(201).json(savedOrder.orderNumber);
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log('error finding user and saving the order):');
                        res.status(500).json({ error: 'Failed to save order.' });
                    });
            } catch (error) {
                // Handle any errors
                res.status(500).json({ error: 'Failed to save order.' });
            }
        } else {
            console.log("Order Number: ", orderNumber);
            const savedOrder = await newOrder.save();
            res.status(201).json(savedOrder.orderNumber);
        }
    } else{
        res.status(500).json({error:"can't access this page"})
    }
});

module.exports = router;