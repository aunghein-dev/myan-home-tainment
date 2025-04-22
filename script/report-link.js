const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// 🌟 Auto fetch movie title if ID is found
if (movieId) {
  const apiKey = "7118c5c252a5889d193fbee22d905462";

  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`)
    .then(res => res.json())
    .then(data => {
      if (data.title) {
        document.getElementById("movieTitle").value = data.title;
      }
    })
    .catch((error) => console.error("Error fetching movie:", error));
}

async function getIpAndCountry() {
  const API_TOKEN = '89a5d150f54c09';
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${API_TOKEN}`);
    const data = await response.json();
    return {
      ip: data.ip || "unknown",
      location: data.country || "unknown"
    };
  } catch (error) {
    console.error('Error fetching IP and country:', error);
    return {
      ip: "unknown",
      location: "unknown"
    };
  }
}

document.querySelector('.submit-button').addEventListener('click', async (event) => {
  event.preventDefault();

  const movieTitleInput = document.getElementById('movieTitle');
  const brokenLinkInput = document.getElementById('brokenLink');
  const descriptionInput = document.getElementById('description');

  const movieTitle = movieTitleInput.value.trim();
  const brokenLink = brokenLinkInput.value.trim();
  const description = descriptionInput.value.trim();

  let isValid = true;

  [movieTitleInput, brokenLinkInput, descriptionInput].forEach(input => {
    input.classList.remove('input-error');
    const error = input.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
      error.style.display = 'none';
    }
  });

  if (!movieTitle) {
    showError(movieTitleInput, "Movie title is required");
    isValid = false;
  }

  if (!brokenLink) {
    showError(brokenLinkInput, "Broken link is required");
    isValid = false;
  }

  if (!description) {
    showError(descriptionInput, "Description is required");
    isValid = false;
  }

  if (!isValid) return;

  // 🌍 Get IP and Country before sending
  const { ip, location } = await getIpAndCountry();

  const savedJson = {
    tmdbId: movieId,
    movieName: movieTitle,
    brokenLink: brokenLink,
    description: description,
    location: location,
    ip: ip
  };

  try {
    const response = await fetch('https://urgent-stacy-aunghein-dev-843d652b.koyeb.app/linkbroken/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(savedJson)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Success:', data);
  } catch (error) {
    console.error('❌ Failed to report broken link:', error.message);
  }

  // Clear the form
  brokenLinkInput.value = '';
  descriptionInput.value = '';
  movieTitleInput.value = '';

  // Show notification
  const notification = document.getElementById('notification');
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
    window.location.href = window.location.origin + "/";
  }, 2200);
});

function showError(input, message) {
  input.classList.add('input-error');
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains('error-message')) {
    error = document.createElement('div');
    error.className = 'error-message';
    input.parentNode.insertBefore(error, input.nextSibling);
  }
  error.textContent = message;
  error.style.display = 'block';
}