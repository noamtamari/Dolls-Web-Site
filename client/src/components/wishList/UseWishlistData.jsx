import { useState, useEffect } from 'react';
import axios from 'axios';

export function UseWishlistData() {
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    axios
      .get('/api/get-wishList', { withCredentials: true })
      .then(response => {
        setWishList(response.data);
        // console.log(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return wishList;
}
