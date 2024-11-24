const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Task = require('./models/task'); // 引入 models 文件夹中的 task.js 文件
const User = require('./models/user'); // 引入 models 文件夹中的 user.js 文件
const path = require('path');

const app = express();
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 请求体
app.use(express.static('public')); // 提供静态文件服务

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Session middleware
app.use(session({
    secret: '381project@G34', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set to true if using HTTPS
}));

// 连接到 MongoDB 数据库
mongoose.connect('mongodb+srv://381project34:xtr5pi4XZET8HaQE@cluster0.3pubw.mongodb.net/myDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    res.redirect('/login'); // User is not authenticated, redirect to login
}

// 获取所有任务的 API 路由 (Read)
app.get('/api/tasks', isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find();
        const formattedTasks = tasks.map(task => {
            return `ID: ${task._id} | Title: ${task.title} | Description: ${task.description} | Due Date: ${task.dueDate} | Priority: ${task.priority}`;
        }).join(' ; ');
        res.send(formattedTasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 创建任务的 API 路由 (Create)
app.post('/api/tasks', isAuthenticated, async (req, res) => {
    const { id, title, description, dueDate, priority } = req.body;

    const existingTask = await Task.findById(id);
    if (existingTask) {
        return res.status(400).send({ message: '任务 ID 已存在，请使用其他 ID。' });
    }

    const task = new Task({
        _id: id,
        title,
        description,
        dueDate,
        priority
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 更新任务的 API 路由 (Update)
app.put('/api/tasks/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, priority } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { title, description, dueDate, priority }, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send('任务未找到');
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// 删除任务的 API 路由 (Delete)
app.delete('/api/tasks/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404 ).send('任务未找到');
        }
        res.send('任务已删除');
    } catch (error) {
        res.status(500).send(error);
    }
});

// 提供前端页面的路由
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Login/Register Routes
app.get('/login', (req, res) => {
    res.render('login', { error: null }); // Render login.ejs
});

app.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body); // Log the incoming request body

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        console.log('User  found:', user); // Log the found user

        if (user && await user.comparePassword(password)) {
            req.session.userId = user._id;
            req.session.username = user.username;
            return res.redirect('/tasks'); // Redirect to tasks page after login
        } else {
            console.log('Invalid credentials');
            return res.render('login', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.render('login', { error: 'Login failed. Please try again.' });
    }
});

app.get('/register', (req, res) => {
    res.render('register', { error: null }); // Render register.ejs
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, password, email });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.render('register', { 
            error: 'Registration failed. Username or email might be taken.' 
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Add this route to serve the tasks page
app.get('/tasks', isAuthenticated, (req, res) => {
    res.render('taskManagement', { username: req.session.username }); // Render tasks.ejs and pass the username
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
