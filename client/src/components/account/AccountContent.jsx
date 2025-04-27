import React, { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import axios from 'axios';
import { useLocation } from 'react-router-dom';


import Spinner from 'react-bootstrap/Spinner';
import '../../Components.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function AccountContent() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const isAccountPage = decodeURIComponent(location.pathname) === '/החשבון שלי';

  useEffect(() => {
    axios
      .get('/api/get-user-data', { withCredentials: true })
      .then(response => {

        const userObject = response.data;
        setUserData(userObject);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error(error);
        setLoading(false); // Set loading to false on error as well
      });
  }, []);



  return (
    <div>
      {isAccountPage && (
        <Container>
          <Row>
            <div style={{ textAlign: 'right', margin: '4%' }}>
              <span style={{ color: 'purple', }}>{userData.displayName} </span>שלום
            </div>
          </Row>


          <Row>
            <div style={{ textAlign: 'right', margin: '0% 4%' }}>
              מדף זה ניתן לצפות בהזמנות האחרונות, לערוך את פרטי החשבון, להוסיף אמצעי תשלום וכתובות לחיוב
            </div>
          </Row>
          <Container style={{ margin: '4%' }}>
            <Row style={{ justifyItems: 'center', flexDirection: 'row-reverse', textAlign: 'center' }}>
              <Col md={6} xs={12} >
                <Link to={'/החשבון שלי/הזמנות'}>  <Button id='account-options-buttons' >הזמנות</Button></Link>
              </Col>
              <Col md={6} xs={12}>
                <Button id='account-options-buttons'>אמצעי תשלום</Button>
              </Col>
              <Col md={6} xs={12}>
                <Button id='account-options-buttons' >עריכת החשבון</Button>
              </Col>
              <Col md={6} xs={12}>
                <Button id='account-options-buttons' >כתובות</Button>
              </Col>
            </Row>
          </Container>
        </Container>
      )}
    </div >
  )
}

export default AccountContent