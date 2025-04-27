import React from 'react'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import '../../Components.css';
import { Button } from 'react-bootstrap';
function WhatsAppButton() {
  return (
    <div className='whatsApp-fixed-div'>
      <Button id='whatsAppButton'  href='https://wa.me/972547778374'> <WhatsAppIcon /> </Button>
    </div>
  )
}

export default WhatsAppButton