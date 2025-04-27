import React from 'react'
import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useWishlistCounter } from './useWishListCounter';

import '../../Components.css';



function WishListTable(props) {
    // console.log(props.value);
    const wishListProducts = props.value;
    const { removeFromWishlist } = useWishlistCounter();

    function handleDeleteFromWishList(index) {
        wishListProducts.splice(index, 1);
        // console.log(wishListProducts);
        axios.post('/api/update-wishList', { params: { updateWishList: wishListProducts, withCredentials: true } })
            .then(response => {
                // Handle the response if needed
                console.log(response);
                window.location.reload();
            })
            .catch(error => {
                // Handle the error if needed
                console.error(error);
            });

    }


    return (
        <div className="primary-font" style={{ textAlign: 'center' }}>
            <h1>My WishList</h1>
            <Table className="center-content" responsive="sm" striped bordered hover>
                <thead>
                    <tr>
                        <th>לחץ למעבר לפריט</th>
                        <th>?זמין במלאי</th>
                        <th>מחיר מינימאלי</th>
                        <th>שם המוצר</th>
                        <th>תמונה</th>
                        <th>לחץ להסרה</th>
                    </tr>
                </thead>

                <tbody>
                    {wishListProducts.map((product, index) => (
                        <tr key={index}>
                            <td><Button href={product.dollURL} style={{ backgroundColor: 'purple', border: 'none' }}>לפריט</Button></td>
                            <td>?</td>
                            <td>{product.price[0]}</td>
                            <td>{product.name}</td>
                            <td style={{ width: '10%' }}><img src={product.ImgsSRC} alt='' style={{ width: '100%', height: '10%' }}></img></td>
                            <td><Button
                                onClick={() => {
                                    handleDeleteFromWishList(index)
                                    removeFromWishlist()
                                }}
                                style={{ backgroundColor: 'black', border: 'none' }}>X</Button></td>
                        </tr>
                    ))}


                </tbody>
            </Table>
        </div>
    )
}

export default WishListTable