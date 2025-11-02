const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/student_course_api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const Course = mongoose.model('Course', courseSchema);
const Student = mongoose.model('Student', studentSchema);

app.post('/api/courses', async (req, res) => {
  try {
    const { title, instructor } = req.body;
    const course = new Course({ title, instructor });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

app.get('/api/courses/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Course not found');
  res.json(course);
});

app.put('/api/courses/:id', async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!course) return res.status(404).send('Course not found');
  res.json(course);
});

app.delete('/api/courses/:id', async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).send('Course not found');
  res.send('Course deleted');
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, age, courseIds } = req.body;
    const student = new Student({ name, age, courseIds: courseIds || [] });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.get('/api/students/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.json(student);
});

app.put('/api/students/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).send('Student not found');
  res.json(student);
});

app.delete('/api/students/:id', async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.send('Student deleted');
});

app.get('/api/students/:id/courses', async (req, res) => {
  const student = await Student.findById(req.params.id).populate('courseIds');
  if (!student) return res.status(404).send('Student not found');
  res.json(student.courseIds);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
