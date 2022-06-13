var express = require('express');
const res = require('express/lib/response');
const { response, render } = require('../app');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
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
  productHelper.getAllproducts().then((products) => {
    let a = req.session.user;
    res.render('admin/view-products', { admin: true, products ,a})
  })
})



router.get('/add-product', verifyAdmin,(req, res) => {
  let a = req.session.user;
  res.render('admin/add-product',{ admin: true,a})
});
// router.post('/add-product',(req,res)=>{
//   console.log(req.body);
//   console.log(req.files); 
//   productHelper.addProduct(req.body,(result)=>{
//     let image=req.files
//     console.log(result)
//     image.mv('.public/images/'+id+'.jpg',(err,done)=>{
//       if(!err){
//         res.render('admin/add-product')
//       }else{
//         console.log(err)
//       }
//     })
// })
// })
router.post('/add-product', (req, res) => {
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
        res.render('admin/add-product', { admin: true,a })

      }
    })
  }
  productHelper.addProduct(req.body, (result) => {
    //     let image=req.files
    
  })
})

router.get('/delete-product/:id',verifyAdmin, (req, res) => {
  let proId = req.params.id;

  console.log("id:" + proId)
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })
})
router.get('/edit-movie/:id',verifyAdmin, async (req, res) => {
  let product = await productHelper.getProductDetails(req.params.id)
  let a = req.session.user;

  res.render('admin/edit-movie', { product,admin:true,a })
});

router.post('/edit-movie/:id', (req, res) => {
  req.body.file = req.files.image.name;
  console.log(req.body);

  productHelper.updateMovie(req.params.id, req.body).then(() => {
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
    var file = req.files.image
    var filename = file.name

    file.mv('./public/book-images/' + filename, function (err) {
      if (err) {
        res.send(err)
      } else {
        res.render('admin/Add-book')
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



    if (req.files.image) {
      let Image = req.files.image
      var filename = Image.name

      Image.mv('./public/book-images/' + filename)

    }
    res.redirect('admin/view-books', { admin: true })

  })
})
router.get('/delete-book/:id',verifyAdmin, (req, res) => {
  let bookId = req.params.id;
  bookHelper.deleteBook(bookId).then((response) => {
    res.redirect('admin/view-books')
  })
})



//admin login
// router.get('/login-admin', (req, res) => {
//   res.render('admin/login', { admin: true })
// })

// //admin signup
// router.get('/signup-admin', (req, res) => {
//   res.render('admin/signup', { admin: true })
// })
// router.post('/signup', (req, res) => {
//   adminHelper.doSignup(req.body).then((response) => {
//     console.log(req.body);
//     console.log(response);
//     res.redirect('/')
//   })
// })
module.exports = router;