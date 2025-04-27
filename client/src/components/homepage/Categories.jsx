import React from 'react'
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import MultiActionAreaCard from './MultiActionAreaCard.jsx';
import '../../App.css';


import { getCategories, getSubCategories, getCategoryImage } from '../AllDollsObjects.jsx';


function Categories() {

    const categories = getCategories();
    return (
        <Container className="primary-font" style={{ marginTop: '2%' }}>
            <Row style={{ justifyContent: 'space-evenly' }}>
                {categories.map((category, index) => (
                    <Col key={category} md={4} xs={4}>
                        <MultiActionAreaCard key={category} name={category} src={getCategoryImage(category)} />
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Categories