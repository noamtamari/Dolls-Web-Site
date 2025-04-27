import { useState, useEffect } from 'react';
import axios from 'axios';

export function UseCartListData() {
  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    axios
      .get('/api/get-cart', { withCredentials: true })
      .then(response => {
        setCartList(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return cartList;
}
