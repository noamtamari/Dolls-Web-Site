import React, { useState } from 'react'
import axios from 'axios';
import '../../Components.css';
import { Container } from '@mui/material';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import HorizontalDivider from './HorizontalDivider';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';



function RegisterFrame({ handleRegisterChange }) {
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState(false);

    function handleSubmit(event) {
        console.log("Registering new Version")
        setLoading(true);
        event.preventDefault();
        const registerData = {
            username: event.target.formGridEmail.value,
            password: event.target.formGridPassword.value
        }
        // console.log(event.target.formGridEmail.value)
        axios.post('/api/register', registerData, { withCredentials: true })
            .then(response => {
                setLoading(false);
                // Handle the response if needed
                console.log("Response for registration "+response);
                window.location.reload();
                // Check if the registration was successful (status code 200)

                // if (response.data === 'error') {
                //     handleRegisterChange();
                // } else {
                //     setRegisterError(true);
                // }
            })
            .catch(error => {
                setLoading(false);
                setRegisterError(true);
                // Handle the error if needed
                console.error("Register Error: "+error);
            });
    
    }
    return (
        
        <div>
            {loading ? <div className='cart-spinner-div'>
                <Spinner animation="border" className='cart-spinner' />
            </div> :
            <Container className='login-container'>
                <h3 style={{ textAlign: 'center' }}>ברוך הבא!</h3>
                <h5>הרשמה</h5>
                <div>
                    <h6> רשום כבר?<Button id='un-register-link' onClick={handleRegisterChange} >לחץ כאן</Button></h6>
                </div>
                <hr className='hr-wave'></hr>
                {registerError ? <div className='incorrect-pass'>כתובת דוא"ל זו נמצאת בשימוש, אנא נסה אחרת</div> : null}
                <Form className='register-form' onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>כתובת דואר אלקטרוני</Form.Label>
                            <Form.Control type="email" placeholder="הכנס שם פרטי" />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>סיסמא</Form.Label>
                            <Form.Control type='password' placeholder="הכנס שם פרטי" />
                        </Form.Group>
                    </Row>
                    <Button id='login-button' variant="primary" type="submit">
                        הירשם
                    </Button>
                </Form>
                {/* <HorizontalDivider text="Or" />
                <Container>
                    <Button id='google-login-button' ><img src="/images/google-color-icon.svg" alt="Icon" style={{ width: '10%' }} /> הירשם עם</Button>

                </Container> */}
            </Container>
}
        </div>
    )
}

export default RegisterFrame