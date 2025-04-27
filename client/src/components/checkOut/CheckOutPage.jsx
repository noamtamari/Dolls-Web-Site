import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Container } from '@mui/material';
import Features from '../Features';
import Footer from '../Footer';
import ResponsiveAppBar from '../homepage/ResponsiveAppBar';
import CheckOutForm from './CheckOutForm';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import '../../Components.css';
// import './checkOutCss.css';
import { Button, Spinner } from 'react-bootstrap';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutPayment from './CheckOutPayment';
// import CheckOutPayment from './checkOutPayment';

const stripePromise = loadStripe("pk_test_51O9QSFCM6LfZFndAfWthNmthiZDrMLmrdmU34whf41SvcvUenCHw6rIUWs5DoMVSNR6j6HwZPbG2wfaFjLkQcIbP00YWbGgD4n");

function CheckOutPage() {
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openPaymentOption, setOpenPaymentOption] = useState(false)
    const [checkOutStatus, setCheckOutStatus] = useState(false);
    const [orderNumber, setOrderNumber] = useState(null);
    const [formValidity, setFormValidity] = useState(false);
    const [form, setForm] = useState(document.getElementById('checkout-form'));
    const totalPayment = cartProducts.reduce((total, product) => {
        return total + product.dollCount * product.dollPrice;
    }, 0);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        telephone: '',
        email: '',
        address: {
            street: '',
            houseNumber: '',
            apartmentNumber: '',
            city: '',
            zip: '',
        },
        orderPrice: 0,
        orderNotes: '',
    });

    const totalProducts = cartProducts.reduce((total, product) => {
        return total + Number(product.dollCount);
    }, 0)
    const handleFormSubmit = (generatedOrderNumber) => {
        setOrderNumber(generatedOrderNumber);
        setCheckOutStatus(true);
        // setLoading(true);
    };

    const handleFormValidityChange = (isValid) => {
        setFormValidity(isValid);
    };
    const handleFormChange = (name, value) => {
        setFormData((prevFormData) => {
            if (name.startsWith('address.')) {
                // Handle address fields
                const addressField = name.split('.')[1];
                return {
                    ...prevFormData,
                    address: {
                        ...prevFormData.address,
                        [addressField]: value,
                    },
                };
            } else {
                // Handle other fields
                return {
                    ...prevFormData,
                    [name]: value,
                };
            }
        });
    }


    const handlePayClick = () => {
        if (formValidity) {
            setOpenPaymentOption(true);
        }
    }

    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {

        if (formValidity) {
            formData.orderPrice = totalPayment;

            // Create PaymentIntent as soon as the page loads
            fetch("/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totalPayment: totalPayment, formData: formData, cartProducts: cartProducts }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [formData, cartProducts, formValidity, totalPayment]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    useEffect(() => {
        axios
            .get('/api/get-cart', { withCredentials: true })
            .then(response => {
                if (response.data[0] === "empty cart") {
                    setCartProducts([])
                } else {
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



    return (
        <div>
            <ResponsiveAppBar />
            {orderNumber === 'error' ?
                <h1>שגיאה בביצוע ההזמנה, אנא נסה שנית</h1>
                :
                checkOutStatus ? <div style={{ textAlign: 'center', margin: '5% auto' }}>
                    <h1 key={'h1'}>מספר ההזמנה שלכם הוא: {orderNumber}</h1>
                    <h1 key={'h2'}>תודה שהזמנתם! נשמח לראותכם שוב</h1>
                </div> :
                    <Container>
                        <Row style={{ direction: 'rtl' }}>
                            <Col md={7} sm={7} className='cart-products-divider' style={{ margin: '4% auto' }}>
                                <CheckOutForm cartProducts={cartProducts} onSubmit={handleFormSubmit}
                                    onFormValidityChange={handleFormValidityChange} onFormChange={handleFormChange}
                                ></CheckOutForm>
                            </Col>

                            <Col md={5} sm={5} style={{ margin: '4% auto' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <h3>פרטי הזמנה</h3>
                                    <Container>
                                        <Row>
                                            <Col>מוצר</Col>
                                            <Col>כמות</Col>
                                            <Col>
                                                סכום ביניים
                                            </Col>
                                        </Row>

                                        {loading ?
                                            <div className='cart-spinner-div'>
                                                <Spinner animation="grow" className='cart-spinner' style={{ marginTop: '40%', fontSize: '5rem' }} />
                                            </div> :
                                            <div>
                                                {cartProducts.map((product, index) => (

                                                    <Row key={'row' + index} style={{ color: 'purple', marginTop: '5%' }}>
                                                        <Col key={'col1' + index}>
                                                            {product.name}
                                                        </Col>
                                                        <Col key={'col2' + index}>
                                                            {product.dollCount}
                                                        </Col>
                                                        <Col key={'col3' + index}>
                                                            ₪{product.dollPrice * product.dollCount}
                                                        </Col>
                                                    </Row>


                                                ))}
                                                <hr></hr>
                                                <Row>
                                                    <Col>
                                                        סה"כ לתשלום
                                                    </Col>
                                                    <Col>
                                                        {totalProducts}
                                                    </Col>
                                                    <Col>
                                                        ₪{totalPayment}
                                                    </Col>
                                                </Row>
                                                <Row style={{ margin: '3% auto' }}>
                                                    <Button style={{ backgroundColor: 'purple',border:'none' }} hidden={openPaymentOption} variant="primary" onClick={handlePayClick}>
                                                        לתשלום
                                                    </Button>
                                                </Row>
                                                {openPaymentOption ? <Row>
                                                    {clientSecret && (
                                                        <Elements options={options} stripe={stripePromise}>
                                                            <CheckOutPayment cartProducts={cartProducts} formValidity={formValidity}></CheckOutPayment>
                                                        </Elements>
                                                    )}
                                                </Row> : null}

                                            </div>

                                        }



                                    </Container>
                                </div>
                            </Col>

                        </Row>
                    </Container>
            }
            <Footer />
            <Features />
        </div>
    );
}

export default CheckOutPage;