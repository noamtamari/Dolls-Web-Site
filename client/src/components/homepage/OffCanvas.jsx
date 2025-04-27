// import { useState } from 'react';
import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import Nav from 'react-bootstrap/Nav';
import '../../Components.css';
import { Link } from "react-router-dom";




function OffCanvas({ pages, show, handleClose, setIsFloatingOpen,handleLoggedOut }) {
  // const [show, setShow] = useState(true);
  console.log(pages)

  // const handleClose = () => setShow(false);
  // const pages = ['דף הבית', 'חנות', 'החשבון שלי', 'WishList', 'התחבר', 'סל קניות']; 
  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header style={{ backgroundColor: '#d1c4e9' }}>
          <CloseButton onClick={handleClose}></CloseButton>
          <Offcanvas.Title>תפריט</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ padding: '0' }}>
          <Nav defaultActiveKey="/home" className="flex-column canvasStack">
            {pages.map((page) => (
              <div key={page} className="VNavItem primary-font"><Link key={page} className="navLink"
              style={{fontSize:'1.2rem'}}
                to={page !== 'התחבר' && page !== 'התנתק'  ? `/${page}` : null}
                onClick={() => {
                  if (page === 'התחבר') {
                    handleClose();
                    setIsFloatingOpen(true); // Update the isFloatingOpen state in ResponsiveAppBar
                  } else if (page === 'התנתק') {
                    handleClose();
                    handleLoggedOut(); // Perform logout logic
                  }
                }}>{page}</Link></div>
            ))}


          </Nav>

        </Offcanvas.Body>
      </Offcanvas >
    </>
  );
}

export default OffCanvas;