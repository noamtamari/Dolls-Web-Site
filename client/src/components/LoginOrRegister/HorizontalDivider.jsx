import React from 'react'
import '../../Components.css';

function HorizontalDivider({text}) {
  return (
    <div className="horizontal-divider">
    <div className="divider-line"></div>
    <div className="divider-text">{text}</div>
    <div className="divider-line"></div>
  </div>  )
}

export default HorizontalDivider