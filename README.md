# Task Management Application

## Project Information
- *Project Name*: TaskMaster
- *Group Number*: [34]
- *Members*:
  - [Lai Wang Hong ] (SID: 11699983)
  - [LIAO ZEWEI ] (SID: 13176461)
  - [ZHAO Mutao] (SID: 12932680)
  - [Yuen Wun] (SID: 13648665)

## Project File Intro
- **server.js**: Main server file for Express.js configuration, authentication middleware, route handlers, database connection, and session management.
- **package.json**: Lists dependencies such as Express, Mongoose, EJS, Express-session, and Bcrypt.
- **public/**: Contains static files including:
  - `style.css`: Main stylesheet for the application.
  - `scripts.js`: Client-side JavaScript functionalities.
  - `images/`: Directory for application images and icons (currently empty).
  - `clarALLTasks.js`: JavaScript file for managing all tasks.
- **views/**: Contains EJS template files including:
  - `login.ejs`: User login page.
  - `register.ejs`: User registration page.
  - `taskManagement.ejs`: Main task management interface.
- **models/**: Contains database schema files including:
  - `user.js`: User model schema.
  - `task.js`: Task model schema.

## Cloud-Based Server URL
- Application URL: [http://381project-34.whalemc.com:3000/]

## Operation Guides
### Login/Logout Pages
- **Valid Login Information**:
  - Email: `test@example.com`
  - Password: `test123`
- **Sign In Steps**:
  1. Navigate to the login page.
  2. Enter the email and password.
  3. Click the "Login" button.

### CRUD Web Pages
- **Create Task**:
  - Button: "New Task" on the dashboard.
  - Steps: Fill in task details and click "Create Task".
- **Read Tasks**:
  - View all tasks on the dashboard.
  - Use the search bar to filter tasks by status, priority, or date range.
- **Update Task**:
  - Button: "Edit" on the task card.
  - Steps: Modify task details and click "Save Changes".
- **Delete Task**:
  - Button: "Delete" on the task card.
  - Steps: Click "Delete" and confirm the deletion in the popup dialog.

### RESTful CRUD Services
- **API Endpoints**:
  - **Create Task (POST)**:
    - Path: `/api/tasks`
    - CURL Command:
      ```bash
      curl -X POST http://381project-34.whalemc.com:3000/api/tasks \
      -H "Content-Type: application/json" \
      -d '{"title":"New Task","description":"Task details","deadline":"2024-12-31"}'
      ```
  - **Read Tasks (GET)**:
    - Path: `/api/tasks`
    - CURL Command:
      ```bash
      curl -X GET http://381project-34.whalemc.com:3000/api/tasks
      ```
  - **Update Task (PUT)**:
    - Path: `/api/tasks/:id`
    - CURL Command:
      ```bash
      curl -X PUT http://381project-34.whalemc.com:3000/api/tasks/{taskId} \
      -H "Content-Type: application/json" \
      -d '{"title":"Updated Task","description":"Updated details"}'
      ```
  - **Delete Task (DELETE)**:
    - Path: `/api/tasks/:id`
    - CURL Command:
      ```bash
      curl -X DELETE http://381project-34.whalemc.com:3000/api/tasks/{taskId}
      ```

## Notes
- The `README.md` is crucial for understanding the functionalities of the project, which is essential for grading.
