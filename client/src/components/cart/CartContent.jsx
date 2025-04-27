import React, { useState, useEffect } from 'react'
import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import '../../Components.css';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCounter from '../ProductCounter';
import '../../Components.css';
import PaymentCard from './PaymentCard';
// edsrf

function CartContent() {
    const [cartProducts, setCartProducts] = useState([]);
    const [totalCartProducts, setTotalCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Update totalCartProducts whenever cartProducts change
        setTotalCartProducts(cartProducts);
    }, [cartProducts]);

    useEffect(() => {
        axios
            .get('/api/get-cart', { withCredentials: true })
            .then(response => {
                if(response.data[0] === "empty cart"){
                    setCartProducts([])
                } else{
                    setCartProducts(response.data);
                }
                console.log(response.data)
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(error => {
                console.error(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, []);


    function handleDeleteFromCart(index) {
        cartProducts.splice(index, 1);
        console.log(cartProducts);
        axios.post('/api/update-cart', { params: { updateCartList: cartProducts }, withCredentials: true })
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

    // const [count, setCount] = useState(1);

    const handleCountChange = (index, newCount) => {
        // Create a copy of cartProducts to avoid directly modifying the state array
        const updatedCartProducts = [...cartProducts];
        updatedCartProducts[index].dollCount = newCount;
        setTotalCartProducts(updatedCartProducts);
    }

    if (loading) {
        return <div className='cart-spinner-div'>
            <Spinner animation="grow" className='cart-spinner' style={{ fontSize: '5rem' }} />
        </div>; // You can display a loader here
    }
    return (
        <div className="primary-font" style={{ textAlign: 'center' }}>
            {cartProducts.length === 0 ?
                <Container>
                    <h3 style={{ margin: '5% auto' }}>סל הקניות שלך ריק כרגע</h3>
                    <Button style={{ margin: '5% auto', backgroundColor: 'purple', border: 'none' }}><Link to='/חנות' className='navLink'>חזור לחנות</Link></Button>
                </Container>
                :
                <div style={{ margin: 'auto 3% ' }}>
                    <h1>My Cart</h1>

                    <Row style={{ display: 'inline-flex', flexDirection: 'row-reverse' }}>
                        <Col md={7} sm={12} className='cart-products-divider'>
                            <Table className="center-content" responsive="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th className="col-md-3 col-sm-4">כמות</th>
                                        <th className="col-md-3 col-sm-2">מחיר</th>
                                        <th className="col-md-6 col-sm-8" colSpan={3}>מוצר</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cartProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td className="col-md-2 col-sm-2">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <ProductCounter count={Number(product.dollCount)} onCountChange={(newCount) => handleCountChange(index, newCount)} />
                                                    {/* style={{ width: '80%', flex: '1', minWidth: '20px' }} */}
                                                </div>
                                            </td>

                                            <td className="col-md-3 col-sm-2">₪{product.dollPrice}</td>
                                            <td className="col-md-3 col-sm-2"><Link to={product.dollURL} className="cart-product-name" >{product.name}</Link></td>
                                            <td className="col-md-3 col-sm-4" ><Link to={product.dollURL}><img src={product.ImgsSRC} alt='' style={{ width: '90%' }}></img></Link></td>
                                            <td className="col-md-2 col-sm-2"><Button
                                                onClick={() => {
                                                    handleDeleteFromCart(index)
                                                }}
                                                style={{ backgroundColor: 'black', border: 'none' }}>X</Button></td>
                                        </tr>
                                    ))}


                                </tbody>
                            </Table>
                        </Col>
                        <Col md={5} sm={12}>
                            <PaymentCard totalProducts={totalCartProducts} />
                        </Col>
                    </Row>
                </div>
            }

        </div>
    )
}

export default CartContent