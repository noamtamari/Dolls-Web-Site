import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import '../../Components.css';
import { Container } from '@mui/material';
import { Spinner } from 'react-bootstrap';

function CheckOutForm({ onSubmit, cartProducts, onFormValidityChange, onFormChange }) {
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
        orderNotes: '',
    });

    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        onFormValidityChange(document.getElementById('checkout-form').checkValidity());

        const { name, value } = e.target;
        onFormChange(name, value);


        if (name.startsWith('address.')) {
            // Handle address fields
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value,
                },
            });
        } else {
            // Handle other fields
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };



    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     // Now, 'formData' contains the updated data structure
    //     const orderPrice = cartProducts.reduce((total, product) => {
    //         return total + product.dollCount * product.dollPrice;
    //     }, 0)
    //     formData.orderPrice = orderPrice;
    //     console.log('Form Data:', formData);

    //     setLoading(true);
    //     axios
    //         .post('/api/check-out', { params: { cartProducts: cartProducts, formData } })
    //         .then((response) => {
    //             const orderNumber = response.data;
    //             setLoading(false);
    //             onSubmit(orderNumber);
    //             console.log('Check Out successfully ' + orderNumber);
    //         })
    //         .catch((error) => {
    //             console.error('Error Checking Out', error);
    //             onSubmit("error");
    //         });
    // };

    if (loading) {
        return (
            <div className='cart-spinner-div'>
                <Spinner animation="grow" className='cart-spinner' style={{ fontSize: '5rem' }} />
            </div>
        );
    }

    return (
        <Container>
            <Form id="checkout-form" className='check-out-form' >
                <h4>פרטי חיוב</h4>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formName">
                        <span style={{ color: 'red' }}>*</span>
                        <Form.Label>שם פרטי</Form.Label>
                        <Form.Control
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="הכנס שם פרטי"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formLastName">
                        <span style={{ color: 'red' }}>*</span>
                        <Form.Label>שם משפחה</Form.Label>
                        <Form.Control
                            required
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="הכנס שם משפחה"
                        />
                    </Form.Group>
                </Row>

                <Form.Group controlId="formTelephone">
                    <span style={{ color: 'red' }}>*</span>
                    <Form.Label>טלפון</Form.Label>
                    <Form.Control
                        required
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formGridEmail">
                    <span style={{ color: 'red' }}>*</span>
                    <Form.Label>אימייל</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} className="mb-3" controlId="formAddress1">
                        <span style={{ color: 'red' }}>*</span>
                        <Form.Label>רחוב</Form.Label>
                        <Form.Control
                            required
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            placeholder="הכנס שם רחוב"
                        />
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3" controlId="formAddress2">
                        <span style={{ color: 'red' }}>*</span>
                        <Form.Label>מספר בית</Form.Label>
                        <Form.Control
                            required
                            name="address.houseNumber"
                            value={formData.address.houseNumber}
                            onChange={handleChange}
                            placeholder="הכנס מספר בית"
                        />
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3" controlId="formAddress3">
                        <span style={{ color: 'red' }}>*</span>
                        <Form.Label>דירה</Form.Label>
                        <Form.Control
                            required
                            name="address.apartmentNumber"
                            value={formData.address.apartmentNumber}
                            onChange={handleChange}
                            placeholder="הכנס מספר דירה"
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formCity">
                        <span style={{ color: 'red' }}>*</span>
                        <Form.Label>עיר</Form.Label>
                        <Form.Control
                            required
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formZip">
                        <Form.Label>מיקוד</Form.Label>
                        <Form.Control
                            name="address.zip"
                            value={formData.address.zip}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formNotes">
                    <Form.Label>הערות להזמנה</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="orderNotes"
                        value={formData.orderNotes}
                        onChange={handleChange}
                    />
                </Form.Group>

                {/* <Button variant="primary" type="submit">
                    לביצוע ההזמנה
                </Button> */}
            </Form>
        </Container>
    );
}

export default CheckOutForm;
