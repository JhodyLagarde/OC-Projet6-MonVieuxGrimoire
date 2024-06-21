const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const booksCtrl = require('../controllers/book');

//Routes pour créer, modifier, supprimer et renvoyer un ou tous les livres
router.post('/', auth, multer, booksCtrl.createBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);

//Routes pour noter un livre et renvoyer les trois livres les mieux noté 
// router.get('/bestrating', booksCtrl.getBestRating);
// router.post('/:id/rating', auth, booksCtrl.postRating);

module.exports = router;