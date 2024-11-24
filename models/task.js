const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // 允许使用自定义字符串 ID
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, required: true },
  tags: { type: [String], default: [] }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;