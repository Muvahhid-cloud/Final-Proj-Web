const token = localStorage.getItem("token");
if (!token) location.href = "/pages/Login.html";

async function loadProfile() {
  const res = await fetch("/api/users/profile", { headers: { Authorization: "Bearer " + token } });
  if (!res.ok) return location.href = "/pages/Login.html";
  const u = await res.json();
  document.getElementById("username").value = u.username || "";
  document.getElementById("email").value = u.email || "";
}

async function updateProfile() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;

  const res = await fetch("/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ username, email })
  });

  if (res.ok) {
    alert("Profile updated");
  } else {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Update failed");
  }
}

async function updatePassword() {
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  const res = await fetch("/api/users/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ oldPassword, newPassword })
  });

  if (res.ok) {
    alert("Password updated");
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword").value = "";
  } else {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Password update failed");
  }
}

loadProfile();