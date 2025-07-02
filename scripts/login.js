document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");

  if (!form) {
    console.error("Form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = form.querySelector(".input-email-phone").value.trim();
    const password = form.querySelector(".input-password").value.trim();

    const payload = {
      email: identifier,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost/cinema-server/controllers/login.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json", // ✅ MAKE SURE THIS LINE EXISTS
          },
        }
      );

      const result = response.data;
      console.log("Response received:", result);

      if (result.status === 200 || result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.data));
        window.location.href = "homepage.html";
      } else {
        alert("Login failed: " + (result.message ?? "Unknown error"));
      }

    } catch (error) {
      console.error("Axios error:", error);

      if (error.response) {
        console.log("Server responded:", error.response.data);
        alert("Server error: " + (error.response.data?.message ?? "Unknown"));
      } else if (error.request) {
        alert("No response received from server.");
      } else {
        alert("JS Error: " + error.message);
      }
    }
  });
});
