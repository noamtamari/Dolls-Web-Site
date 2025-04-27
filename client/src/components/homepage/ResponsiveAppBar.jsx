import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
// import { useWishlistCounter } from './useWishListCounter';
import { UseWishlistData } from '../wishList/UseWishlistData';
import { UseCartListData } from '../cart/UseCartListData';


import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ThemeProvider } from '@mui/material/styles';
import { LoginData } from '../LoginOrRegister/LoginData';

// import { UseWishlistData } from './UseWishlistData';

import OffCanvas from './OffCanvas.jsx';
import ColorThemes from '../ColorThemes.jsx';

import '../../App.css'
import LoginFrame from '../LoginOrRegister/LoginFrame';
import { Link } from 'react-router-dom';

// let pages = ['דף הבית', 'חנות', 'החשבון שלי', 'WishList', 'התחבר', 'Cart'];

function ResponsiveAppBar() {
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [pages, setPages] = useState(['דף הבית', 'חנות', 'החשבון שלי', 'WishList', 'התחבר', 'Cart']);




  let wishlistCount = UseWishlistData().length;
  let cartlistCount = UseCartListData();
  if(cartlistCount[0] === "empty cart"){
    cartlistCount = 0;
  } else{
    cartlistCount = cartlistCount.length;
  }

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    // wishlistCount = UseWishlistData().length;
    // cartlistCount = UseCartListData().length;
  };
  

  const isLoggedIn = LoginData();
  useEffect(() => {
    // Wrap the logic inside an arrow function to prevent unnecessary re-renders
    const updatePages = () => {
      if (isLoggedIn || loggedIn) {
        setPages(['דף הבית', 'חנות', 'החשבון שלי', 'WishList', 'התנתק', 'Cart']);
      } else {
        setPages(['דף הבית', 'חנות', 'החשבון שלי', 'WishList', 'התחבר', 'Cart']);
      }
    };

    updatePages(); // Call the updatePages function initially

    // Now, we only trigger the updatePages function if the isLoggedIn value changes
  }, [isLoggedIn,loggedIn]);


  const handleFloatingToggle = () => {
    setIsFloatingOpen(!isFloatingOpen);
  };

  function handleOpenNavCanvas(event) {
    setShowOffCanvas(!showOffCanvas);
  }

  

  

  function handleLoggedOut() {
    axios.post('/api/log-out', { withCredentials: true })
      .then(response => {
        window.location.reload();
        setLoggedIn(false);
      })
      .catch(error => {
        // Handle the error if needed
        console.error(error);
      });
  }

  return (
    <ThemeProvider theme={ColorThemes}>
      <AppBar position="static" color="primary" enableColorOnDark={true}>

        <Container maxWidth="xl" style={{ direction: 'rtl' }}>
          <Toolbar disableGutters>
            <PetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                // fontSize:'1.1rem',
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              VARDA's DOLLS
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavCanvas}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              {showOffCanvas && <OffCanvas 
              show={showOffCanvas} 
              handleClose={handleOpenNavCanvas} 
              setIsFloatingOpen={setIsFloatingOpen} 
              pages={pages}
              handleLoggedOut={handleLoggedOut}
              />}
            </Box>


            <PetsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              // variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontSize:'100%',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              VARDA's DOLLS
            </Typography>
            <Link to={'/Cart'}>
            <Button sx={{ color: 'white', display: { xs: 'flex', md: 'none' } }}><ShoppingCartIcon />
              <Badge badgeContent={cartlistCount} color='secondary' style={{ left: '65%', bottom: '50%' }}>
              </Badge>
            </Button>
            </Link>


            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link style={{marginRight:'5%',padding:'auto 2%'}} key={page} to={page !== 'התחבר' && page !== 'התנתק' ? `/${page}` : null}>
                  <Button
                    key={page}
                    // href={page !== 'התחבר' ? `/${page}` : null}
                    id='app-nav-button'
                    onClick={page === 'התחבר' ?
                      handleFloatingToggle
                      : page === 'התנתק' ?
                        handleLoggedOut : null}
                    sx={{ my: 2, color: 'white', display: 'inline-flex', fontSize: '1.2rem' }}
                  >
                    {page !== 'Cart' ?
                      page
                      :
                      <>
                        <ShoppingCartIcon />
                        <Badge badgeContent={cartlistCount} color='secondary' style={{ left: '65%', bottom: '50%' }}>
                        </Badge>
                      </>}
                    {page === 'WishList' ?
                      <Badge
                        badgeContent={wishlistCount}
                        color="secondary"
                        style={{ left: '110%', bottom: '50%' }}
                      ></Badge> : null}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem key={index} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> */}
          </Toolbar>
        </Container>
      </AppBar>
      {isFloatingOpen && <LoginFrame onClose={handleFloatingToggle} onLoginSuccess={handleLoginSuccess} />}
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;