document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const dashboardLink = document.getElementById("dashboardLink");
  const adminLink = document.getElementById("adminDashboardLink");
  const logoutBtn = document.getElementById("logout-btn");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");

  if (dashboardLink && logoutBtn && loginLink && registerLink) {
    if (token) {
      dashboardLink.style.display = "inline-block";
      logoutBtn.style.display = "inline-block";
      loginLink.style.display = "none";
      registerLink.style.display = "none";

      // Check for admin role
      try {
        const res = await fetch("/api/users/profile", { headers: { Authorization: "Bearer " + token } });
        if (res.ok) {
          const user = await res.json();
          if (adminLink) {
            adminLink.style.display = user.role === "admin" ? "inline-block" : "none";
          }
        }
      } catch {}
    } else {
      dashboardLink.style.display = "none";
      if (adminLink) adminLink.style.display = "none";
      logoutBtn.style.display = "none";
      loginLink.style.display = "inline-block";
      registerLink.style.display = "inline-block";
    }

    logoutBtn.onclick = function() {
      localStorage.removeItem("token");
      location.reload();
    };
  }
});
