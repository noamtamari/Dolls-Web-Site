import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountSideBar from './AccountSideBar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function OrderContent() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get('/api/get-orders', { withCredentials: true })
      .then(response => {
        setOrders(response.data);
        console.log(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  // Fetch and display a list of orders here

  const handleOrderClick = (orderID) => {
    navigate(`/החשבון שלי/הזמנות/${orderID}`);
  };



  return (
    <div>
      <div className='ordersHeadDiv primary-font'>
        <h1>ההזמנות שלי</h1>
      </div>
      {loading ? <div className='cart-spinner-div'>
            <Spinner animation="grow" className='cart-spinner' style={{ fontSize: '5rem' }} />
        </div> : <Row style={{ margin: '5% 3%', display: 'flex', direction: 'rtl' }}>
        <AccountSideBar />
        <Col>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">מס' הזמנה</th>
                  <th scope="col">תאריך</th>
                  <th scope="col">סטטוס</th>
                  <th scope="col">סה"כ</th>
                  <th scope="col">פעולות</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {orders.map((order,index) => (
                  <tr key={"tr"+index}>
                    <td>{order.orderNumber}</td>
                    <td>{order.date}</td>
                    <td>-</td>
                    <td>
                      ₪{order.productsList
                        .map(product => parseFloat(product.dollPrice) * parseFloat(product.dollCount))
                        .reduce((acc, currentValue) => acc + currentValue, 0)}
                    </td>

                    <td><Button id='product-size-button' onClick={() => handleOrderClick(order.orderNumber)}>
                      צפייה בהזמנה
                    </Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>

      </Row>}
          </div>
  );

}

export default OrderContent;
