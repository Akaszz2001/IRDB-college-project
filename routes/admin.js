var express = require('express');
const res = require('express/lib/response');
const { response, render } = require('../app');
var router = express.Router();
var movieHelper = require('../helpers/movie-helpers')
var bookHelper = require('../helpers/book-helpers')
//  var adminHelper = require('../helpers/admin-helpers')
const verifyAdmin = (req, res, next) => {
  if (req.session.user.isAdmin) {
    next()
  } else {
    res.redirect('/login')
  }
}    


/* GET users listing. */
router.get('/', verifyAdmin, function (req, res, next) {
  let a = req.session.user;
  res.render('admin/admin-intro', { admin: true, a })
});
router.get('/view-movies', verifyAdmin, function (req, res, next) {
  movieHelper.getAllmovies().then((movies) => {
    let a = req.session.user;
    res.render('admin/view-movies', { admin: true, movies ,a})
  })
})



router.get('/add-movie', verifyAdmin,(req, res) => {
  let a = req.session.user;
  res.render('admin/add-movie',{ admin: true,a})
});

router.post('/add-movie', (req, res) => {
  if (req.files) {
    console.log(req.files);
    console.log("file name: ", req.files.image.name);
    req.body.file = req.files.image.name;
    console.log(req.body);
    var file = req.files.image
    var filename = file.name
    console.log(filename)


    file.mv('./public/product-images/' + filename, function (err) {
      if (err) {
        res.send(err)
      } else {
        let a = req.session.user;
        res.render('admin/add-movie', { admin: true,a })

      }
    })
  }
 movieHelper.addMovie(req.body, (result) => {
    //     let image=req.files
    
  })
})

router.get('/delete-product/:id',verifyAdmin, (req, res) => {
  let movId = req.params.id;

  console.log("id:" + movId)
  movieHelper.deleteMovie(movId).then((response) => {
    res.redirect('/admin')
  })
})
router.get('/edit-movie/:id',verifyAdmin, async (req, res) => {
  let movie = await movieHelper.getMovieDetails(req.params.id)
  let a = req.session.user;

  res.render('admin/edit-movie', { movie,admin:true,a })
});

router.post('/edit-movie/:id', (req, res) => {
  req.body.file = req.files.image.name;
  console.log(req.body);

  movieHelper.updateMovie(req.params.id, req.body).then(() => {
    res.redirect('/admin')


    if (req.files.image) {
      let Image = req.files.image
      var filename = Image.name

      Image.mv('./public/product-images/' + filename)

    }


  })
});
router.get('/Add-book',verifyAdmin, (req, res) => {
  let a = req.session.user;
  res.render('admin/Add-book',{admin:true,a})

})
router.get('/view-books',verifyAdmin, function (req, res) {
  bookHelper.getAllbooks().then((books) => {
    let a = req.session.user;
    res.render('admin/view-books', { admin: true, books ,a})
  })
})
router.post('/Add-book', (req, res) => {
  if (req.files) {
    req.body.file = req.files.image.name;
    var file = req.files.image;
    var filename = file.name;
    let a = req.session.user;

    file.mv('./public/book-images/' + filename, function (err) {
      
      if (err) {
        res.send(err)
      } else {
        
        res.render('admin/Add-book',{admin:true,a})
      }
    })
  }
  bookHelper.addBook(req.body, (result) => {
    
  })
})
router.get('/edit-books/:id',verifyAdmin, async (req, res) => {
  let books = await bookHelper.getBooksDetails(req.params.id)
  let a = req.session.user;
  res.render('admin/edit-books', { admin: true, books,a })
})
router.post('/edit-books/:id', (req, res) => {
  req.body.file = req.files.image.name;
  console.log(req.body);
  bookHelper.updateBooks(req.params.id, req.body).then(() => {
    res.redirect('/admin/view-books');


    if (req.files.image) {
      let Image = req.files.image
      var filename = Image.name

      Image.mv('./public/book-images/' + filename)

    }
    

  })
})
router.get('/delete-book/:id',verifyAdmin, (req, res) => {
  let bookId = req.params.id;
  bookHelper.deleteBook(bookId).then((response) => {
    res.redirect('/admin/view-books')
  })
})




module.exports = router;