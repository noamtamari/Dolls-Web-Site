/**
 * DollProduct.jsx
 *
 * This component represents the product page for a specific doll in the store.
 * It displays the doll's details, allows users to select size and quantity,
 * and provides functionality to add the doll to the wishlist or shopping cart.
 *
 * Key Features:
 * - Displays doll details such as name, description, price, and size.
 * - Allows users to select a size and dynamically updates the price.
 * - Integrates with the wishlist and cart functionality using API calls.
 * - Uses React state to manage user interactions and updates.
 * - Includes reusable components like `WishListButton`, `AddToCartButton`, and `ProductCounter`.
 */

import React, { useState } from "react";
import { useWishlistCounter } from "../wishList/useWishListCounter";

import axios from "axios";
// import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Divider } from "@mui/material";

import { useParams } from "react-router-dom";
import { getDollObject } from "../AllDollsObjects";
import "../../Components.css";
import { Button } from "react-bootstrap";
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';
import WishListButton from "../wishList/WishListButton";
import AddToCartButton from "../cart/AddToCartButton";
import ProductCounter from "../ProductCounter";

/**
 * DollProduct Component
 *
 * Props: None
 *
 * State:
 * - currentSize: The currently selected size of the doll.
 * - currentPrice: The price corresponding to the selected size.
 * - selectedButtonIndex: The index of the currently selected size button.
 * - isInWishList: Boolean indicating whether the doll is in the wishlist.
 * - count: The quantity of the doll selected by the user.
 *
 * Functions:
 * - handleSizeAndPriceChange: Updates the size, price, and selected button index when a size is selected.
 * - handleWishListClick: Toggles the wishlist state and makes API calls to add/remove the doll from the wishlist.
 * - handleCountChange: Updates the quantity of the doll selected by the user.
 * - handleSubmit: Handles the form submission to add the doll to the shopping cart.
 */

function DollProduct() {
  // Get the selected doll object based on the URL parameter
  const selectedDoll = getDollObject(useParams().product);

  // State variables for size, price, and selected button
  const dollSizes = selectedDoll.size;
  const [currentSize, setCurrentSize] = useState(selectedDoll.size[0]);
  const [currentPrice, setCurrentPrice] = useState(selectedDoll.price[0]);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  // Wishlist counter from custom hook
  const { addToWishlist } = useWishlistCounter();

  // Function to handle size and price changes
  const handleSizeAndPriceChange = (index) => {
    setCurrentSize(selectedDoll.size[index]);
    setCurrentPrice(selectedDoll.price[index]);
    setSelectedButtonIndex(index);
  };

  // State for wishlist toggle
  const [isInWishList, setIsInWishList] = useState(false);
  const handleWishListClick = () => {
    setIsInWishList(!isInWishList);
    // If the doll isn't in the wishlist, add it to the wishlist using an API call 
    if (!isInWishList) {
      const currentURL = window.location.href; // Get the current URL
      axios
        .get("/api/set-wishList", {
          params: { doll: selectedDoll, url: currentURL },
          withCredentials: true,
        })
        .then((response) => {
          // Handle the response if needed
          console.log("Doll added to wishlist");
          addToWishlist();
        })
        .catch((error) => {
          // Handle the error if needed
          console.error("Error adding doll to wishlist", error);
        });
    } else {
      axios
        .get("/api/update-wishList", {
          params: { doll: selectedDoll },
          withCredentials: true,
        })
        .then((response) => {
          // Handle the response if needed
          console.log(response);
        })
        .catch((error) => {
          // Handle the error if needed
          console.error(error);
        });
    }
  };

  // State for product quantity
  const [count, setCount] = useState(1);

  // Function to handle quantity changes
  const handleCountChange = (newCount) => {
    setCount(newCount);
  };

  // Function to handle form submission for adding to cart
  const handleSubmit = (event) => {
    // event.preventDefault();
    console.log("Form submitted");
    const currentURL = window.location.href; // Get the current URL
    const dollPrice = currentPrice;
    selectedDoll.dollPrice = dollPrice;
    selectedDoll.dollSize = currentSize;

    axios
      .get("/api/addTo-cart", {
        params: { doll: selectedDoll, url: currentURL, dollCount: count },
      })
      .then((response) => {
        // Handle the response if needed
        console.log("Doll added to cartList");
      })
      .catch((error) => {
        // Handle the error if needed
        console.error("Error adding doll to cartList", error);
      });
  };

  // Render the component
  return (
    <div>
      <Row className="doll-row">
        <Col xs={12} md={6}>
          <WishListButton
            isInWishList={isInWishList}
            onWishListClick={handleWishListClick}
          ></WishListButton>
          <Card.Img variant="top" src={selectedDoll.ImgsSRC} />
        </Col>
        <Col key={2} style={{ textAlign: "right" }} xs={6} md={6}>
          <div className="product-info">
            <h1 style={{ margin: "5% 0" }}>{selectedDoll.name}</h1>

            <Divider className="hr-wave" />

            <h3 style={{ margin: "5% 0" }}>₪{currentPrice}.00</h3>
            <h6 style={{ margin: "5% 0" }}>{selectedDoll.description}</h6>
            <h6 style={{ margin: "5% 0" }}>
              {" "}
              {currentSize} - גודל המוצר בתמונה
            </h6>
            <div
              className="size-buttons"
              style={{ width: "100%", margin: "5% 0" }}
            >
              {dollSizes.map((size, index) => (
                <Button
                  key={index}
                  id="product-size-button"
                  style={
                    selectedButtonIndex === index
                      ? { backgroundColor: "purple" }
                      : null
                  }
                  onClick={() => handleSizeAndPriceChange(index)}
                >
                  {size}
                </Button>
              ))}
            </div>
            <div style={{ width: "100%", margin: "5% 0" }}>
              <form className="cart-form" onSubmit={handleSubmit}>
                <ProductCounter
                  count={count}
                  onCountChange={handleCountChange}
                />
                {/* <div>
                                    <button className="button-cart plus" type="button" onClick={handleIncrement}>+</button>
                                    <input className="input-cart" type="text" value={count} disabled />
                                    <button className="button-cart minus" type="button" onClick={handleDecrement}>-</button>
                                </div> */}
                <AddToCartButton />
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DollProduct;
