import React, { useState } from 'react'

function ProductCounter({ count, onCountChange }) {
    const [productCounter, setProductCounter] = useState(count);

    const handleIncrement = () => {
        const updatedCount = productCounter + 1;
        onCountChange(updatedCount);
        setProductCounter(updatedCount)
    };

    const handleDecrement = () => {
        if (productCounter > 1) {
            const updatedCount = productCounter - 1;
            onCountChange(updatedCount);
            setProductCounter(updatedCount)
        }
    };

    return (
        <div className='counter-cart-div'>
            <button className="button-cart plus" type="button" onClick={handleIncrement}>+</button>
            <input className="input-cart" style={{  flex: '1', minWidth: '25px' }} type="text" value={productCounter} disabled />
            <button className="button-cart minus" type="button" onClick={handleDecrement}>-</button>
        </div>
    )
}

export default ProductCounter