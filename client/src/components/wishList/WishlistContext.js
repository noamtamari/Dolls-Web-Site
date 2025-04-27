// WishlistContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    axios
      .get('/api/get-wishList', { withCredentials: true })
      .then(response => {
        setWishlist(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const addToWishlist = (doll) => {
    axios
      .get('/api/get-wishList', { withCredentials: true })
      .then(response => {
        setWishlist(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const removeFromWishlist = (doll) => {
    axios
      .post('/api/remove-from-wishlist', { doll })
      .then(response => {
        setWishlist(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };
  console.log('wishlist:', wishlist); // Add this line

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export { WishlistContext, WishlistProvider };
