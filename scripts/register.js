document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (!form) {
    console.error("Register form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector(".input-fullname").value.trim();
    const identifier = form.querySelector(".input-email-phone").value.trim();
    const password = form.querySelector(".input-password").value.trim();
    const confirmPassword = form.querySelector(".input-confirm-password").value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const isEmail = identifier.includes("@");
    const email = isEmail ? identifier : "";
    const phone = isEmail ? "" : identifier;

    try {
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);

      const response = await axios.post(
         "http://localhost/cinema-server/controllers/register.php",
         formData
         );

      const result = response.data;
      console.log("Register response:", result);

      if (result.status === "success") {
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert("Error: " + result.data);
      }

    } catch (err) {
      console.error("Registration error:", err.response ? err.response.data : err);
      alert("Something went wrong.");
    }
  });
});