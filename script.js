const ALLOWED_USERS = ["eisp0", "eisp1", "eisp2", "eisp3", "eisp9"];
let userCode = localStorage.getItem("eisUser");

// JSONBin Zugangsdaten
const BIN_ID = "68112fd0eb52f179214af68b";
const API_KEY = "$2a$10$TFZncjnXL6i5/i9y7jMDIe6GlWMlF/g4F/u2KnHI7QfGvNV5BQls.";

function login() {
  const input = document.getElementById("userCodeInput").value.trim();
  if (ALLOWED_USERS.includes(input)) {
    userCode = input;
    localStorage.setItem("eisUser", input);
    showMainApp();
  } else {
    alert("Ungültiger Code");
  }
}

function showMainApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  loadData(); // Daten aus JSONBin laden
}

window.onload = () => {
  if (userCode && ALLOWED_USERS.includes(userCode)) {
    showMainApp();
  }
};

const tableBody = document.getElementById("tableBody");

function loadData() {
  const saved = localStorage.getItem("eisData");
  if (saved) {
    tableBody.innerHTML = saved;
    Array.from(document.querySelectorAll("input")).forEach(el => {
      el.addEventListener("input", autoSave);
    });
  } else {
    addRow("Schoko", "4", "2");
    addRow("Vanille", "", "");
    addRow("Erdbeere", "", "");
  }
}

function autoSave() {
  localStorage.setItem("eisData", tableBody.innerHTML);
}

function addRow(name = "", laden = "", lager = "") {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${name}" oninput="autoSave()"></td>
    <td><input type="number" value="${laden}" oninput="autoSave()"></td>
    <td><input type="number" value="${lager}" oninput="autoSave()"></td>
  `;
  tableBody.appendChild(row);
  autoSave();
}

function saveData() {
  localStorage.setItem("eisData", tableBody.innerHTML);
  alert("Gespeichert!");
}

window.onload = loadData;

function showDeleteModal() {
  const select = document.getElementById("deleteSelect");
  select.innerHTML = "";
  document.querySelectorAll("#eisTable tbody tr").forEach((row, idx) => {
    const name = row.cells[0].querySelector("input").value || "(leer)";
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = name;
    select.appendChild(option);
  });
  document.getElementById("deleteModal").style.display = "block";
}

function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function deleteRow() {
  const idx = document.getElementById("deleteSelect").value;
  const rows = document.querySelectorAll("#eisTable tbody tr");
  if (rows[idx]) {
    rows[idx].remove();
    autoSave();
    hideDeleteModal();
  }
}
