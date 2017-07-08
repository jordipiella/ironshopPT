var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/thor', function(req, res, next) {
  res.render('index', { title: 'thor' });
});

router.get('/pol', function (req, res, next) {
  res.render('index', { title: 'pol' });
});

module.exports = router;
