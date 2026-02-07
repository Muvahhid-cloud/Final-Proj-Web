async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Login failed");

  localStorage.setItem("token", data.token);
  location.href = "/pages/Menu.html";
}

async function register() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Register failed");

  localStorage.setItem("token", data.token);
  location.href = "/pages/Menu.html";
}

const token = localStorage.getItem("token");

if (token) {
  fetch("/api/auth/me", {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(user => {
      document.getElementById("dashboardLink").style.display = "block";
      document.getElementById("userName").style.display = "block";
      document.getElementById("userName").innerText = user.username;
    });
}