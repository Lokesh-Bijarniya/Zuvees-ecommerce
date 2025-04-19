import React from 'react';
import './SimpleCard.css';

const SimpleCard = ({ children, style, header }) => (
  <div className="simple-card" style={style}>
    {header && <div className="simple-card-header">{header}</div>}
    <div className="simple-card-content">{children}</div>
  </div>
);

export default SimpleCard;
