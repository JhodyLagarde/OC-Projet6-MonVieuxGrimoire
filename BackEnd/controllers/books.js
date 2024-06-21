const Book = require('../models/books');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.Filename}`,
    });
    book.save()
      .then(() => { res.status(201).json({message: 'Livre enregistré !'}) })
      .catch(error => { res.status(400).json({ error })});
};