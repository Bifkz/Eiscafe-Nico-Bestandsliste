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
  setInterval(loadData, 10000); // Live-Update
}

window.onload = () => {
  if (userCode && ALLOWED_USERS.includes(userCode)) {
    showMainApp();
  }
};

const tableBody = document.getElementById("tableBody");

async function loadData() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });
    const data = await res.json();
    renderTable(data.record);
  } catch (err) {
    console.error("Fehler beim Laden", err);
    alert("Fehler beim Laden der Daten");
  }
}

function renderTable(dataArray) {
  tableBody.innerHTML = "";
  dataArray.forEach(row => {
    addRow(row.name, row.laden, row.lager);
  });
}

function getTableData() {
  return Array.from(document.querySelectorAll("#eisTable tbody tr")).map(row => ({
    name: row.cells[0].querySelector("input").value,
    laden: row.cells[1].querySelector("input").value,
    lager: row.cells[2].querySelector("input").value
  }));
}

async function saveData() {
  const data = getTableData();
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(data)
    });
    console.log("Zentral gespeichert");
  } catch (err) {
    console.error("Fehler beim Speichern", err);
    alert("Fehler beim Speichern");
  }
}

function autoSave() {
  saveData();
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

