// =====================
// Eistabelle script.js
// =====================

// 🔐 Login-Codes
const ALLOWED_USERS = ["eisp0", "eisp1", "eisp2", "eisp3", "eisp9"];
let userCode = localStorage.getItem("eisUser");
let isEditing = false; // 👈 zum Schutz vor Datenüberschreibung

// 🔐 JSONBin Zugang
const BIN_ID = "68112fd0eb52f179214af68b";
const API_KEY = "$2a$10$TFZncjnXL6i5/i9y7jMDIe6GlWMlF/g4F/u2KnHI7QfGvNV5BQls.";

// 🔁 Bei Seitenaufruf automatisch einloggen, wenn möglich
window.onload = () => {
  if (userCode && ALLOWED_USERS.includes(userCode)) {
    showMainApp();
  }
};

// 🔓 Login-Vorgang
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

// ▶️ Hauptansicht aktivieren
function showMainApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  loadData();
  setInterval(() => {
    if (!isEditing) loadData(); // 👈 nur wenn nicht editiert wird
  }, 10000);
}

// 📥 Daten aus JSONBin laden
async function loadData() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const data = await res.json();
    renderTable(data.record);
  } catch (err) {
    console.error("Fehler beim Laden:", err);
    alert("Fehler beim Laden der Daten");
  }
}

// 🧾 Tabelle rendern
const tableBody = document.getElementById("tableBody");

function renderTable(dataArray) {
  tableBody.innerHTML = "";
  dataArray.forEach(row => addRow(row.name, row.laden, row.lager));
}

// 📝 Tabelle auslesen
function getTableData() {
  return Array.from(tableBody.querySelectorAll("tr")).map(row => {
    const inputs = row.querySelectorAll("input");
    return {
      name: inputs[0]?.value || "",
      laden: inputs[1]?.value || "",
      lager: inputs[2]?.value || ""
    };
  });
}

// 💾 Daten zentral speichern
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
    console.error("Fehler beim Speichern:", err);
    alert("Fehler beim Speichern");
  }
}

// 📝 Eingabe überwachen und Autosave auslösen
function handleEdit() {
  isEditing = true;
  autoSave();
  setTimeout(() => isEditing = false, 3000); // nach 3s darf wieder geladen werden
}

// 💾 Autosave bei Eingabe
function autoSave() {
  saveData();
}

// ➕ Neue Zeile
function addRow(name = "", laden = "", lager = "") {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${name}" oninput="handleEdit()"></td>
    <td><input type="number" value="${laden}" oninput="handleEdit()"></td>
    <td><input type="number" value="${lager}" oninput="handleEdit()"></td>
  `;
  tableBody.appendChild(row);
}

// 🗑️ Löschen öffnen
function showDeleteModal() {
  const select = document.getElementById("deleteSelect");
  select.innerHTML = "";
  tableBody.querySelectorAll("tr").forEach((row, idx) => {
    const name = row.querySelector("input").value || "(leer)";
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = name;
    select.appendChild(option);
  });
  document.getElementById("deleteModal").style.display = "block";
}

// ❌ Löschen abbrechen
function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

// ❌ Zeile löschen
function deleteRow() {
  const idx = document.getElementById("deleteSelect").value;
  const rows = tableBody.querySelectorAll("tr");
  if (rows[idx]) {
    rows[idx].remove();
    autoSave();
    hideDeleteModal();
  }
}

}


