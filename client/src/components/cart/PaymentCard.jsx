import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';

function PaymentCard({ totalProducts }) {
    const totalPayment = totalProducts.reduce((total, product) => {
        return total + product.dollCount * product.dollPrice;
    }, 0);
    return (
        <div>
            <Card style={{  textAlign: 'right' }}>
                <Card.Body>
                    <Card.Title>סה"כ בסל הקניות</Card.Title>
                    <hr></hr>
                    <div style={{ justifyContent: 'space-between', display: 'flex', direction: 'rtl' }}>
                        <Card.Text>
                            סה"כ לתשלום
                        </Card.Text>
                        <Card.Text>
                        ₪{totalPayment}.00
                        </Card.Text>
                    </div>
                    <Link to='/Check-out'>
                    <Button style={{backgroundColor:'purple', border:'none'}}>מעבר לתשלום</Button>
                    </Link>

                </Card.Body>
            </Card>

        </div>
    )
}

export default PaymentCard