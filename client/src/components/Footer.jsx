import React from 'react'
// import Button from 'react-bootstrap/Button';
import InstagramIcon from '@mui/icons-material/Instagram';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../Components.css'; // Import custom CSS file




function Footer() {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            :) עקבו אחרינו באינסטגרם 
        </Tooltip>
    );

    return (
        <div style={{ margin: '1% auto', display: 'flex', justifyContent: 'center' }}>
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <a href="https://www.instagram.com/vardadb/?igshid=MzRlODBiNWFlZA%3D%3D"><InstagramIcon className="footer-icon" sx={{width:"75px", height:"75px",color:'#7e57c2'}} variant="success" /></a> 
        </OverlayTrigger>
        <h4 style={{ margin: 'auto 1%',color:'#7e57c2' }}>FOLLOW US</h4>
        </div>
    );
}

export default Footer