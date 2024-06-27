const express = require('express');
const router = express.Router();

//Middlewares 
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sharp = require('../middlewares/sharp-config');

//Controllers
const booksCtrl = require('../controllers/books');

//Routes pour créer, modifier, supprimer et renvoyer un ou tous les livres
router.post('/', auth, multer, sharp, booksCtrl.createBook);
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);

//Routes pour noter un livre et renvoyer les trois livres les mieux noté 
router.get('/bestrating', booksCtrl.bestRating);
router.post('/:id/rating', auth, booksCtrl.postRating);

module.exports = router;