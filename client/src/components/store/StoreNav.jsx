import React, { useState } from 'react';
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { getCategories, getSubCategories } from '../AllDollsObjects';
import '../../Components.css';
import { Button } from 'react-bootstrap';

function StoreNav() {
    const categories = getCategories();
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    const handleToggle = (subCategory) => {
        setSelectedSubCategory(subCategory === selectedSubCategory ? '' : subCategory);
    };

    return (
        <Col md={3} sm={4}>
            {categories.map((category,index) => (
                <Row key={category} className="category-container" >
                    <div key={index} className="dropdown">
                        <Button style={{color:'#d1c4e9', backgroundColor:'transparent',border:'none'}}
                            onClick={() => handleToggle(category)}
                            className="dropdown-icon"
                        >
                            {selectedSubCategory === category ? '▲' : '▼'}
                        </Button>
                        <Link key={index+1000} className="categories-text" to={`/חנות/${category}`}>
                            {category}
                        </Link>
                    </div>
                    {selectedSubCategory === category && (
                        <div key={index+10} style={{ textAlign: 'right' }}>
                            {getSubCategories(category).map((subCategory,index) => (
                                <div key={index+100}>
                                    <Link
                                        key={`${category}-${subCategory}`}
                                        className="sub-categories-text"
                                        style={{ textAlign: 'center' }}
                                        to={`/חנות/${subCategory}`}
                                    >
                                        {subCategory}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </Row>
            ))}


        </Col>
    );
}

export default StoreNav;
