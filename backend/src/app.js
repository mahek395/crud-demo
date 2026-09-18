const express = require('express');
const cors = require('cors');
const path = require('path');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/registrations', registrationRoutes);

app.get('/', (req, res) => {
  res.send('MEMIGHTY CRUD rehearsal API is running');
});

module.exports = app;
