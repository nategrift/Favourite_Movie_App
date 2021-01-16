// Created By Nate Grift
// © 2021 Nate Grift

import React from 'react';

import classes from './Button.module.css';


function Button(props) {
    
    // Prop ~ Types - Description

    // disabled ~ Boolean - Text for banner
    // onClick ~ Function - Callback when button is clicked
    // classes ~ String - Additional Classes passed from parent seperated by spaces


    return (
      <button className={`${classes.Button} ${props.classes}`} onClick={props.click} disabled={props.disabled}>{props.children}</button>
    );
}

export default Button;
