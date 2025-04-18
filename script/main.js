const apiKey = '7118c5c252a5889d193fbee22d905462';
const apiUrl = `https://api.themoviedb.org/3/movie/`;
const searchApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const heroUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const searchInput = document.getElementById("search-input");

let allMovies = []; // To store all the movies

// Fetch movies by category
async function fetchMovies(category, containerId) {
  try {
    const response = await fetch(`${apiUrl}${category}?api_key=${apiKey}`);
    const data = await response.json();
    allMovies.push(...data.results); // Store all movies
    displayMovies(data.results, containerId);
  } catch (err) {
    console.error('Error fetching movies:', err);
  }
}

// Fetch the hero banner
async function fetchHero() {
  try {
    const response = await fetch(heroUrl);
    const data = await response.json();
    const movie = data.results[0];
    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
    hero.innerHTML = `
      <div>
        <h2>${movie.title}</h2>
        <p>${movie.overview.substring(0, 150)}...</p>
        <button onclick="location.href='./detail/?id=${movie.id}'">Watch Now</button>
      </div>
    `;
  } catch (err) {
    console.error('Error fetching hero:', err);
  }
}

// Display movie cards
function displayMovies(movies, containerId) {
  const gallery = document.getElementById(containerId);
  gallery.innerHTML = '';

  movies.forEach(movie => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.innerHTML = `
      <img class="movie-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${new Date(movie.release_date).getFullYear()}</p>
      </div>
    `;
    movieItem.onclick = () => {
      window.location.href = `./detail/?id=${movie.id}`;
      searchInput.value = "";
      //searchInput.focus();
    };
    gallery.appendChild(movieItem);
  });
}

// Search movies on input
export function searchMovies() {
  const searchTerm = document.getElementById('search-input').value;
  if (searchTerm.length > 0) {
    filterMovies(searchTerm);
    fetchSuggestions(searchTerm);
  } else {
    displayMovies(allMovies, 'popular-movies');
    displayMovies(allMovies, 'top-rated-movies');
    displayMovies(allMovies, 'upcoming-movies');
    document.getElementById('search-suggestions').classList.remove('active');
  }
}

// Filter already-fetched movies
function filterMovies(searchTerm) {
  const filteredMovies = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayMovies(filteredMovies, 'popular-movies');
  displayMovies(filteredMovies, 'top-rated-movies');
  displayMovies(filteredMovies, 'upcoming-movies');
}

// Fetch search suggestions from TMDB
async function fetchSuggestions(query) {
  try {
    const response = await fetch(`${searchApiUrl}${query}`);
    const data = await response.json();
    displaySuggestions(data.results);
  } catch (err) {
    console.error('Error fetching search suggestions:', err);
  }
}

// Display suggestions below search bar
function displaySuggestions(suggestions) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  suggestionsContainer.innerHTML = '';

  if (suggestions.length > 0) {
    suggestionsContainer.classList.add('active');

    suggestions.forEach(movie => {
      const year = movie.release_date ? ` (${new Date(movie.release_date).getFullYear()})` : '';
      const suggestionItem = document.createElement('div');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.innerText = `${movie.title}${year}`;

      suggestionItem.onclick = () => {
        window.location.href = `./detail/?id=${movie.id}`;
        searchInput.value = "";
        //searchInput.focus();
      };

      suggestionsContainer.appendChild(suggestionItem);
    });
  } else {
    suggestionsContainer.classList.remove('active');
  }
}


// Navigate to all-movies page
export function viewAllMovies(category) {
  window.location.href = `./all/?category=${category}`;
  searchInput.value = "";
  //searchInput.focus();
}

// DOM Events
document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');

  searchInput.addEventListener('input', searchMovies);

  // Hide suggestions after blur (with delay)
  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      suggestionsContainer.classList.remove('active');
    }, 200);
  });

  // "View all" buttons
  document.getElementById('view-popular')?.addEventListener('click', () => viewAllMovies('popular'));
  document.getElementById('view-top-rated')?.addEventListener('click', () => viewAllMovies('top_rated'));
  document.getElementById('view-upcoming')?.addEventListener('click', () => viewAllMovies('upcoming'));
  
  document.getElementById('nav-popular')?.addEventListener('click', (e) => {
    e.preventDefault();
    viewAllMovies('popular');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // optional: scroll to top
  });
  
  document.getElementById('nav-top-rated')?.addEventListener('click', (e) => {
    e.preventDefault();
    viewAllMovies('top_rated');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  document.getElementById('nav-upcoming')?.addEventListener('click', (e) => {
    e.preventDefault();
    viewAllMovies('upcoming');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  showLoading();
  try {
    await fetchHero();
    await fetchMovies('popular', 'popular-movies');
    await fetchMovies('top_rated', 'top-rated-movies');
    await fetchMovies('upcoming', 'upcoming-movies');
  } catch (err) {
    console.error("Error during initial fetch:", err);
  } finally {
    hideLoading();
  }
});

// Loading spinner
const loadingElement = document.getElementById('loading');

function showLoading() {
  loadingElement.style.display = 'flex';
}

function hideLoading() {
  loadingElement.style.display = 'none';
}
