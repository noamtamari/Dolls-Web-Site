import React from 'react'
import { Link, useRouteError } from "react-router-dom";
import ResponsiveAppBar from '../components/homepage/ResponsiveAppBar';
import Footer from '../components/Footer';
import { Button } from 'react-bootstrap';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" style={{textAlign:'center'}}>
      <ResponsiveAppBar></ResponsiveAppBar>
      <h1 style={{margin:'3% auto'}}>שגיאה!</h1>
      <p>לא הצלחנו למצוא את מה שאתה מחפש</p>
      <Button style={{ margin: '5% auto', backgroundColor: 'purple', border: 'none' }}><Link to='/' className='navLink'>בחזרה לדף הבית</Link></Button>
      <Footer></Footer>
    </div>
  );
}

export default ErrorPage