import React from 'react';
import Card from '../Card/Card';
import './Table.css';

function Table() {
    return (
      <div className="table">
        <div className="playarea">
            <Card number={7} flower="diams"/>
            <Card number={7} flower="spades"/>
            <Card number={10} flower="hearts"/>
            <Card number={7} flower="diams"/>
            <Card number={7} flower="spades"/>
            <Card number={10} flower="hearts"/>
            <Card number={7} flower="diams"/>
            <Card number={7} flower="spades"/>
            <Card number={10} flower="hearts"/>
            <Card number={7} flower="diams"/>
            <Card number={7} flower="spades"/>
            <Card number={10} flower="hearts"/>
            <Card number="back" flower="clubs"/>
        </div>
      </div>
    );
}

export default Table;