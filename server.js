const express = require('express');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Import connect-mongo for MongoDB session store
require('dotenv').config(); // Load environment variables
const authRoutes = require('./src/routes/authRoutes'); // Import routes for authentication

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static file
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine and views directory
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Session middleware with MongoDB session store
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
  resave: false, // Do not save session data if session is unmodified
  saveUninitialized: false, // Do not save new, uninitialized sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // Use the MongoDB URI from environment variables
    collectionName: 'sessions', // Name of the collection to store sessions
    ttl: 24 * 60 * 60 // Session expiration time in seconds (1 day)
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production environment
    sameSite: 'strict', // Mitigate CSRF attacks by preventing cross-origin access
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// News API endpoint
app.get('/api', async (req, res) => {
  try {
    console.log(req._parsedUrl.query);
    let url = `https://newsapi.org/v2/everything?` + req._parsedUrl.query;
    let response = await axios(url);
    let data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.get('/api/viral-news', async (req, res) => {
  try {
    const apiKey = '698b363525234412b0811509433adde4'; // Your NewsAPI key
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=24&apiKey=${apiKey}`;
    
    const response = await axios(url);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // Ensure SSL is used
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1);
  });

// Use authentication routes
app.use(authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
