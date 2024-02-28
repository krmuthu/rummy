import React from 'react';
import './Card.css';

function Card({number,flower}) {
  const className = (number === 'back') ? `card back` : `card rank-${number} ${flower}`;
    return (
        <a className={ className } href="#">
          <span class="rank">{number}</span>
          <span class="suit"></span>
          </a>
    );
}


export default Card;