// public/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Task list functionality
    const taskList = document.getElementById('task-list');
    if (taskList) {
        loadTasks();
        setupTaskFilters();
    }

    // Task search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterTasks);
    }

    // Task filters
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('change', filterTasks);
    }

    // Task creation form
    const createTaskForm = document.getElementById('create-task-form');
    if (createTaskForm) {
        createTaskForm.addEventListener('submit', createTask);
    }

    // Task edit functionality
    const editTaskForms = document.querySelectorAll('.edit-task-form');
    editTaskForms.forEach(form => {
        form.addEventListener('submit', updateTask);
    });

    // Delete task functionality
    setupDeleteHandlers();

    // Status update functionality
    setupStatusHandlers();
});

// Load tasks from the API
function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                taskList.appendChild(createTaskElement(task));
            });
        })
        .catch(error => console.error('Error loading tasks:', error));
}

// Create a task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-priority', task.priority);
    li.setAttribute('data-status', task.status);
    li.setAttribute('data-category', task.category);
    
    li.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
        <p class="task-due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
        <p class="task-priority">Priority: ${task.priority}</p>
        <div class="task-status">
            Status: 
            <select class="status-select" data-id="${task._id}">
                <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
        </div>
        <div class="task-actions">
            <button class="btn btn-primary edit-task-btn" data-id="${task._id}">Edit</button>
            <button class="btn btn-danger delete-task" data-id="${task._id}">Delete</button>
        </div>
    `;
    return li;
}

// Create a new task
function createTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData.entries());

    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(newTask => {
        const taskList = document.getElementById('task-list');
        taskList.appendChild(createTaskElement(newTask));
        event.target.reset();
    })
    .catch(error => console.error('Error creating task:', error));
}

// Update an existing task
function updateTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData.entries());
    const taskId = event.target.dataset.id;

    fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(updatedTask => {
        const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
        taskElement.replaceWith(createTaskElement(updatedTask));
    })
    .catch(error => console.error('Error updating task:', error));
}

// Filter tasks
function filterTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    const tasks = document.querySelectorAll('.task-item');

    tasks.forEach(task => {
        const title = task.querySelector('.task-title').textContent.toLowerCase();
        const priority = task.getAttribute('data-priority');
        const status = task.getAttribute('data-status');
        const category = task.getAttribute('data-category');

        const matchesSearch = title.includes(searchTerm);
        const matchesPriority = priorityFilter === 'all' || priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;

        if (matchesSearch && matchesPriority && matchesStatus && matchesCategory) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

// Setup task filters
function setupTaskFilters() {
    const filterElements = document.querySelectorAll('.task-filter');
    filterElements.forEach(filter => {
        filter.addEventListener('change', filterTasks);
    });
}

// Setup delete handlers
function setupDeleteHandlers() {
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', async (e) => {
            if (confirm('Are you sure you want to delete this task?')) {
                const taskId = e.target.getAttribute('data-id');
                try {
                    const response = await fetch(`/tasks/${taskId}/delete`, {
                        method: 'POST'
                    });
                    if (response.ok) {
                        e.target.closest('.task-item').remove();
                    }
                } catch (error) {
                    console.error('Error deleting task:', error);
                }
            }
        });
    });
}

// Setup status handlers
function setupStatusHandlers() {
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const taskId = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            
            try {
                const response = await fetch(`/tasks/${taskId}/status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                
                if (response.ok) {
                    const taskElement = e.target.closest('.task-item');
                    taskElement.setAttribute('data-status', newStatus);
                    updateTaskStatusStyle(taskElement, newStatus);
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        });
    });
}

// Update task status style
function updateTaskStatusStyle(taskElement, status) {
    taskElement.classList.remove('status-pending', 'status-in-progress', 'status-completed');
    taskElement.classList.add(`status-${status}`);
}
