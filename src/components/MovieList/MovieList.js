// Created By Nate Grift
// © 2021 Nate Grift

import React from 'react';

import classes from './MovieList.module.css';
import Button from '../Button/Button';

import ImageMissing from '../../images/image-missing.svg';

function MovieList(props) {
    // Prop ~ Types - Description

    // movies ~ Array - List of movies retreived from database
    // title ~ String - Title for element
    // buttonText ~ String - Button Text
    // buttonClick ~ Function - What happens when button is clicked

    // OPTIONAL PROPS
    // totalResults ~ Number - List of total number of results
    // totalDisplayed ~ Number - List of how many items in list
    // classes ~ String - Additional Classes passed from parent seperated by spaces

    // Show movies if visable

    const movieElements = props.movies.map((movie) => (
        <li key={movie.imdbID}>
            <div className={classes.imgContainer}>
                {movie.Poster !== 'N/A' ? (
                    <img src={movie.Poster} alt={`${movie.Title}`}></img>
                ) : (
                    <img
                        src={ImageMissing}
                        className={classes.missingImage}
                        alt="null"
                    ></img>
                )}
            </div>
            <p>{`${movie.Title} (${movie.Year})`}</p>
            <Button
                disabled={
                    props.excludeList
                        ? props.excludeList.includes(movie.imdbID)
                        : false
                }
                click={(e) => props.buttonClick(e.target, movie)}
            >
                {props.buttonText}
            </Button>
        </li>
    ));

    return (
        <div className={`${classes.MovieList} ${props.classes}`}>
            <h2>{`${props.title} ${
                props.totalDisplayed ? `(${props.totalDisplayed})` : ''
            }`}</h2>
            {props.totalResults ? (
                <p
                    className={classes.smallText}
                >{`${props.totalResults} results found`}</p>
            ) : null}
            <ul>{movieElements}</ul>
        </div>
    );
}

export default MovieList;
