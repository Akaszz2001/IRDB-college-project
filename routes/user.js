var express = require('express');
const { header } = require('express/lib/request');
const { response } = require('../app');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user)
  productHelper.getAllproducts().then((products) => {

    res.render('user/view-database', { products, user })

  })
});
router.get('/login',(req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.userLoginErr })
    req.sessionLoginErr = false
  }

})
router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    console.log(response)
    
    req.session.user = response.user
    req.session.user = true;
    res.redirect('/')
  })
}) 
router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
     
      req.session.user = response.user
      req.session.user.loggedIn = true;
      res.redirect('/')
    } else {
      req.session.userLoginErr = true
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.user=null;
  res.redirect('/')
})
router.get('/homepage', (req, res) => {
  res.render('user/homepage')
})
router.get('/movies', verifyLogin, (req, res) => {
  res.render('user/movies')
})


module.exports = router;
