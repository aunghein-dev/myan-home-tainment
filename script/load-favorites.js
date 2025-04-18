import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("movie-details");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const apiKey = "7118c5c252a5889d193fbee22d905462";
  const baseUrl = "https://api.themoviedb.org/3/movie";

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites">
        <h3>No favorite movies yet.</h3>
        <p>Browse and add movies to your favorites ❤️</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="movie-gallery"></div>
  `;
  const grid = container.querySelector(".movie-gallery");

  // Load each favorite movie by ID
  favorites.forEach(async (movie) => {
    
    try {
      const res = await fetch(`${baseUrl}/${movie.id}?api_key=${apiKey}`);
      const data = await res.json();

      const posterPath = data.poster_path;
      const imageUrl = posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : "https://placehold.co/300x450?text=No+Image&font=roboto";

      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-item");

      movieCard.innerHTML = `
        <a href="../detail/?id=${movie.id}" class="movie-link">
          <img class="movie-image" style="max-height:200px;" src="${imageUrl}" alt="${data.title}"
            onerror="this.onerror=null;this.src='https://placehold.co/300x450?text=No+Image&font=roboto';" />
            <div class="movie-info">
            <h4>
              <span class="movie-title-text">${movie.title}</span>
              <span class="span-info-year">(${dayjs(data.release_date).format("YYYY")})</span>
            </h4>
            </div>
          </div>
        </a>
      `;

      grid.appendChild(movieCard);
    } catch (error) {
      console.error(`Error fetching movie with ID ${movie.id}:`, error);
    }
  });
});
