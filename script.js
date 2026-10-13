const userForm = document.getElementById("userForm");
const recordId = document.getElementById("recordId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const cityInput = document.getElementById("city");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("tableBody");
const emptyState = document.getElementById("emptyState");

const STORAGE_KEY = "localTableUsers";

let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function resetForm() {
    userForm.reset();
    recordId.value = "";
    submitBtn.textContent = "Add User";
    nameInput.focus();
}

function getFilteredUsers() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        return users;
    }

    return users.filter((user) => {
        return Object.values(user).some((value) =>
            String(value).toLowerCase().includes(query)
        );
    });
}

function renderTable() {
    const visibleUsers = getFilteredUsers();

    tableBody.innerHTML = "";
    emptyState.classList.toggle("hidden", visibleUsers.length > 0);

    visibleUsers.forEach((user) => {
        const row = document.createElement("tr");
        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        [user.name, user.email, user.phone, user.city].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        actions.className = "row-actions";

        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = user.id;

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "danger";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = user.id;

        actions.append(editButton, deleteButton);
        actionsCell.appendChild(actions);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function addUser(user) {
    users.push({
        id: Date.now().toString(),
        ...user
    });
}

function updateUser(id, user) {
    users = users.map((savedUser) => {
        if (savedUser.id === id) {
            return { id, ...user };
        }

        return savedUser;
    });
}

userForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const user = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim()
    };

    if (recordId.value) {
        updateUser(recordId.value, user);
    } else {
        addUser(user);
    }

    saveUsers();
    renderTable();
    resetForm();
});

clearBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", renderTable);

tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const user = users.find((item) => item.id === button.dataset.id);

    if (!user) {
        return;
    }

    if (button.dataset.action === "edit") {
        recordId.value = user.id;
        nameInput.value = user.name;
        emailInput.value = user.email;
        phoneInput.value = user.phone;
        cityInput.value = user.city;
        submitBtn.textContent = "Update User";
        nameInput.focus();
    }

    if (button.dataset.action === "delete") {
        users = users.filter((item) => item.id !== user.id);
        saveUsers();
        renderTable();
        resetForm();
    }
});

renderTable();
