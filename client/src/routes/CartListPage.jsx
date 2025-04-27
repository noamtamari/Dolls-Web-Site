import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import ResponsiveAppBar from '../components/homepage/ResponsiveAppBar';
import Footer from '../components/Footer';
import Features from '../components/Features';
import CartContent from '../components/cart/CartContent';
import { UseCartListData } from '../components/cart/UseCartListData';


function CartListPage() {
    const cartList = UseCartListData(null);

    const [parsedCartList, setParsedCartList] = useState([]);



    useEffect(() => {
        const parsedList = cartList;
        setParsedCartList(parsedList);
    }, [cartList]);

    return (
        <div>
            <ResponsiveAppBar />
            <CartContent value={parsedCartList} />
            <Footer />
            <Features />
        </div>
    );
}

export default CartListPage;
