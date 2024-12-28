import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
    const [dogImage, setDogImage] = useState('');
    const [dogBreed, setDogBreed] = useState('');
    const [favorites, setFavorites] = useState([]);

    const fetchRandomDog = async () => {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            setDogImage(data.message);

            const breed = data.message.split('/')[4];
            const normalizedBreed = breed.charAt(0).toUpperCase() + breed.slice(1).replace(/-/g, ' ');
            setDogBreed(normalizedBreed);
        } catch (error) {
            console.error('Error fetching random dog:', error);
        }
    };

    const addToFavorites = () => {
        if (dogImage && !favorites.some((dog) => dog.image === dogImage)) {
            setFavorites([...favorites, { image: dogImage, breed: dogBreed }]);
        }
    };

    useEffect(() => {
        fetchRandomDog();
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="container">
                            <h1>Dog Showcase</h1>
                            {dogImage ? (
                                <>
                                    <img src={dogImage} alt="Random Dog" className="dog-image" />
                                    <p><strong>Breed:</strong> {dogBreed}</p>
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                            <div>
                                <button onClick={fetchRandomDog}>Show Another Dog</button>
                                <button onClick={addToFavorites}>I Like This Dog!</button>
                            </div>
                            <div className="favorite-list">
                                <h2>My Favorite Dogs</h2>
                                {favorites.map((favDog, index) => (
                                    <Link to={`/details/${index}`} key={index} className="favorite-item">
                                        <img src={favDog.image} alt={`Favorite Dog ${index + 1}`} />
                                        <span>{favDog.breed}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    }
                />
                <Route path="/details/:id" element={<DogDetails favorites={favorites} />} />
            </Routes>
        </Router>
    );
}

function DogDetails({ favorites }) {
    const { id } = useParams();
    const dog = favorites[id];

    if (!dog) {
        return <h2>Dog not found</h2>;
    }

    return (
        <div className="container">
            <h1>Dog Details</h1>
            <img src={dog.image} alt={dog.breed} className="dog-image" />
            <p><strong>Breed:</strong> {dog.breed}</p>
            <Link to="/">
                <button>Back to Home</button>
            </Link>
        </div>
    );
}

export default App;
