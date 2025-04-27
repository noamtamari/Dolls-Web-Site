import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import axios from 'axios';
import ResponsiveAppBar from '../components/homepage/ResponsiveAppBar';
import Footer from '../components/Footer';
import Features from '../components/Features';
import Spinner from 'react-bootstrap/Spinner';
import '../Components.css';
import LoginFrame from '../components/LoginOrRegister/LoginFrame';
import { Button } from 'react-bootstrap';
import AccountContent from '../components/account/AccountContent';
import { Outlet } from 'react-router-dom';
import AccountNavBar from '../components/account/AccountNavBar';


function AccountPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFloatingOpen, setIsFloatingOpen] = useState(true);

    const handleLoginSuccess = () => {
        setIsLogin(true);
        // wishlistCount = UseWishlistData().length;
        // cartlistCount = UseCartListData().length;
    };

    const handleFloatingToggle = () => {
        setIsFloatingOpen(!isFloatingOpen);
    };

    useEffect(() => {
        axios
            .get('/api/get-login', { withCredentials: true })
            .then(response => {
                setIsLogin(JSON.parse(response.data));

                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(error => {
                console.error(error);
                setLoading(false); // Set loading to false on error as well
            });
    }, []);




    return (
        <div>
            <ResponsiveAppBar />
            {loading ? <div className='cart-spinner-div'>
                <Spinner animation="grow" className='cart-spinner' style={{ fontSize: '5rem' }} />
            </div> : isLogin ? <div>
                <AccountContent />
                <Outlet />

            </div>
                :
                <div>
                    {isFloatingOpen && <LoginFrame onClose={handleFloatingToggle} onLoginSuccess={handleLoginSuccess} />
                    }
                    <div style={{ textAlign: 'center', margin: '4% auto' }}>
                        <h3>על מנת לגשת לחשבונך עליך להתחבר</h3>
                        <Button
                            style={{ margin: '4% auto', backgroundColor: 'purple', border: 'none' }}
                            onClick={handleFloatingToggle}>להתחברות או להרשמה</Button>
                    </div>
                </div>

            }
            <Footer />
            <Features />
        </div>
    )
}

export default AccountPage