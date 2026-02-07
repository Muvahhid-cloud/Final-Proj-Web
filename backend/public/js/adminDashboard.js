console.log("[DEBUG] adminDashboard.js loaded at", new Date().toISOString());
const token = localStorage.getItem("token");
if (!token) location.href = "/pages/Login.html";

async function fetchUsers() {
  console.log("[DEBUG] fetchUsers - calling /api/users");
  const res = await fetch("/api/users", { headers: { Authorization: "Bearer " + token } });
  console.log("[DEBUG] fetchUsers - response status:", res.status);
  if (!res.ok) {
    const errText = await res.text();
    console.log("[DEBUG] fetchUsers - error:", errText);
    return [];
  }
  const data = await res.json();
  console.log("[DEBUG] fetchUsers - users data:", data);
  return data;
}

async function fetchOrders(userId) {
  console.log("[DEBUG] fetchOrders - calling /api/users/" + userId + "/orders");
  const res = await fetch(`/api/users/${userId}/orders`, { headers: { Authorization: "Bearer " + token } });
  console.log("[DEBUG] fetchOrders - response status:", res.status);
  if (!res.ok) {
    const errText = await res.text();
    console.log("[DEBUG] fetchOrders - error:", errText);
    return [];
  }
  const data = await res.json();
  console.log("[DEBUG] fetchOrders for " + userId + " - orders:", data);
  return data;
}

async function deleteUser(userId) {
  if (!confirm("Delete this user?")) return;
  const res = await fetch(`/api/users/${userId}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
  if (res.ok) {
    alert("User deleted");
    loadUsers();
  } else {
    alert("Delete failed");
  }
}

async function deleteOrder(orderId) {
  if (!confirm("Delete this order?")) return;
  const res = await fetch(`/api/orders/${orderId}/admin`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
  if (res.ok) {
    alert("Order deleted");
    loadUsers();
  } else {
    alert("Delete failed");
  }
}

async function loadUsers() {
  console.log("[DEBUG] loadUsers - starting");
  const users = await fetchUsers();
  console.log("[DEBUG] loadUsers - fetched users:", users);
  const tbody = document.getElementById("userTableBody");
  const noUsersMsg = document.getElementById("noUsersMsg");
  tbody.innerHTML = "";
  if (!users || users.length === 0) {
    console.log("[DEBUG] loadUsers - no users found, showing message");
    noUsersMsg.style.display = "block";
    noUsersMsg.textContent = "No users found. Register a user to see them here.";
    return;
  } else {
    noUsersMsg.style.display = "none";
  }
  console.log("[DEBUG] loadUsers - displaying", users.length, "users");
  let hasOrders = false;
  for (const user of users) {
    console.log("[DEBUG] loadUsers - processing user:", user.username);
    const orders = await fetchOrders(user._id);
    if (orders.length) hasOrders = true;
    const orderList = orders.length
      ? orders.map(o => `<li>Order #${o._id} ($${o.totalPrice}) <button class='admin-btn' onclick='deleteOrder(\"${o._id}\")'>Delete</button></li>`).join("")
      : '<li style="color:#bbb;">No orders</li>';
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.username || user.name || 'N/A'}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${orders.length}</td>
      <td><ul class='order-list'>${orderList}</ul></td>
      <td><button class='admin-btn' onclick='deleteUser(\"${user._id}\")'>Delete User</button></td>
    `;
    tbody.appendChild(tr);
  }
  console.log("[DEBUG] loadUsers - completed, hasOrders:", hasOrders);
  if (!hasOrders) {
    noUsersMsg.style.display = "block";
    noUsersMsg.textContent = "Users found but no orders yet.";
  } else {
    noUsersMsg.style.display = "none";
  }
}


async function fetchAnalytics() {
  // Revenue
  const resRevenue = await fetch("/api/analytics/revenue", { headers: { Authorization: "Bearer " + token } });
  if (resRevenue.ok) {
    const { totalRevenue, ordersCount } = await resRevenue.json();
    document.getElementById("totalRevenue").textContent = "$" + (totalRevenue || 0).toFixed(2);
    document.getElementById("ordersCount").textContent = ordersCount || 0;
  }
}

fetchAnalytics();
loadUsers();
loadUsers();
