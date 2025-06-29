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

    try {
      const response = await axios.post(
        "http://localhost/cinema-server/controllers/login.php",
        {
          email: identifier,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          transformRequest: [(data) => {
            const params = new URLSearchParams();
            for (let key in data) {
              params.append(key, data[key]);
            }
            return params.toString();
          }],
        }
      );

      const result = response.data;
      console.log("Response received:", result);

      if (result.status === "success") {
        alert("Login successful!");
      } else {
        alert("Error: " + result.data);
      }

    } catch (error) {
      console.error("Axios error:", error);
      alert("Something went wrong.");
    }
  });
});
