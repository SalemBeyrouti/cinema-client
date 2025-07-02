document.querySelector(".fa-house").addEventListener("click", () => {
  window.location.href = "homepage.html";
});

const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".container, .movie-list-title, .navbar-container, .sidebar, .left-menu-icon, .toggle"
);

ball.addEventListener("click", () => {
  items.forEach((item) => item.classList.toggle("active"));
  ball.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
  const greetingDiv = document.querySelector(".greeting");
  const userJson = localStorage.getItem("user");

  if (greetingDiv && userJson) {
    const user = JSON.parse(userJson);
    greetingDiv.textContent = `Welcome, ${user.name}!`;
  } else if (greetingDiv) {
    greetingDiv.textContent = "You're not logged in.";
  }

  axios.get("http://localhost/cinema-project/cinema-server/controllers/get_movies.php")
    .then((res) => {
      const movies = res.data.data;

      if (!Array.isArray(movies)) {
        document.querySelectorAll(".movie-list").forEach(container => {
          container.innerHTML = "<p>No movies found.</p>";
        });
        return;
      }

      document.querySelectorAll(".movie-list").forEach(container => {
        container.innerHTML = "";
      });

      movies.forEach((movie) => {
        const container = document.querySelector(`.movie-list[data-category="${movie.category}"]`);
        if (!container) return;

        const card = document.createElement("div");
        card.classList.add("movie-list-item");
        card.innerHTML = `
          <img class="movie-list-item-img" src="${movie.poster_url}" alt="${movie.title}">
          <div class="movie-list-item-info">
            <span class="movie-list-item-title">${movie.title}</span>
            <span class="movie-genre">Genre: ${movie.genre}</span>
            <p class="movie-list-item-desc">${movie.description}</p>
            <button class="movie-list-item-button" data-id="${movie.id}">Watch</button>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error fetching movies:", err);
      document.querySelectorAll(".movie-list").forEach(container => {
        container.innerHTML = "<p>Failed to load movies.</p>";
      });
    });
});

document.addEventListener("click", (e) => {
  const btn = e.target;
  if (btn.classList.contains("movie-list-item-button")) {
    const movieId = btn.dataset.id;
    if (movieId) {
      window.location.href = `movie.html?movie_id=${movieId}`;
    } else {
      alert("This movie is statically listed. Link to booking coming soon!");
    }
  }
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    alert(`This link (${link.textContent}) is not yet active.`);
  });
});

const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow, i) => {
  let clickCounter = 0;

  arrow.addEventListener("click", () => {
    const movieItems = movieLists[i].querySelectorAll(".movie-list-item");
    const itemNumber = movieItems.length;
    const ratio = Math.floor(window.innerWidth / 270);
    clickCounter++;

    const currentTransform = movieLists[i].computedStyleMap().get("transform");
    const currentX = currentTransform && currentTransform[0]?.x?.value || 0;

    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      movieLists[i].style.transform = `translateX(${currentX - 300}px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const movieLists = document.querySelectorAll(".movie-list");

  axios
    .get("../cinema-server/controllers/get_movies.php")
    .then((response) => {
      const movies = response.data.data;

      movieLists.forEach((container) => {
        const category = container.dataset.category;

        const filtered = movies.filter((movie) => {
          return movie.category === category && movie.is_active === 1;
        });

        filtered.forEach((movie) => {
          const card = document.createElement("div");
          card.classList.add("movie-card");

          card.innerHTML = `
            <a href="./movie.html?movie_id=${movie.id}">
              <img src="${movie.poster_url}" alt="${movie.title}" />
              <h3>${movie.title}</h3>
            </a>
          `;

          container.appendChild(card);
        });
      });
    })
    .catch((error) => {
      console.error("Failed to fetch movies:", error);
    });
});

