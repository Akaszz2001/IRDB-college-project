var express = require('express');
const { header } = require('express/lib/request');
const { redirect } = require('express/lib/response');
const async = require('hbs/lib/async');
const { response } = require('../app');
const bookHelpers = require('../helpers/book-helpers');
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
  let user = req.session.user;
  res.render('user/homepage',{user})

});
router.get('/login', (req, res) => {
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
  if (req.body.Name == "" || req.body.Email == "" || req.body.Password == "") {
    res.status(500).send("Fields cannot be blank")
  } else {
    userHelper.doSignup(req.body).then((userData) => {
      //req.session.user = response.user
      // console.log("user:",userData)
      req.session.user = userData
      req.session.loggedIn = true;
      res.redirect('/')
    })
  }
  console.log("new email:", req.body.Email);
  // console.log("hello iam signup user");

})
router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response,result) => {
    if (response.status) {
  

      req.session.user = response.user;
      // console.log(response.user)
      req.session.user.loggedIn = true;
   
      if (response.user.isAdmin) {
      
        res.redirect('/admin')
      } else {
        res.redirect('/')
      }

    } else {
      // req.session.userLoginErr = true
      // res.redirect('/login')
      const loginErr="Username or password invalid"
      res.render('user/login', {loginErr })

      
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/')
})
router.get('/view-database', verifyLogin, (req, res) => {

  let user = req.session.user;
  console.log("user session: ", user);
  productHelper.getAllproducts().then((products) => {

    res.render('user/view-database', { products, user })  

  })

})
router.get('/movies', verifyLogin, (req, res) => {
  res.render('user/movies')
})



//view-books
router.get('/books', verifyLogin, (req, res) => {
  let user = req.session.user;
  bookHelpers.getAllbooks().then((books) => {

    res.render('user/view-books', { books, user })

  })
})

//view about page
router.get('/about', (req, res) => {
  let user = req.session.user;
  res.render('user/about', { user,admin: false })
})

//detailed view  of of movie

router.get('/rating/:id', verifyLogin, async (req, res) => {

  let reviews = await userHelper.getReview(req.params.id).then((reviews) => {
    let user = req.session.user;

    let my_reviews = reviews.Reviews;

    res.render('user/rating', { reviews, my_reviews, user })
  })
})
//add new review
router.post('/rating/:id', (req, res) => {
  let userName = req.session.user.Name;
  console.log("user:", userName);
  let dt = new Date();
  let date = ("0" + dt.getDate()).slice(-2);
  let month = ("0" + (dt.getMonth() + 1)).slice(-2);
  let year = dt.getFullYear();
  var currentDate = date + "/" + month + "/" + year;
  productHelper.postReview(req.params.id, currentDate, userName, req.body.Review).then(() => {
    res.redirect('/');
  })

})
router.post('/homepage', (req, res) => {
  let search = req.body.searchkey;
  productHelper.searchMovie(search).then((movieId) => {
    console.log("user page" + movieId);
    res.redirect(`/rating/${movieId}`)
  }).catch((noMovie) => {
    res.status(500).send(noMovie)
  })
  // console.log("Search key:",req.body.searchkey);
})
router.get('/booksDetailedView/:id', verifyLogin, async (req, res) => {
  let booksDetails = await userHelper.getBookDetails(req.params.id).then((booksDetails) => {
    console.log("books iamges:",booksDetails.file);
    let Reviews = booksDetails.Reviews;
    let user = req.session.user;
    res.render('user/booksDetailedView', { booksDetails, Reviews,user })
  })

})
router.post('/booksDetailedView/:id', (req, res) => {
  let userName = req.session.user.Name;
  let dt = new Date();
  let date = ("0" + dt.getDate()).slice(-2);
  let month = ("0" + (dt.getMonth() + 1)).slice(-2);
  let year = dt.getFullYear();
  var currentDate = date + "/" + month + "/" + year;
  productHelper.postBookReview(req.params.id, currentDate, userName, req.body.Review).then(() => {
    res.redirect('/');
  })
})

module.exports = router;