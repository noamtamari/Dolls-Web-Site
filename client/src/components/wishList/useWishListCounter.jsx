import { useState } from 'react';
export const useWishlistCounter = () => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const addToWishlist = () => {
    setWishlistCount(wishlistCount + 1);
    console.log(wishlistCount)
  };

  const removeFromWishlist = () => {
    setWishlistCount(wishlistCount - 1);
  };

  return {
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
  };
};
