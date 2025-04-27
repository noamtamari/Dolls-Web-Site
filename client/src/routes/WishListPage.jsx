import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import ResponsiveAppBar from '../components/homepage/ResponsiveAppBar';
import Footer from '../components/Footer';
import Features from '../components/Features';
import WishListTable from '../components/wishList/WishListTable';
import { UseWishlistData } from '../components/wishList/UseWishlistData';


function WishListPage() {
    const wishList = UseWishlistData(null);

    //   const [wishList, setWishList] = useState([]);
    const [parsedWishList, setParsedWishList] = useState([]);



    useEffect(() => {
        const parsedList = wishList;
        setParsedWishList(parsedList);
        // setWishList(parsedList);
    }, [wishList]);

    return (
        <div>
            <ResponsiveAppBar />
            <WishListTable value={parsedWishList} />
            <Footer />
            <Features />
        </div>
    );
}

export default WishListPage;
