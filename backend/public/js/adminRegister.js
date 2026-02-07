async function registerAdmin() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value.trim();

  if (!/^\+7\d{10}$/.test(phone)) {
    alert("Phone number must start with +7 and be 12 digits total.");
    return;
  }

  const res = await fetch("/api/auth/register-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, phone })
  });

  if (res.ok) {
    alert("Admin registered! Please log in.");
    window.location.href = "/pages/Login.html";
  } else {
    const err = await res.json().catch(() => ({}));
    alert(err.message || "Registration failed");
  }
}
