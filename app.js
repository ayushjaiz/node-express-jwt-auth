const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://ayush12:HtOy0FKQWRBgbmNH@cluster0.4b8azef.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => { app.listen(8500); console.log('sever ruunning and database connected') })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

app.get('/set-cookies', (req, res) => {
  res.setHeader('Set-Cookie', 'newUser=true');
  // res.cookie('newUser', false);
  // res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }); 

  res.send('you got the cookies!');
});

app.get('/get-cookies', (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
})