import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';

function WishListButton({ isInWishList, onWishListClick }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {isInWishList ? "WishList - הסירו מה"  : "WishList - הוסיפו ל" }
    </Tooltip>
  );

  return (
    <div className="wishList-div" style={{ width: 'calc(5vw)', height: 'calc(5vw)' }}>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        <button className="wishList-button" onClick={onWishListClick}>
          <FavoriteIcon id="wishList-icon" sx={{ color: isInWishList ? 'red' : '#a16bf7' }} />
        </button>
      </OverlayTrigger>
    </div>
  );
}

export default WishListButton;
