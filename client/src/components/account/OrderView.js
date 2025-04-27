import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AccountSideBar from './AccountSideBar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';


function OrderView(props) {
    const { orderNumber } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);

    console.log(orderNumber)
    useEffect(() => {
        axios
            .get(`/api/get-order/${orderNumber}`, { withCredentials: true })
            .then(response => {
                setOrder(response.data);
                setLoading(false)

            })
            .catch(error => {
                console.error(error);
            });
    }, [orderNumber]);

    return (
        <div>
            <div className='ordersHeadDiv primary-font'>
                <h1>ההזמנה שלי</h1>
            </div>
            {loading ?
                <div className='cart-spinner-div'>
                    <Spinner animation="grow" className='cart-spinner' style={{ fontSize: '5rem' }} />
                </div>
                :
                <div>
                    <Row style={{ margin: '5% 3%', display: 'flex', direction: 'rtl' }}>
                        <AccountSideBar />
                        <Col>
                            <p style={{ textAlign: 'right' }}>הזמנה {orderNumber} <span>בוצעה בתאריך {order.date}</span></p>
                            <div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">מוצר</th>
                                            <th scope="col" style={{ textAlign: 'left' }}>סה"כ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {order.productsList.map((product, index) => (
                                            <tr key={"tr" + index}>

                                                <td key={"td" + index}>
                                                    <p key={"p" + index}>
                                                        <span>{product.name}</span>
                                                        <span style={{ display: 'block' }}>x{product.dollCount}</span>
                                                        <span style={{ display: 'block' }}>מידה: {product.dollSize}</span>
                                                    </p>
                                                </td>
                                                <td style={{ textAlign: 'left' }}>
                                                    <span>₪{product.dollPrice * product.dollCount}</span>

                                                </td>


                                            </tr>
                                        ))}
                                        <tr>
                                            <td>
                                                <p>סכום ביניים</p>
                                            </td>
                                            <td style={{ textAlign: 'left' }}>
                                                <span>₪{order.orderPrice}</span>                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>

                    </Row>
                </div>
            }
        </div>
    )
}

export default OrderView