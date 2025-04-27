const express = require('express');
const router = express.Router();
const User = require('./userModel'); // Import the User model

router.get("/api/get-orders", async (req, res) => {

    if (req.isAuthenticated()) {
        try {

            // Associate the order with the user
            User.findById(req.user.id)
                .then((foundUser) => {
                    if (foundUser) {
                        res.status(201).json(foundUser.orders);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    console.log('error finding user');
                    res.status(500).json({ error: 'Failed to find user.' });
                });
        } catch (error) {
            // Handle any errors
            res.status(500).json({ error: 'Failed to find user.' });
        }
    }
});

router.get("/api/get-order/:orderNumber", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const foundUser = await User.findById(req.user.id);
            if (foundUser) {
                const foundOrder = foundUser.orders.find((order) => order.orderNumber === req.params.orderNumber);
                if (foundOrder) {
                    // console.log(foundOrder)
                    return res.status(200).json(foundOrder);
                }
            }
            res.status(404).json({ error: 'Order not found or user not found.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to find user or order.' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});


module.exports = router;