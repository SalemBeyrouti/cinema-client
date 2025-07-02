function getQueryParam(key) {
  const query = window.location.search.substring(1);
  const params = query.split("&");
  for (let param of params) {
    const [k, value] = param.split("=");
    if (k === key) return value;
  }
  return null;
}

const movieId = getQueryParam("movie_id");

if (!movieId) {
  alert("No movie selected.");
  window.location.href = "homepage.html";
}

const seatGrid = document.querySelector(".seat-grid");
const totalValue = document.querySelector(".total-value");
const confirmButton = document.querySelector(".confirm-button");

const seatPrice = 10;
let selectedSeats = [];

axios.get(`../cinema-server/controllers/get_seats.php`)
  .then(res => {
    const seats = res.data.data.filter(seat => seat.movie_id == parseInt(movieId));
    if (!seats.length) {
      seatGrid.innerHTML = "<p>No seats available for this movie.</p>";
      return;
    }

    seatGrid.innerHTML = "";

    seats.forEach(seat => {
      const btn = document.createElement("button");
      btn.classList.add("seat");
      btn.textContent = `${seat.row}${seat.number}`;
      btn.disabled = seat.is_booked;
      btn.addEventListener("click", () => {
        if (selectedSeats.includes(seat.id)) {
          selectedSeats = selectedSeats.filter(id => id !== seat.id);
          btn.classList.remove("selected");
        } else {
          selectedSeats.push(seat.id);
          btn.classList.add("selected");
        }
        totalValue.textContent = `$${selectedSeats.length * seatPrice}`;
      });
      seatGrid.appendChild(btn);
    });
  })
  .catch(() => {
    seatGrid.innerHTML = "<p>Failed to load seats.</p>";
  });

confirmButton.addEventListener("click", () => {
  if (!selectedSeats.length) {
    alert("Please select at least one seat.");
    return;
  }

  console.log("Selected seat IDs:", selectedSeats);
  alert("Booking confirmed!");
});
