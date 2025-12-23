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
    // Set icon correctly on load
    ui.updateThemeIcon(document.body.classList.contains("dark-theme"));
    
    // Load tasks ONLY ONCE
    const allTasks = await crud.getTasks();
    ui.initialRender(allTasks);
}

window.addEventListener('DOMContentLoaded', init);

// 3. EVENT HANDLER (SINGLE SOURCE OF TRUTH)
document.body.addEventListener("click", async (e) => {
    const el = e.target;
    
    //Prevent any button from reloading page
    if (el.tagName === 'BUTTON' || el.type === 'submit') {
        e.preventDefault();
    }

    // --- GLOBAL BUTTONS ---

    // 1. Theme Toggle
    if (el.closest("#themeBtn")) {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        ui.updateThemeIcon(isDark);
        return;
    }

    // 2. Clear All Button
    if (el.classList.contains("clear")) {
        if (confirm("Delete ALL tasks?")) {
            // UI: Remove items one by one (No blink, no reload)
            ui.clearAllTasksVisually();
            
            // API: Delete in background
            const allTasks = await crud.getTasks("");
            for (const task of allTasks) {
                await crud.deleteTask(task.id);
            }
        }
        return;
    }

    // 3. Add Button
    if (el.classList.contains("add")) {
        const inputField = document.getElementById("input");
        
        // Scenario A: Open Form
        if (!document.querySelector(".insertForm")) {
            ui.openInputForm(inputField.value);
            return;
        }

        // Scenario B: Save New Task
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

        // UI: Close form & Append Card Instantly
        ui.closeInputForm();
        
        // API: Create task (We await this only to get the ID)
        const createdTask = await crud.createTask(newTask);
        
        // UI: Append the real card with the ID from database
        ui.appendSingleTask(createdTask); 
        return;
    }

    // CARD SPECIFIC ACTIONS 
    const card = el.closest(".task-card");
    if (!card) return; // Exit if not clicking a card

    const cardId = card.dataset.id;

    // 4. Checkbox (Move)
    if (el.classList.contains("check-btn")) {
        const newStatus = el.checked ? "Done" : "In-progress";
        
        // UI: Move the element physically (No disappear/reappear)
        ui.moveTaskCard(card, newStatus); 
        
        // API: Update background
        await crud.updateTask(cardId, { category: newStatus });
    }

    // 5. Delete Icon
    else if (el.classList.contains("delete-btn")) {
        // UI: Remove element
        ui.removeTaskCard(card);
        
        // API: Delete background
        await crud.deleteTask(cardId);
    }

    // 6. Edit Icon
    else if (el.classList.contains("edit-btn")) {
        ui.showEditView(card);
    }

    // 7. View/More Icon
    else if (el.classList.contains("view-btn")) {
        ui.showMoreView(card);
    }

    // 8. Close/Cancel Buttons
    else if (el.classList.contains("hide-view-btn") || el.classList.contains("cancel-edit-btn")) {
        ui.showNormalView(card);
    }

    // 9. Save Changes Button
    else if (el.classList.contains("save-btn")) {
        const updatedData = {
            title: card.querySelector(".edit-title").value,
            duedate: card.querySelector(".edit-date").value,
            description: card.querySelector(".edit-desc").value
        };

        // UI: Update text directly
        ui.updateCardText(card, updatedData);
        ui.showNormalView(card);

        // API: Update background
        await crud.updateTask(cardId, updatedData);
    }
});

