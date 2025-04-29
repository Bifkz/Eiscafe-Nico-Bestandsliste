// ==========================
// Eistabelle: script.js
// ==========================

// 🔐 Zulässige Benutzer
const ALLOWED_USERS = ["eisp0", "eisp1", "eisp2", "eisp3", "eisp9"];
let userCode = localStorage.getItem("eisUser");

// 🧊 JSONBin-Zugang
const BIN_ID = "68112fd0eb52f179214af68b";
const API_KEY = "$2a$10$TFZncjnXL6i5/i9y7jMDIe6GlWMlF/g4F/u2KnHI7QfGvNV5BQls.";
const tableBody = document.getElementById("tableBody");

// ▶️ App starten
window.onload = () => {
  if (userCode && ALLOWED_USERS.includes(userCode)) {
    showMainApp();
  }
};

// 🔓 Login
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

// 🟢 Hauptansicht zeigen
function showMainApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  loadData();
}

// 🔄 Daten laden von JSONBin
async function loadData() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const result = await res.json();
    renderTable(result.record);
  } catch (err) {
    console.error("Fehler beim Laden:", err);
    alert("Daten konnten nicht geladen werden.");
  }
}

// 🧾 Tabelle anzeigen
function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach(row => addRow(row.name, row.laden, row.lager));
}

// ➕ Neue Zeile hinzufügen
function addRow(name = "", laden = "", lager = "") {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" value="${name}" oninput="autoSave()"></td>
    <td><input type="number" value="${laden}" oninput="autoSave()"></td>
    <td><input type="number" value="${lager}" oninput="autoSave()"></td>
  `;
  tableBody.appendChild(row);
}

// 📥 Tabelleninhalte auslesen
function getTableData() {
  const rows = tableBody.querySelectorAll("tr");
  return Array.from(rows).map(row => {
    const inputs = row.querySelectorAll("input");
    return {
      name: inputs[0].value,
      laden: inputs[1].value,
      lager: inputs[2].value
    };
  });
}

// 💾 Automatisch speichern
async function autoSave() {
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
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
  }
}

// 💾 Manuelles Speichern mit Feedback
function saveData() {
  autoSave();
  alert("Gespeichert!");
}

// 🗑️ Modal zum Löschen anzeigen
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

// ❌ Modal ausblenden
function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

// 🚮 Zeile löschen
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


