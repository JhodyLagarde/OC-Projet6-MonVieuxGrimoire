const Book = require('../models/Book');
const fs = require('fs');

// Créer un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      averageRating: bookObject.ratings[0].grade
  });
  book.save()
      .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
      .catch(error => { res.status(400).json( { error })});
};

// Modifier un livre appartenant à l'utilisateur qui l'a créé
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.Book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Supprimer un livre appartenant à l'utilisateur qui l'a créé
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

//Renvoyer les données d'un livre
exports.getOneBook = (req, res, next) =>{
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

//Renvoyer les données de tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

//Renvoyer les données des 3 livres ayant la meilleure note moyenne
exports.bestRating = (req, res, next) => {
	Book.find()
		.sort({ averageRating: -1 }).limit(3)
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }));
};

//Noter un livre, calcule de la note moyenne, gestion des notes utilisateurs (l'utilisateur peut noter qu'une seul fois un livre)
exports.postRating = (req, res, next) => {
    const { userId, rating } = req.body;
  
    const user = req.body.userId;
    
    if (user !== req.auth.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    Book.findById(req.params.id)
      .then(book => {
        if (!book) {
          return res.status(404).json({ error: "Livre introuvable" });
        }
        
        const userRating = book.ratings.find(rating => rating.userId === userId);
        
        if (userRating) {
          return res.status(400).json({ error: "Livre déjà noté" });
        }
        
        book.ratings.push({ userId, grade: rating });
  
        const allRatings = book.ratings.length;
        const ratingsSum = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        const averageRating = ratingsSum / allRatings;
        book.averageRating = averageRating;
  
        book.save()
          .then(updatedBook => {
            res.status(200).json(updatedBook);
          })
          .catch(error => {
            res.status(500).json({ error });
          });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  };