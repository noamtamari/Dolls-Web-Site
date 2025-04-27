import React from 'react';
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import '../../Components.css';

function AccountSideBar() {
    const categories = ['הזמנות', 'אמצעי תשלום', 'עריכת החשבון', 'כתובות', 'התנתקות'];

    return (
        <Col md={3} sm={4} className='accountNavBarCol'>
            {categories.map((category, index) => (
                <Row key={category} className="category-container accountNavBarRow" >
                    <div key={index} className="dropdown accountNavBarDiv" >

                        <Link key={index + 1000} className="categories-text" to={`/החשבון שלי/${category}`}>
                            {category}
                        </Link>
                    </div>

                </Row>
            ))}


        </Col>
    )
}

export default AccountSideBar