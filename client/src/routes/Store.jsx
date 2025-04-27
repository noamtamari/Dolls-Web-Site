import React from 'react'
import ResponsiveAppBar from '../components/homepage/ResponsiveAppBar';
import StoreNav from '../components/store/StoreNav';
import Footer from '../components/Footer';
import Features from '../components/Features.jsx';
import { Outlet, useLoaderData, } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../Components.css';

function Store() {
    const { dolls } = useLoaderData();
    // console.log(dolls);
    return (
        <div className="primary-font">
            <ResponsiveAppBar />
            <div style={{ margin: '2% 6%' }}>
                <Row style={{ justifyContent: 'flex-end' }}>
                    <Col>
                        <Outlet />
                    </Col>
                    <StoreNav />
                </Row>
            </div>
            <Footer />
            <Features />

        </div>
    )
}

export default Store