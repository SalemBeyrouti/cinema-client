const movieId = new URLSearchParams(window.location.search).get('movie_id');
if (!movieId) {
  alert('No movie selected.');
  window.location.href = 'homepage.html';
}

const movieInfoContainer = document.querySelector('.movie-info');
const showtimesContainer = document.querySelector('.showtime-buttons');
const bookNowBtn = document.getElementById('book-now');
let selectedShowtimeId = null;

axios.get(`../cinema-server/controllers/get_movies.php?id=${movieId}`)
  .then(res => {
    const movie = res.data.data;
    console.log("Movie:", movie);
    movieInfoContainer.innerHTML = `
      <img src="${movie.poster_url}" alt="${movie.title} Poster" />
      <div class="details">
        <h1>${movie.title}</h1>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p><strong>Duration:</strong> ${movie.duration}</p>
        <p><strong>Description:</strong> ${movie.description}</p>
      </div>
    `;
  })
  .catch(() => {
    alert('Failed to load movie details.');
  });

axios.get('../cinema-server/controllers/get_showtimes.php')
  .then(res => {
    const showtimes = res.data.data.filter(st => st.movie_id == parseInt(movieId));
    if (!showtimes.length) {
      showtimesContainer.innerHTML = '<p>No showtimes available.</p>';
      return;
    }

    showtimesContainer.innerHTML = '';

    showtimes.forEach(st => {
      const btn = document.createElement('button');
      const time = new Date(st.start_time);
      const formatted = `${time.toDateString()} - ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      btn.textContent = formatted;
      btn.dataset.showtimeId = st.id;
      btn.classList.add("showtime-button");

      btn.addEventListener('click', () => {
        selectedShowtimeId = st.id;
        bookNowBtn.href = `booking.html?movie_id=${movieId}&showtime_id=${selectedShowtimeId}`;
        [...showtimesContainer.children].forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });

      showtimesContainer.appendChild(btn);
    });
  })
  .catch(() => {
    alert('Failed to load showtimes.');
  });
