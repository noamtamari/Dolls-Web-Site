import React, { useState } from 'react'
import axios from 'axios';
import '../../Components.css';
import { Container } from '@mui/material';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import HorizontalDivider from './HorizontalDivider';
import Button from 'react-bootstrap/Button';
import RegisterFrame from './RegisterFrame';
import Spinner from 'react-bootstrap/Spinner';



function LoginFrame({ onClose, onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const [logingError, setLogingError] = useState(false);


    const [isRegister, setIsRegister] = useState(false);

    const handleRegisterChange = () => {
        setIsRegister(!isRegister);
    }
    function handleSubmit(event) {
        setLoading(true);
        // console.log(event.target)
        event.preventDefault();
        const loginData = {
            username: event.target.formGridEmail.value,
            password: event.target.formGridPassword.value
        }
        // console.log(event.target.formGridEmail.value)
        axios.post('/api/login', loginData, { withCredentials: true })
            .then(response => {
                setLoading(false);
                onLoginSuccess();
                window.location.reload();
            })
            .catch(error => {
                // Handle the error if needed
                console.error(error);
                setLoading(false);
                setLogingError(true);
                console.log(logingError);
            });

    }
    function handleGoogleLogin(event) {
        event.preventDefault();

        // window.location.href = "http://localhost:5000/auth/google";
        window.location.href = "https://varda-dolls.onrender.com/auth/google";

    }
    return (
        <div className="floating-component">
            <button className='close-login-button' onClick={onClose}>X</button>
            {loading ? <div className='cart-spinner-div'>
                <Spinner animation="border" className='cart-spinner' />
            </div>
                : !isRegister ? <Container className='login-container'>
                    <h3 style={{ textAlign: 'center' }}>ברוך הבא!</h3>
                    <h5>כניסה לחשבונך</h5>
                    <div>
                        <h6>לא רשום?<Button id='un-register-link' onClick={handleRegisterChange} >לחץ כאן</Button></h6>
                    </div>
                    <hr className='hr-wave'></hr>
                    {logingError ? <div className='incorrect-pass'>שם משתמש או סיסמא לא נכונים</div> : null}
                    <Form className='login-form' onSubmit={handleSubmit}>
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
                            התחבר
                        </Button>
                    </Form>
                    <HorizontalDivider text="Or" />
                    <Container>
                        <Form onSubmit={handleGoogleLogin}>
                            <Button type="submit" id='google-login-button' > התחבר עם <img src="/images/google-color-icon.svg" alt="Icon" style={{ width: '10%', marginRight: '8px'}} /></Button>
                        </Form>
                    </Container>
                </Container>
                    : <RegisterFrame handleRegisterChange={handleRegisterChange} />
            }

        </div>)
}

export default LoginFrame