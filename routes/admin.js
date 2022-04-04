var express = require('express');
const res = require('express/lib/response');
const { response } = require('../app');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')


/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getAllproducts().then((products) => {
    console.log(products)
    res.render('admin/view-products', { admin: true, products })
  })


});
router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
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
        res.render('admin/add-product')

      }
    })
  }
  productHelper.addProduct(req.body, (result) => {
    //     let image=req.files
    console.log(result)
  })
})
router.get('/Add-movie', (req, res) => {
  res.render('admin/Add-book')
})
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id;
  console.log("id:" + proId)
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })
})
router.get('/edit-movie/:id', async (req, res) => {
  let product = await productHelper.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-movie', { product })
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
})
module.exports = router;