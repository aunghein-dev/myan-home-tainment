import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

const apiKey = '7118c5c252a5889d193fbee22d905462';
const apiUrl = `https://api.themoviedb.org/3/movie/`;
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

function displayMovies(movies) {
  const gallery = document.getElementById('movie-gallery');
  gallery.innerHTML = '';

  movies.forEach(movie => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');

    movieItem.innerHTML = `
      <img class="movie-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.release_date}</p>
      </div>
    `;

    
    movieItem.onclick = () => {
      window.location.href = `/detail/?id=${movie.id}`;
    };

    gallery.appendChild(movieItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const categoryTitle = document.getElementById('category-title');
  if (category === 'popular') {
    categoryTitle.innerHTML = 'Popular Movies';
  } else if (category === 'top_rated') {
    categoryTitle.innerHTML = 'Top Rated Movies';
  } else if (category === 'upcoming') {
    categoryTitle.innerHTML = 'Upcoming Movies';
  }

  fetchMovies(category);
});

const loadingElement = document.getElementById('loading');

function showLoading() {
  loadingElement.style.display = 'flex';
}

function hideLoading() {
  loadingElement.style.display = 'none';
}

async function fetchMovies(category, totalPages = 3) {
  showLoading();
  try {
    let allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(`${apiUrl}${category}?api_key=${apiKey}&page=${page}`);
      const data = await response.json();
      allMovies = allMovies.concat(data.results);
    }

    displayMovies(allMovies);
  } catch (err) {
    console.error('Error fetching movies:', err);
  } finally {
    hideLoading();
  }
}
