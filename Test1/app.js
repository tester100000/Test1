const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const students = [
  { id: 1, name: "Jane Doe", age: 20, courseIds: [101] }
];
const courses = [
  { id: 101, title: "Introduction to Programming", duration: "10 weeks", instructor: "Dr. Smith" }
];
let nextStudentId = 2;
let nextCourseId = 102;

app.get('/api/students', (req, res) => {
  res.json(students);
});
app.post('/api/students', (req, res) => {
    const { name, age, courseIds } = req.body;
    if (!name || !age) {
        return res.status(400).send('Name and age are required.');
    }
    const newStudent = {
        id: nextStudentId++,
        name,
        age,
        courseIds: courseIds || []
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

app.get('/api/courses', (req, res) => {
  res.json(courses);
});
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('Course not found');
  }
  res.json(course);
});
app.post('/api/courses', (req, res) => {
  const { title, duration, instructor } = req.body;
  if (!title || !duration || !instructor) {
    return res.status(400).send('Title, duration, and instructor are required.');
  }
  const newCourse = {
    id: nextCourseId++,
    title,
    duration,
    instructor
  };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('Course not found');
  }
  const { title, duration, instructor } = req.body;
  course.title = title || course.title;
  course.duration = duration || course.duration;
  course.instructor = instructor || course.instructor;

  res.json(course);
});


const admin = express();

admin.on('mount', (parent) => {
  console.log('Admin Mounted');
});

admin.get('/', (req, res) => {
  res.send('Admin Homepage');
});

app.use('/admin', admin);


app.get('/', (req, res) => {
    res.send('Welcome to the Student and Course API!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
