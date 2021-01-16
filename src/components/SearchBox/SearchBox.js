// Created By Nate Grift
// © 2021 Nate Grift

import React from 'react';

import classes from './SearchBox.module.css';

import searchImage from '../../images/search.svg'

function SearchBox(props) {

    // Prop ~ Types - Description

    // title ~ String - Title for Search Box
    // inputText ~ String - Value of input
    // setInputText ~ Function - Funciton to be called when input changes

    return (
        <div className={classes.SearchBox}>
            <h2>{props.title}</h2>
            <div>
                <img src={searchImage} alt="Search"></img>
                <input value={props.inputText} onChange={props.setInputText}></input>
            </div>
        </div>
    );
}

export default SearchBox;
