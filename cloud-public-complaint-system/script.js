const STORAGE_KEY = "civicconnect_complaints_v1";
const form = document.getElementById("complaintForm");
const trackForm = document.getElementById("trackForm");
const trackingIdInput = document.getElementById("trackingId");
const trackingResult = document.getElementById("trackingResult");
const complaintsTable = document.getElementById("complaintsTable");
const statusFilter = document.getElementById("statusFilter");
const toast = document.getElementById("toast");

function getComplaints() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveComplaints(complaints) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function makeId() {
  return "CC-" + Math.floor(100000 + Math.random() * 900000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function statusClass(status) {
  if (status === "Resolved") return "status-resolved";
  if (status === "In Progress") return "status-progress";
  return "status-submitted";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function renderStats(complaints) {
  document.getElementById("totalCount").textContent = complaints.length;
  document.getElementById("pendingCount").textContent = complaints.filter(c => c.status !== "Resolved").length;
  document.getElementById("resolvedCount").textContent = complaints.filter(c => c.status === "Resolved").length;
}

function renderTable() {
  const complaints = getComplaints();
  const filter = statusFilter.value;
  const visible = complaints.filter(c => filter === "All" || c.status === filter);
  renderStats(complaints);

  if (!visible.length) {
    complaintsTable.innerHTML = `<tr class="table-empty"><td colspan="5">${complaints.length ? "No complaints match this filter." : "No complaints registered yet. Use the form above to add one."}</td></tr>`;
    return;
  }

  complaintsTable.innerHTML = visible.slice().reverse().map(c => `
    <tr>
      <td class="ref-id">${escapeHTML(c.id)}</td>
      <td class="complaint-title">${escapeHTML(c.subject)}</td>
      <td>${escapeHTML(c.category)}</td>
      <td>${formatDate(c.createdAt)}</td>
      <td><span class="status-pill ${statusClass(c.status)}">${escapeHTML(c.status)}</span></td>
    </tr>
  `).join("");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function displayTracking(complaint) {
  if (!complaint) {
    trackingResult.className = "tracking-result";
    trackingResult.innerHTML = `<div class="empty-icon">?</div><strong>Complaint not found</strong><p>Check the reference ID and try again.</p>`;
    return;
  }
  trackingResult.className = "tracking-result";
  trackingResult.innerHTML = `
    <div class="empty-icon">✓</div>
    <strong>${escapeHTML(complaint.subject)}</strong>
    <p>Reference: <span class="ref-id">${escapeHTML(complaint.id)}</span></p>
    <span class="status-pill ${statusClass(complaint.status)}">${escapeHTML(complaint.status)}</span>
    <div class="result-details">
      <p><b>Category:</b> ${escapeHTML(complaint.category)}</p>
      <p><b>Location:</b> ${escapeHTML(complaint.location)}</p>
      <p><b>Date submitted:</b> ${formatDate(complaint.createdAt)}</p>
      <p><b>Details:</b> ${escapeHTML(complaint.description)}</p>
    </div>`;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const complaints = getComplaints();
  let id = makeId();
  while (complaints.some(c => c.id === id)) id = makeId();

  const complaint = {
    id,
    fullName: data.get("fullName").trim(),
    email: data.get("email").trim(),
    phone: data.get("phone").trim(),
    category: data.get("category"),
    location: data.get("location").trim(),
    subject: data.get("subject").trim(),
    description: data.get("description").trim(),
    status: "Submitted",
    createdAt: new Date().toISOString()
  };

  complaints.push(complaint);
  saveComplaints(complaints);
  renderTable();
  trackingIdInput.value = complaint.id;
  displayTracking(complaint);
  form.reset();
  showToast(`Complaint registered. Your reference ID is ${complaint.id}`);
  document.getElementById("trackingId").scrollIntoView({ behavior: "smooth", block: "center" });
});

trackForm.addEventListener("submit", event => {
  event.preventDefault();
  const id = trackingIdInput.value.trim().toUpperCase();
  const complaint = getComplaints().find(c => c.id.toUpperCase() === id);
  displayTracking(complaint);
});

statusFilter.addEventListener("change", renderTable);

document.getElementById("clearDemo").addEventListener("click", () => {
  if (!getComplaints().length) {
    showToast("There is no demo data to clear.");
    return;
  }
  if (window.confirm("Clear all complaint records stored in this browser? This cannot be undone.")) {
    localStorage.removeItem(STORAGE_KEY);
    renderTable();
    trackingResult.className = "tracking-result empty-state";
    trackingResult.innerHTML = `<div class="empty-icon">⌕</div><strong>Your status will appear here</strong><p>Submit a complaint or enter an existing reference ID.</p>`;
    showToast("Demo complaint records cleared.");
  }
});

renderTable();
