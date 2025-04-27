import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../Components.css';
import ResponsiveAppBar from '../homepage/ResponsiveAppBar';
import Footer from '../Footer';
import Features from '../Features';
import { Container, Spinner } from 'react-bootstrap';
import ErrorPage from '../../routes/ErrorPage';



function ConfirmationPage() {
    const [orderNumber, setOrderNumber] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    useEffect(() => {
        axios
            .get('/api/check-out',)
            .then((response) => {
                const orderNumber = response.data;
                setLoading(false);
                // onSubmit(orderNumber);
                setOrderNumber(response.data);
                console.log('Check Out successfully ' + orderNumber);
            })
            .catch((error) => {
                console.error('Error Checking Out', error);
                setError(true)
                // onSubmit("error");
            });
    }, []);
    useEffect(() => {
        axios.post('/api/update-cart', { params: { updateCartList: [] }, withCredentials: true })
            .then(response => {
                // Handle the response if needed
                console.log(response);
            })
            .catch(error => {
                // Handle the error if needed
                console.error(error, "Error clearing cart");
            });
    }, []);


    return (

        <div>
            {error ? <ErrorPage></ErrorPage>
                :
                <div>

                    {loading ? <div className='cart-spinner-div'>
                        <Spinner animation="grow" className='cart-spinner' style={{ fontSize: '5rem' }} />
                    </div> : orderNumber === null ?
                        <h1>שגיאה בביצוע ההזמנה, אנא נסה שנית</h1>
                        :
                        <div>
                            <ResponsiveAppBar />
                            <div style={{ textAlign: 'center', margin: '5% auto' }}>
                                <h1>מספר ההזמנה שלכם הוא: {orderNumber}</h1>
                                <h1>תודה שהזמנתם! נשמח לראותכם שוב</h1>
                            </div>
                        </div>
                    }
                    <Features />
                    <Footer />
                </div>

            }


        </div>


    )
}

export default ConfirmationPage