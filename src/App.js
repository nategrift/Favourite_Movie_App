// Created By Nate Grift
// © 2021 Nate Grift


import React, { useEffect, useState } from 'react';

import './App.css';
import MovieList from './components/MovieList/MovieList';
import SearchBox from './components/SearchBox/SearchBox';
import Loading from './components/Loading/Loading';
import Banner from './components/Banner/Banner';


// In a production enviroment, I would like to censor this value
const API_KEY = 'cae18993';

const MAX_NOMINATED = 5;

function App() {
    // Search text state - updates every keystroke
    const [searchText, setSearchText] = useState('');

    // Movies and Nominated Movies
    const [movies, setMovies] = useState(null);
    const [nominated, setNominated] = useState([]);

    // Errors and Banner
    const [error, setError] = useState(null);
    const [banner, setBanner] = useState(null);
    const [showBanner, setShowBanner] = useState(false);

    // Two way binding handler for the search box text
    function searchTextHandler(event) {
        // Set default Values
        setSearchText(event.target.value);
        setMovies(null);
        setError(null);

        // Search API
        if (event.target.value.length > 2) {
            fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&s=${event.target.value}&type=movie`
            )
                .then((res) => res.json())
                .then(
                    (result) => {
                        // if fetch request yeilds results, add to movies to display
                        if (result.Response ===  'True') {
                            setMovies(result);
                        } else {
                            setError(result.Error);
                        }
                    },
                    (err) => {
                        setError(err);
                    }
                );
        } else {
            setError('Minimum 3 characters to Search');
        }
    }

    // Add Movie Nomination
    function nominateAddHandler(elem, movie) {
        // Set Banner for Max amount of nominated
        if (nominated.length >= MAX_NOMINATED-1) {
            setBanner(
                `${nominated.length + 1} Nominations Selected!  You have reached the max nominations allowed.`
            );
            setTimeout(() => {
                setShowBanner(true);
            }, 30);
        }

        // Set nominated if below max number already exists
        if (nominated.length < MAX_NOMINATED) {
            elem.disabled = true;
            const newNominated = [...nominated, movie];
            const nominatedIdList = newNominated.map(
                (nominated) => nominated.imdbID
            );
            localStorage.setItem('nominated', JSON.stringify(nominatedIdList));
            setNominated(newNominated);
        }
    }

    // Remove Movie Nomination
    function nominateRemoveHandler(_, movie) {
        const newNominated = nominated.filter(
            (nominated) => nominated.imdbID !== movie.imdbID
        );
        const nominatedIdList = newNominated.map(
            (nominated) => nominated.imdbID
        );
        // Store to local storage unless nominated list is empty
        if (nominatedIdList.length > 0) {
            localStorage.setItem('nominated', JSON.stringify(nominatedIdList)); 
        } else {
            localStorage.removeItem('nominated')
        }
        setNominated(newNominated);
    }

    // Removes banner with animation
    function removeBanner() {
        setShowBanner(false);
        setTimeout(() => {
            setBanner(null);
        }, 200);
    }

    // Display Search results or loading screen
    let searchResults;

    // If movies exists
    if (movies && searchText) {
        searchResults = (
            <MovieList
                movies={movies.Search}
                totalResults={movies.totalResults}
                title={`Results for "${searchText}"`}
                classes="card"
                buttonText="Nominate"
                buttonClick={nominateAddHandler}
                excludeList={nominated.map((movie) => movie.imdbID)}
            />
        );

    // If error
    } else if (!movies && searchText && error) {
        searchResults = (
            <div className="card">
                <p className="error">{error}</p>
                <p className="errorSmall">Type in the search box to retry</p>
            </div>
        );

    // If content loading
    } else if (!movies && searchText) {
        searchResults = (
            <div className="card">
                <Loading />
            </div>
        );

    // Default information
    } else {
        searchResults = (
            <div className="card">
                <p className="error">Minimum 3 characters to Search</p>
                <p className="errorSmall">Type movie titles in search box</p>
            </div>
        );
    }

    // Nominated list 
    let nominatedList;

    // If nominated has movies
    if (nominated && nominated.length > 0) {
        nominatedList = (
            <MovieList
                movies={nominated}
                title="Nominated Movies"
                classes="card"
                buttonText="Remove"
                buttonClick={nominateRemoveHandler}
                totalDisplayed={nominated.length}
            />
        );
    // If nominated list is loading
    } else if (localStorage.getItem('nominated') !== null && nominated.length <= 0) {
            nominatedList =  <div className="card">
                <Loading />
            </div>
    }
    
    // Loading previously stored nominated movies
    useEffect(() => {
        const nominatedStored = localStorage.getItem('nominated');

        // if no list, exit
        if (!nominatedStored) {
            return;
        }

        // Retreive list of previously stored nominations
        const nominatedStoredIdList = JSON.parse(nominatedStored);

        // Movies to be added to nomination list
        let nominatedMovies = [];

        // List of Promises that need to be fufilled 
        let nominatedPromises = [];
        nominatedStoredIdList.forEach((movieId) => {
            nominatedPromises.push(
                fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`)
                    .then((res) => res.json())
                    .then(
                        (result) => {
                            if (result.Response === 'True') {
                                nominatedMovies.push(result);
                            } else {
                                setError(result.Error);
                            }
                        },
                        (err) => {
                            setError(err);
                        }
                    )
            );
        });

        // Wait for all nominated movies to be fetchd then display them
        Promise.all(nominatedPromises).then(() => {
            setNominated(nominatedMovies);
        });
    }, []);

    // Return app display
    return (
        <div className="App">
            <header>
                <h1>The Shoppies</h1>
            </header>
            <section className="full-width card">
                <SearchBox
                    inputText={searchText}
                    setInputText={searchTextHandler}
                    title="Movie title"
                />
            </section>
            <section className="columns-two">
                {/*Search Results*/}
                {searchResults}
                {/*Nominated List Results*/}
                {nominatedList}
            </section>
            {banner ? (
                <Banner text={banner} show={showBanner} click={removeBanner}/>
            ) : null}
        </div>
    );
}

export default App;
