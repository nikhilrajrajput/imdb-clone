let currentMovieStack = [];

const homeButton = document.querySelector("#home-button");
const searchBox = document.querySelector("#search-box");
const goToFavouritesButton = document.querySelector("#goto-favourites-button");
const movieCardContainer = document.querySelector("#movie-card-container");

function showAlert(message) {
    alert(message);
}

function renderList(actionForButton) {
    movieCardContainer.innerHTML = '';

    for (let i = 0; i < currentMovieStack.length; i++) {
        let movieCard = document.createElement('div');
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
      <img src="${'https://image.tmdb.org/t/p/w500' + currentMovieStack[i].poster_path}" alt="${currentMovieStack[i].title}" class="movie-poster">
      <div class="movie-title-container">
        <span>${currentMovieStack[i].title}</span>
        <div class="rating-container">
          <i class="fa-solid fa-star"></i>
          <span>${currentMovieStack[i].vote_average}</span>
        </div>
      </div>

      <button onclick="getMovieInDetail(${currentMovieStack[i].id})" class="movie-details-button">Movie Details</button>

      <button onclick="${actionForButton}(this)" class="add-to-favourite-button text-icon-button" data-id="${currentMovieStack[i].id}">
        <i class="fa-regular fa-heart"></i>
        <span>${actionForButton}</span>
      </button>
    `;

        movieCardContainer.append(movieCard);
    }
}

function printError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = message;
    errorDiv.style.height = "100%";
    errorDiv.style.fontSize = "5rem";
    errorDiv.style.margin = "auto";
    movieCardContainer.innerHTML = "";
    movieCardContainer.append(errorDiv);
}

function getTrandingMovies() {
    fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=1ad5a505bd9eabbe2abd4c6b2d8d6372")
        .then((response) => response.json())
        .then((data) => {
            currentMovieStack = data.results;
            renderList("favourite");
        })
        .catch((err) => printError(err));
}

getTrandingMovies();

homeButton.addEventListener('click', getTrandingMovies);

searchBox.addEventListener('keyup', () => {
    let searchString = searchBox.value;

    if (searchString.length > 0) {
        let searchStringURI = encodeURI(searchString);
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=1ad5a505bd9eabbe2abd4c6b2d8d6372&language=en-US&page=1&include_adult=false&query=${searchStringURI}`)
            .then((response) => response.json())
            .then((data) => {
                currentMovieStack = data.results;
                renderList("favourite");
            })
            .catch((err) => printError(err));
    }
});


function favourite(element) {
    let id = element.dataset.id;
    let movie = currentMovieStack.find((movie) => movie.id == id);

    if (movie) {
        let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

        if (favouriteMovies == null) {
            favouriteMovies = [];
        }

        favouriteMovies.push(movie);
        localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovies));

        showAlert(movie.title + " added to favorites");
    }
}

function remove(element) {
    let id = element.dataset.id;
    let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

    if (favouriteMovies) {
        let newFavouriteMovies = favouriteMovies.filter((movie) => movie.id != id);
        localStorage.setItem("favouriteMovies", JSON.stringify(newFavouriteMovies));
        currentMovieStack = newFavouriteMovies;
        renderList("remove");
    }
}


function renderMovieInDetail(movie) {
    console.log(movie);
    movieCardContainer.innerHTML = '';

    let movieDetailCard = document.createElement('div');
    movieDetailCard.classList.add('detail-movie-card');

    movieDetailCard.innerHTML = `
    <img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster">
    <div class="detail-movie-title">
      <span>${movie.title}</span>
      <div class="detail-movie-rating">
        <i class="fa-solid fa-star"></i>
        <span>${movie.vote_average}</span>
      </div>
    </div>
    <div class="detail-movie-plot">
      <p>${movie.overview}</p>
      <p>Release date : ${movie.release_date}</p>
      <p>runtime : ${movie.runtime} minutes</p>
      <p>tagline : ${movie.tagline}</p>
    </div>
  `;

    movieCardContainer.append(movieDetailCard);
}

function getMovieInDetail(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1ad5a505bd9eabbe2abd4c6b2d8d6372&language=en-US`)
        .then((response) => response.json())
        .then((data) => renderMovieInDetail(data))
        .catch((err) => printError(err));
}

goToFavouritesButton.addEventListener('click', () => {
    let favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

    if (favouriteMovies == null || favouriteMovies.length < 1) {
        showAlert("You have not added any movie to favourites.");
        return;
    }

    currentMovieStack = favouriteMovies;
    renderList("remove");
});