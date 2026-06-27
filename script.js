const MAX_SAVES = 200;

// Save entry with timestamp
function saveEntry() {
  let diaryText = document.getElementById("diaryPage").value.trim();
  if (!diaryText) {
    showStatus("Nothing to save!", "warning");
    return;
  }

  let saves = JSON.parse(localStorage.getItem("diarySaves")) || [];

  if (saves.length >= MAX_SAVES) {
    showStatus("Save limit reached (200).", "error");
    return;
  }

  let now = new Date();
  let timestamp = now.toLocaleString();

  saves.push({ text: diaryText, date: timestamp, name: `Save ${saves.length + 1}` });
  localStorage.setItem("diarySaves", JSON.stringify(saves));

  showStatus(`Saved as ${saves[saves.length - 1].name} (${timestamp})`, "success");
}

// Erase current text area
function eraseEntry() {
  document.getElementById("diaryPage").value = "";
  showStatus("Entry erased from editor.", "warning");
}

// Load entries list with options
function loadEntry() {
  let saves = JSON.parse(localStorage.getItem("diarySaves")) || [];

  if (saves.length === 0) {
    showStatus("No saved entries yet.", "warning");
    return;
  }

  // Create popup menu
  let menu = document.createElement("div");
  menu.style.position = "fixed";
  menu.style.top = "50%";
  menu.style.left = "50%";
  menu.style.transform = "translate(-50%, -50%)";
  menu.style.background = "#fff8dc";
  menu.style.border = "2px solid #8b5e3c";
  menu.style.padding = "20px";
  menu.style.zIndex = "9999";
  menu.style.maxHeight = "70vh";
  menu.style.overflowY = "auto";

  let title = document.createElement("h3");
  title.innerText = "Select a Save";
  menu.appendChild(title);

  saves.forEach((entry, index) => {
    let container = document.createElement("div");
    container.style.marginBottom = "10px";

    let label = document.createElement("span");
    label.innerText = `${entry.name} (${entry.date})`;
    label.style.marginRight = "10px";

    // Open button
    let openBtn = document.createElement("button");
    openBtn.innerText = "Open";
    openBtn.onclick = () => {
      document.getElementById("diaryPage").value = entry.text;
      showStatus(`Loaded ${entry.name}`, "success");
      document.body.removeChild(menu);
      addOverwriteDeleteRenameButtons(index);
    };

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.marginLeft = "5px";
    deleteBtn.onclick = () => {
      saves.splice(index, 1);
      localStorage.setItem("diarySaves", JSON.stringify(saves));
      document.body.removeChild(menu);
      showStatus(`${entry.name} deleted!`, "warning");
    };

    // Rename button
    let renameBtn = document.createElement("button");
    renameBtn.innerText = "Rename";
    renameBtn.style.marginLeft = "5px";
    renameBtn.onclick = () => {
      let newName = prompt("Enter new name:", entry.name);
      if (newName) {
        saves[index].name = newName;
        localStorage.setItem("diarySaves", JSON.stringify(saves));
        document.body.removeChild(menu);
        showStatus(`${entry.name} renamed to ${newName}`, "success");
      }
    };

    container.appendChild(label);
    container.appendChild(openBtn);
    container.appendChild(renameBtn);
    container.appendChild(deleteBtn);
    menu.appendChild(container);
  });

  // Close button
  let closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  closeBtn.style.marginTop = "10px";
  closeBtn.onclick = () => document.body.removeChild(menu);
  menu.appendChild(closeBtn);

  document.body.appendChild(menu);
}

// Add overwrite button for a specific save
function addOverwriteDeleteRenameButtons(index) {
  // Remove old buttons if they exist
  ["overwriteBtn", "deleteBtn", "renameBtn"].forEach(id => {
    let old = document.getElementById(id);
    if (old) old.remove();
  });

  let saves = JSON.parse(localStorage.getItem("diarySaves")) || [];

  let overwriteBtn = document.createElement("button");
  overwriteBtn.id = "overwriteBtn";
  overwriteBtn.innerText = `Overwrite ${saves[index].name}`;
  overwriteBtn.style.marginLeft = "10px";
  overwriteBtn.onclick = () => {
    saves[index].text = document.getElementById("diaryPage").value;
    saves[index].date = new Date().toLocaleString();
    localStorage.setItem("diarySaves", JSON.stringify(saves));
    showStatus(`${saves[index].name} updated!`, "success");
  };

  let deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteBtn";
  deleteBtn.innerText = `Delete ${saves[index].name}`;
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.onclick = () => {
    saves.splice(index, 1);
    localStorage.setItem("diarySaves", JSON.stringify(saves));
    document.getElementById("diaryPage").value = "";
    showStatus(`${saves[index].name} deleted!`, "warning");
    overwriteBtn.remove();
    deleteBtn.remove();
    renameBtn.remove();
  };

  let renameBtn = document.createElement("button");
  renameBtn.id = "renameBtn";
  renameBtn.innerText = `Rename ${saves[index].name}`;
  renameBtn.style.marginLeft = "10px";
  renameBtn.onclick = () => {
    let newName = prompt("Enter new name:", saves[index].name);
    if (newName) {
      saves[index].name = newName;
      localStorage.setItem("diarySaves", JSON.stringify(saves));
      showStatus(`Renamed to ${newName}`, "success");
      overwriteBtn.innerText = `Overwrite ${newName}`;
      deleteBtn.innerText = `Delete ${newName}`;
      renameBtn.innerText = `Rename ${newName}`;
    }
  };

  document.querySelector(".buttons").appendChild(overwriteBtn);
  document.querySelector(".buttons").appendChild(renameBtn);
  document.querySelector(".buttons").appendChild(deleteBtn);
}

// Status message
function showStatus(message, type) {
  let status = document.getElementById("statusMessage");
  status.innerText = message;
  status.className = `status show ${type}`;
  setTimeout(() => {
    status.className = "status";
  }, 2500);
}
