const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

require('dotenv').config();

// Connexion a mongoDB
mongoose.connect(process.env.ADDRESS_DB ,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
      .then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création de l'application express
const app = express();

//BodyParser avec middleware express
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Routing
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

// Gestion d'image
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;