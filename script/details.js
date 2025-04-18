

const apiKey = '7118c5c252a5889d193fbee22d905462';
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const secretKey = 'p4E!x9z@1Lk#Vm$2RfT8GwQe^YhUjIoP';

async function fetchMovieDetails(id) {
  const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`;
  const downloadApiUrl = `https://mvlink-backend-webservice.onrender.com/mapi/secure-movie/${id};`;

  try {
    const res = await fetch(movieUrl);
    const movie = await res.json();
    let encryptedLink = '';
    try {

      const backendRes = await fetch(downloadApiUrl);
    
      if (backendRes.ok) {
        const backendData = await backendRes.json();
        encryptedLink = backendData.safeLink || ''; // ✅ Use the encrypted link as-is
      } else {
        console.warn(`No backend data found for movie ${id} (Status: ${backendRes.status})`);
      }
    } catch (backendErr) {
      console.error('Error fetching backend movie link:', backendErr);
    }
    

    displayMovieDetails(movie, encryptedLink);
    return movie;
  } catch (error) {
    console.error('Error loading movie details:', error);
    document.getElementById('movie-details').innerHTML = `
      <div class="error-message">
        <h3>Unable to load movie data.</h3>
        <p>Try again later or check another title.</p>
      </div>
    `;
  }
}

function displayMovieDetails(movie, encryptedLink) {
  const container = document.getElementById('movie-details');
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'; // Ensure there's a fallback
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'; // Fallback if poster is missing
  const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'https://via.placeholder.com/1920x800?text=No+Image'; // Fallback if backdrop is missing

  // Get top 5 cast, ensuring there's a fallback if the cast list is empty
  const topCast = movie.credits?.cast?.slice(0, 5) || [];
  const downloadButton = encryptedLink!== ""
    ? ` <a href="../download-movie/?id=${movie.id}&key=${encodeURIComponent(encryptedLink)}" target="_blank" class="download-button">
        <i class="fa fa-download"></i> Download
        </a>`
    : `<a href="/report-link/?id=${movie.id}"  class="download-button">
        <i class="fa fa-download"></i> Request Movie
        </a>`;

    const isFavorite = checkFavorite(movie.id); // Check if this movie is already a favorite

    const favoritesButton = `
      <button class="favorites-button ${isFavorite ? 'starred' : ''}" onclick="toggleFavorite(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.poster_path}')">
        <i class="fas fa-star"></i> ${isFavorite ? 'Favorited' : 'Add to Favorites'}
      </button>`

  
  container.innerHTML = `
    <div class="movie-content">
      <img src="${poster}" alt="${movie.title}" class="movie-poster" />
      <div class="movie-text">
        <h2>${movie.title}</h2>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>IMDb Rating:</strong> ⭐ ${rating}</p>
        <p><strong>Genres:</strong> ${movie.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
        <p><strong>Overview:</strong> ${movie.overview || 'No overview available'}</p>
        <p><strong>IMDb:</strong> <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="imdb-link">View on IMDb</a></p>
        <p>
        ${downloadButton}
        ${favoritesButton}
        </p>
      </div>
    </div>

    <div class="cast-section">
      <h3>Top Cast</h3>
      <div class="cast-list">
        ${topCast.map(actor => {
            const profileImg = actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : 'https://via.placeholder.com/185x278?text=No+Image'; // Handle missing profile image
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(actor.name)}`; // Redirect to Google search
            return `
              <div class="cast-item" onclick="window.open('${googleSearchUrl}', '_blank')">
                <img style="margin-bottom:-6px;" src="${profileImg}" alt="${actor.name}" />
                <p style="margin:0; margin-bottom:-20px;">${actor.name}</p>
                <small style="margin:0; margin-top:-48px; margin-bottom:8px;">as ${actor.character}</small>
              </div>
            `;
          }).join('')}
      </div>
    </div>
  `;
}


async function fetchSimilarMovies(id) {
  const similarUrl = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`;

  try {
    const res = await fetch(similarUrl);
    const data = await res.json();
    displaySimilarMovies(data.results);
  } catch (err) {
    console.error('Error fetching similar movies:', err);
  }
}


function displaySimilarMovies(movies) {
  const container = document.getElementById('movie-details');
  const similarSection = document.createElement('div');
  similarSection.classList.add('similar-section');

  if (movies.length === 0) {
    similarSection.innerHTML = `
      <h3 class="section-title">More Like This</h3>
      <p>No similar movies found.</p>
    `;
  } else {
    similarSection.innerHTML = `
      <h3 class="section-title">More Like This</h3>
      <div class="slider-container">
        <button class="slider-btn left" onclick="scrollSlider('left')">&#10094;</button>
        <div class="similar-slider">
          ${movies.filter(movie => movie.poster_path)
            .slice(0, 30)
            .map(movie => {
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image';  // Fallback image

              return `
                <div class="similar-movie-item" onclick="location.href='./?id=${movie.id}'">
                  <img src="${posterUrl}" alt="${movie.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x450?text=No+Image';">
                  <div class="similar-movie-info">
                    <h4>
                      <span class="movie-title-text">${movie.title}</span>
                      <span class="span-info-year">(${new Date(movie.release_date).getFullYear()})</span>
                    </h4>
                    <p class="similar-movie-info-star">⭐ ${movie.vote_average.toFixed(1)}</p>
                  </div>
                </div>
              `;
            }).join('')}
        </div>
        <button class="slider-btn right" onclick="scrollSlider('right')">&#10095;</button>
      </div>
    `;
  }

  container.appendChild(similarSection);
}



function scrollSlider(direction) {
  const slider = document.querySelector('.similar-slider');
  const scrollAmount = 300;
  slider.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
}



const loadingElement = document.getElementById('loading');
const movieDetailsContainer = document.getElementById('movie-details');

function showLoading() {
  loadingElement.style.display = 'flex';
  movieDetailsContainer.style.display = 'none';
}

function hideLoading() {
  loadingElement.style.display = 'none';
  movieDetailsContainer.style.display = 'block';
}

if (movieId) {
  showLoading();
  fetchMovieDetails(movieId).then(() => {
    fetchSimilarMovies(movieId);
    hideLoading();
  });
}


