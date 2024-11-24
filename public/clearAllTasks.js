const mongoose = require('mongoose');
const Task = require('./models/task'); // 引入 Task 模型

mongoose.connect('mongodb+srv://2737835104:a8129819a@zed.i5dpz.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    await Task.deleteMany({});
    console.log('所有任务已成功删除');
  } catch (error) {
    console.error('删除任务时出错:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('连接数据库时出错:', err);
});