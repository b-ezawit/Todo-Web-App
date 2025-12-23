const url = "http://localhost:3000/todos";

//GET
async function getTasks(path = "") { 
    try {
        
        const endpoint = path ? `${url}/${path}` : url;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("No Task");
        return await response.json();
    } catch (error) {
        console.log(error);
        return []; 
    }
}

// POST
async function createTask(taskData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) throw new Error("Failed to create task.");
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

// DELETE
async function deleteTask(id) {
    try {
        const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Failed to delete task.");
        return "Success!";
    } catch (error) {
        console.log(error);
    }
}

// PATCH
async function updateTask(id, updatedFields) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields)
        });
        if (!response.ok) throw new Error("Failed to update task.");
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

export default { getTasks, createTask, deleteTask, updateTask };