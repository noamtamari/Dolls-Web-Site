import React, { useState } from 'react';
import { useWishlistCounter } from '../wishList/useWishListCounter';

import axios from 'axios';
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Divider } from '@mui/material';

import { useParams } from 'react-router-dom';
import { getDollObject } from '../AllDollsObjects';
import '../../Components.css';
import { Button } from 'react-bootstrap';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';
import WishListButton from '../wishList/WishListButton';
import AddToCartButton from '../cart/AddToCartButton';
import ProductCounter from '../ProductCounter';





function DollProduct() {
    const selectedDoll = getDollObject(useParams().product);

    const dollSizes = selectedDoll.size;
    const [currentSize, setCurrentSize] = useState(selectedDoll.size[0]);
    const [currentPrice, setCurrentPrice] = useState(selectedDoll.price[0]);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

    const { addToWishlist } = useWishlistCounter();



    const handleSizeAndPriceChange = (index) => {
        setCurrentSize(selectedDoll.size[index]);
        setCurrentPrice(selectedDoll.price[index]);
        setSelectedButtonIndex(index);

    };

    const [isInWishList, setIsInWishList] = useState(false);
    const handleWishListClick = () => {
        setIsInWishList(!isInWishList);
        if (!isInWishList) {
            const currentURL = window.location.href; // Get the current URL
            axios.get('/api/set-wishList', { params: { doll: selectedDoll, url: currentURL }, withCredentials: true })
                .then(response => {
                    // Handle the response if needed
                    console.log('Doll added to wishlist');
                    addToWishlist();

                })
                .catch(error => {
                    // Handle the error if needed
                    console.error('Error adding doll to wishlist', error);
                });
        } else {
            axios.get('/api/update-wishList', { params: { doll: selectedDoll }, withCredentials: true })
                .then(response => {
                    // Handle the response if needed
                    console.log(response);
                })
                .catch(error => {
                    // Handle the error if needed
                    console.error(error);
                });
        }

    };



    const [count, setCount] = useState(1);

    const handleCountChange = (newCount) => {
        setCount(newCount);
    };

    // const handleIncrement = () => {
    //     setCount(count + 1);
    // };

    // const handleDecrement = () => {
    //     if (count > 1) {
    //         setCount(count - 1);
    //     }
    // };

    const handleSubmit = (event) => {
        // event.preventDefault();
        // Perform your POST request here
        console.log('Form submitted');
        const currentURL = window.location.href; // Get the current URL
        const dollPrice = currentPrice;
        selectedDoll.dollPrice = dollPrice;
        selectedDoll.dollSize = currentSize;

        axios.get('/api/addTo-cart', { params: { doll: selectedDoll, url: currentURL, dollCount: count } })
            .then(response => {
                // Handle the response if needed
                console.log('Doll added to cartList');
            })
            .catch(error => {
                // Handle the error if needed
                console.error('Error adding doll to cartList', error);
            });
    }




    return (
        <div>
        
            <Row className='doll-row' >
            <Col xs={12} md={6}>
                    <WishListButton isInWishList={isInWishList}
                        onWishListClick={handleWishListClick}></WishListButton>
                    <Card.Img variant="top" src={selectedDoll.ImgsSRC} />
                </Col>
                <Col key={2} style={{ textAlign: 'right' }} xs={6} md={6}>

                    <div className='product-info'>
                        <h1 style={{ margin: '5% 0' }}>{selectedDoll.name}</h1>

                        <Divider className="hr-wave" />

                        <h3 style={{ margin: '5% 0' }}>₪{currentPrice}.00</h3>
                        <h6 style={{ margin: '5% 0' }}>{selectedDoll.description}</h6>
                        <h6 style={{ margin: '5% 0' }}> {currentSize} - גודל המוצר בתמונה</h6>
                        <div className="size-buttons" style={{ width: '100%', margin: '5% 0' }}>
                            {dollSizes.map((size, index) => (
                                <Button
                                    key={index}
                                    id="product-size-button"
                                    style={selectedButtonIndex === index ? { backgroundColor: 'purple' } : null}
                                    onClick={() => (
                                        handleSizeAndPriceChange(index)
                                    )}
                                >{size}</Button>
                            )
                            )}
                        </div>
                        <div style={{ width: '100%', margin: '5% 0' }}>
                            <form className="cart-form" onSubmit={handleSubmit}>
                                <ProductCounter count={count} onCountChange={handleCountChange} />
                                {/* <div>
                                    <button className="button-cart plus" type="button" onClick={handleIncrement}>+</button>
                                    <input className="input-cart" type="text" value={count} disabled />
                                    <button className="button-cart minus" type="button" onClick={handleDecrement}>-</button>
                                </div> */}
                                <AddToCartButton />
                            </form>
                        </div>

                    </div>

                </Col>
                
            </Row>
        </div >
    )
}

export default DollProduct