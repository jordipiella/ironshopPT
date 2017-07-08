const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Review = require('../models/review');

router.get('/', (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) {
      next(err);
    } else {
      res.render('products/index', { products })
    }
  })
})

router.get('/new', (req, res, next) => {
  res.render('products/new');
})

router.post('/', (req, res, next) => {
  const productInfo = {
    name: req.body.name,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description
  }
  const newProduct = new Product(productInfo)
  newProduct.save( (err) => {
    if (err) { 
      return next(err) 
    } else {
      res.redirect('/products');
    }

  })

})

router.get('/search', (req, res) => {
  let query = req.query.searchTerm;

  let queryRegex = new RegExp(query);
  // We use a Regex here to find items that are similar to the search
  // For instance if I searched "Yoga", I would then find the Yoga Mat
  Product.find({ name: queryRegex }, (err, products) => {
    if (err) { next(err) }
    res.render('products/results', { products });
  })
});

router.get('/:id', (req, res, next) => {
  const productID = req.params.id;
  Product.findById(productID, (err, product) => {
    if (err) {
      next(err)
    } else {
      res.render('products/show', { product });
    }
  })
})

router.get('/:id/edit', (req, res, next) => {
  const productID = req.params.id;

  Product.findById(productID, (err, product) => {
    if (err) {
      next(err)
    } else {
      res.render('products/edit', { product });
    }
  })
})

router.post('/:id', (req, res, next) => {
  const productID = req.params.id;
  const updates = {
    name: req.body.name,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description, 
  }

  Product.findByIdAndUpdate(productID, updates, (err, product) => {
    if (err) {
      next(err)
    } else {
      res.redirect(`/products/${product._id}`)
    }
  })
})

router.post('/:id/delete', (req, res, next) => {
  const productID = req.params.id;
  Product.findByIdAndRemove(productID, (err, product) => {
    if (err) { return next(err); }
    return res.redirect('/products');
  });
})

router.post('/:id/reviews', (req, res, next) => {
  let productId = req.params.id;

  Product.findById(productId, (err, product) => {
    const newReview = new Review({
      content: req.body.content,
      stars: req.body.stars,
      author: req.body.author
    });

    product.reviews.push(newReview);

    product.save((err) => {
      res.redirect(`/products/${product._id}`);
    });
  });
})


module.exports = router;