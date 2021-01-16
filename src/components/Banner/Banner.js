// Created By Nate Grift
// © 2021 Nate Grift

import React from 'react';

import classes from './Banner.module.css';
import BellImage from '../../images/bell.svg';

import Button from '../Button/Button';

function Banner(props) {

    // Prop ~ Types - Description

    // text ~ String - Text for banner
    // click ~ Function - Callback when X button is clicked

    // OPTIONAL Props
    // show ~ Boolean - Toggles showing class

  
    return (
      <div className={`${classes.Banner} ${props.show ? classes.show : ''}`}>
        <img src={BellImage} alt="Notification"></img>
        <p>{props.text}</p>
        <Button click={props.click}>X</Button>
      </div>
    );
}

export default Banner;
