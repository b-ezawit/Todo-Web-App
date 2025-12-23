const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");
const inProgressCount = document.getElementById("inprogressCount");
const doneCount = document.getElementById("doneCount");

//HELPER: Create HTML (With type="button" everywhere)
function createCardHTML(task) {
    const div = document.createElement("div");
    div.classList.add("task-card");
    div.dataset.id = task.id;

    div.innerHTML = `
        <div class="card-header">
            <input type="checkbox" class="check-btn" ${task.category === 'Done' ? 'checked' : ''}>
            <span class="title-display">${task.title}</span>
            <div class="action-icons">
                <button type="button" class="edit-btn btn">🖊️</button>
                <button type="button" class="delete-btn btn" style="color:red;">🗑</button>
                <button type="button" class="view-btn btn">...</button>
            </div>
        </div>
        
        <div class="view-details" style="display: none;">
            <p><strong>Due:</strong> <span class="date-display">${task.duedate}</span></p>
            <p><strong>Desc:</strong> <span class="desc-display">${task.description}</span></p>
            <button type="button" class="hide-view-btn btn">Close</button>
        </div>

        <div class="edit-details" style="display: none;">
            <ul class="edit-task-detail">
                <li>Title: <input type="text" class="edit-title" value="${task.title}"></li>
                <li>Due: <input type="date" class="edit-date" value="${task.duedate}"></li>
                <li>Desc: <textarea class="edit-desc">${task.description}</textarea></li>
            </ul>
            <div style="margin-top:10px;">
                <button type="button" class="save-btn btn btn-gradient">Save</button>
                <button type="button" class="cancel-edit-btn btn">Cancel</button>
            </div>
        </div>
    `;
    return div;
}

function updateCounters() {
    inProgressCount.textContent = `In Progress: ${todoList.children.length}`;
    doneCount.textContent = `Done: ${doneList.children.length}`;
}

// CORE FUNCTIONS (The Surgical Approach)

// 1. Initial Load (Runs ONLY ONCE)
function initialRender(tasks) {
    todoList.innerHTML = "";
    doneList.innerHTML = "";
    if (!tasks) return;
    
    tasks.forEach(task => {
        const card = createCardHTML(task);
        if (task.category === "Done") doneList.appendChild(card);
        else todoList.appendChild(card);
    });
    updateCounters();
}

// 2. Append (Adds to bottom, no innerHTML wipe)
function appendSingleTask(task) {
    const card = createCardHTML(task);
    todoList.appendChild(card);
    updateCounters();
}

// 3. Move (Physically moves element, no blink)
function moveTaskCard(card, newStatus) {
    const targetList = newStatus === "Done" ? doneList : todoList;
    targetList.appendChild(card); 
    updateCounters();
}

// 4. Remove (Removes element, no blink)
function removeTaskCard(card) {
    card.remove();
    updateCounters();
}

// 5. Update Text (Updates specific words, no card recreation)
function updateCardText(card, data) {
    card.querySelector(".title-display").textContent = data.title;
    card.querySelector(".date-display").textContent = data.duedate;
    card.querySelector(".desc-display").textContent = data.description;
    
    // Update inputs too
    card.querySelector(".edit-title").value = data.title;
    card.querySelector(".edit-date").value = data.duedate;
    card.querySelector(".edit-desc").value = data.description;
}

// 6. Clear All (Loop remove)
function clearAllTasksVisually() {
    while (todoList.firstChild) todoList.removeChild(todoList.firstChild);
    while (doneList.firstChild) doneList.removeChild(doneList.firstChild);
    updateCounters();
}

// VIEW TOGGLES

function showEditView(card) {
    card.querySelector(".view-details").style.display = "none";
    card.querySelector(".card-header").style.display = "none";
    card.querySelector(".edit-details").style.display = "block";
}

function showMoreView(card) {
    card.querySelector(".edit-details").style.display = "none";
    card.querySelector(".view-details").style.display = "block";
}

function showNormalView(card) {
    card.querySelector(".view-details").style.display = "none";
    card.querySelector(".edit-details").style.display = "none";
    card.querySelector(".card-header").style.display = "flex";
}

// FORM UTILS

function openInputForm(defaultValue = "") {
    if (document.querySelector(".insertForm")) return; 

    const div = document.createElement("div");
    div.classList.add("insertForm");
    div.innerHTML = `
        <ul class="task-detail">
            <li>Title: <input type="text" class="title" value="${defaultValue}" placeholder="Task Title"></li>
            <li>Due Date: <input type="date" class="duedate"></li>
            <li>Description: <textarea class="desc" placeholder="Details..."></textarea></li>
        </ul>
    `;
    document.getElementById("input").after(div);
}

function closeInputForm() {
    const form = document.querySelector(".insertForm");
    if (form) form.remove();
    const mainInput = document.getElementById("input");
    if (mainInput) mainInput.value = "";
}

function updateThemeIcon(isDark) {
    const textSpan = document.querySelector(".toggle-text");
    const iconSpan = document.querySelector(".moon-icon");
    if(textSpan) textSpan.textContent = isDark ? "Light Mode" : "Dark Mode";
    if(iconSpan) iconSpan.textContent = isDark ? "☀" : "☾";
}

export default {
    initialRender,
    appendSingleTask,
    moveTaskCard,
    removeTaskCard,
    updateCardText,
    clearAllTasksVisually,
    showEditView,
    showMoreView,
    showNormalView,
    openInputForm,
    closeInputForm,
    updateThemeIcon
};