import crud from './api.js';
import ui from './ui.js';

window.addEventListener('submit', function(e) {
    e.preventDefault();
    return false;
});

// 1. THEME LOGIC (Runs Instantly)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add("dark-theme");
}


// 2. INITIALIZATION
async function init() {
    ui.updateThemeIcon(document.body.classList.contains("dark-theme"));
    const allTasks = await crud.getTasks();
    ui.initialRender(allTasks);
}

window.addEventListener('DOMContentLoaded', init);

// EVENT HANDLER
document.body.addEventListener("click", async (e) => {
    const el = e.target;
    
    if (el.tagName === 'BUTTON' || el.type === 'submit') {
        e.preventDefault();
    }

    // Theme Toggle
    if (el.closest("#themeBtn")) {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        ui.updateThemeIcon(isDark);
        return;
    }
    // Clear All Button
    if (el.classList.contains("clear")) {
        if (confirm("Delete ALL tasks?")) {
            ui.clearAllTasksVisually();
            const allTasks = await crud.getTasks("");
            for (const task of allTasks) {
                await crud.deleteTask(task.id);
            }
        }
        return;
    }

    // Add Button
    if (el.classList.contains("add")) {
        const inputField = document.getElementById("input");
        
        //Open Form
        if (!document.querySelector(".insertForm")) {
            ui.openInputForm(inputField.value);
            return;
        }

        // Save New Task
        const titleVal = document.querySelector(".title").value;
        const dateVal = document.querySelector(".duedate").value;
        const descVal = document.querySelector(".desc").value;

        if (!titleVal) return alert("Title required");

        const newTask = {
            title: titleVal,
            duedate: dateVal,
            description: descVal,
            category: "In-progress"
        };

        ui.closeInputForm();
        const createdTask = await crud.createTask(newTask);
        ui.appendSingleTask(createdTask); 
        return;
    }

    // CARD SPECIFIC ACTIONS 
    const card = el.closest(".task-card");
    if (!card) return; 

    const cardId = card.dataset.id;

    // Checkbox
    if (el.classList.contains("check-btn")) {
        const newStatus = el.checked ? "Done" : "In-progress";
           
        ui.moveTaskCard(card, newStatus); 
        await crud.updateTask(cardId, { category: newStatus });
    }

    // Delete Icon
    else if (el.classList.contains("delete-btn")) {
        ui.removeTaskCard(card);
        await crud.deleteTask(cardId);
    }

    //Edit Icon
    else if (el.classList.contains("edit-btn")) {
        ui.showEditView(card);
    }

    // View/More Icon
    else if (el.classList.contains("view-btn")) {
        ui.showMoreView(card);
    }

    // Close/Cancel Buttons
    else if (el.classList.contains("hide-view-btn") || el.classList.contains("cancel-edit-btn")) {
        ui.showNormalView(card);
    }

    //Save Changes Button
    else if (el.classList.contains("save-btn")) {
        const updatedData = {
            title: card.querySelector(".edit-title").value,
            duedate: card.querySelector(".edit-date").value,
            description: card.querySelector(".edit-desc").value
        };

        ui.updateCardText(card, updatedData);
        ui.showNormalView(card);

        await crud.updateTask(cardId, updatedData);
    }
});

