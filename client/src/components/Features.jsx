import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import '../Components.css';

function Features() {
    return (
        <div style={{backgroundColor:'#d1c4e9'}}>
        <Container>
            <h1 style={{ margin: '2% auto', paddingTop: '3%', textAlign: 'center', color: 'white' }}> ? למה לקנות אצלנו </h1>
            <Row>
                <Col xs={12} md={4}>
                    <Row>
                        <Col xs={12}>
                            <div style={{ marginBottom: '15%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1%' }}>
                                    <LocationOnIcon className="features-icon" sx={{ width: '15%', height: '15%' }} />
                                </div>
                                <div className="features-text">
                                    <div>משלוחי אקספרס לכל הארץ</div>
                                    <div>משלוחי אקספרס עד 3 ימי עסקים לכל הארץ!
                                        ₪משלוח חינם בקנייה מעל 400</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={4}>
                    <Row>
                        <Col xs={12}>
                            <div style={{ marginBottom: '15%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1%' }}>
                                    <SecurityIcon className="features-icon" sx={{ width: '15%', height: '15%' }}/>
                                </div>
                                <div className="features-text">
                                    <div>תשלום מאובטח</div>
                                    <div>האתר מאובטח באמצעות פרוטוקול SSL.
                                        כל המידע באתר מוצפן בתקני אבטחה המחמירים ביותר.</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={4}>
                    <Row>
                        <Col xs={12}>
                            <div style={{ marginBottom: '15%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1%' }}>
                                    <CardGiftcardIcon className="features-icon" sx={{ width: '15%', height: '15%' }}/>
                                </div>
                                <div className="features-text">
                                    <div>מבצעים והטבות לחברי מועדון</div>
                                    <div>חברי מועדון נהנים יותר! הצטרפו אל מועדון אנשי השמש ותיהנו ממבצעים והטבות.</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </div>
    )
}

export default Features