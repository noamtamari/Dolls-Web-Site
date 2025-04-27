import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Row } from 'react-bootstrap';
import { getDoll, getSubCategoryImage, getSubCategoryDollsNum } from '../AllDollsObjects';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../Components.css';

function StoreContent() {
    const selectedCategory = useParams().category;
    const selectedPage = Number(useParams().page);
    // console.log(typeof selectedPage);

    const selectedCategoryDolls = getDoll(selectedCategory);
    const isSubCategory = typeof getDoll(selectedCategory)[0] !== "string" ? true : false;
    // console.log(getDoll(selectedCategory));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (selectedPage) {
            setCurrentPage(selectedPage);
        }
    }, [selectedPage]);


    const dollsPerPage = 12;

    const indexOfLastDoll = currentPage * dollsPerPage;
    const indexOfFirstDoll = indexOfLastDoll - dollsPerPage;
    const currentDolls = selectedCategoryDolls.slice(indexOfFirstDoll, indexOfLastDoll);

    const totalPages = Math.ceil(selectedCategoryDolls.length / dollsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            <Row>
                {isSubCategory ? currentDolls.map((doll, index) => (
                    <Col key={index} md={4} sm={4}>
                        <Card style={{ marginBottom: '5%' }}>
                            <Link className='product-nav-link' to={`/חנות/${selectedCategory}/${doll.name}`}>
                                <div style={{ position: 'relative', paddingTop: '100%' }}>
                                    <Card.Img
                                        variant="top"
                                        src={doll.ImgsSRC}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                                <Card.Body className='product-body'>
                                    <Card.Title id='product-title'>{doll.name}</Card.Title>
                                    <Card.Text id='product-text'>₪{doll.price[0]}.00</Card.Text>
                                    <Button style={{backgroundColor:'purple', border:'none'}}>בחר אפשרויות</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                ))
                    :
                    selectedCategoryDolls.map((subCategory, index) => (

                        <Col key={index} md={4} sm={4} style={{ justifyContent: 'space-evenly' }}>
                            <Link key={index} to={`/חנות/${subCategory}`} style={{ textDecoration: 'solid' }} >
                                <Card style={{ marginBottom: '5%' }}>
                                    <div style={{ position: 'relative', paddingTop: '100%' }}>
                                        <Card.Img variant="top" src={getSubCategoryImage(subCategory)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                    <Card.Body className='product-body'>
                                        <Card.Title id='product-title'>{subCategory}</Card.Title>
                                        <Card.Text id='product-text' style={{ display: 'inline-flex' }}>
                                            <span key={1} style={{ marginRight: '6%' }}>מוצרים</span>
                                            <span>{getSubCategoryDollsNum(subCategory)}</span>
                                        </Card.Text>
                                    </Card.Body>

                                </Card>
                            </Link>
                        </Col>
                    ))
                }
            </Row>
            {
                isSubCategory ?
                    <Row>
                        <div className='page-nav'>
                            {currentPage !== 1 && currentPage <= totalPages ?
                                <Link key="previous"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    to={`/חנות/${selectedCategory}/page/${currentPage - 1}`}
                                    style={{ marginLeft: '2%' }}>
                                    <Button
                                        id='page-nav-button'
                                    >ᐅ</Button>
                                </Link>
                                :
                                null
                            }
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Link key={index} onClick={() => handlePageChange(index + 1)}
                                    to={`/חנות/${selectedCategory}/page/${index + 1}`}
                                    style={{ marginLeft: '1%' }}>
                                    <Button key={index}
                                        id='page-nav-button'
                                        style={index + 1 === currentPage ? { backgroundColor: '#9e8bc0' } : null}
                                    >
                                        {index + 1}

                                    </Button>
                                </Link>
                            ))}
                            {currentPage !== totalPages ?
                                <Link key="next-page" onClick={() => handlePageChange(currentPage + 1)}
                                    to={`/חנות/${selectedCategory}/page/${currentPage + 1}`}
                                >
                                    <Button
                                        id='page-nav-button'
                                    >ᐊ</Button>
                                </Link>
                                :
                                null
                            }
                        </div>
                    </Row>
                    : null
            }
        </div >
    );
}

export default StoreContent;
