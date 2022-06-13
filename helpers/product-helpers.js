var db = require('../config/connection')
var collection = require('../config/collections')
const { path, response } = require('../app')
const objectId = require('mongodb').ObjectId
const async = require('hbs/lib/async')
const { Collection } = require('mongodb')
module.exports = {
    addProduct: (product, callback) => {
        console.log(product)
        db.get().collection('product').insertOne(product).then((data) => {
            // console.log(data)
            callback(true)
        })
    },
    //using promise
    getAllproducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            console.log("products" + products);
            resolve(products)
        })
    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            console.log(proId)
            console.log(objectId(proId));
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(proId) }).then((response) => {
                // console.log(response)
                resolve(response)
            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    //update movie
    updateMovie: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: objectId(proId) }, {
                    $set: {
                        Name: proDetails.Name,
                        Description: proDetails.Description,
                        file: proDetails.file,

                    }
                }).then((response) => {
                    resolve()
                })
        })
    },

    //post reviews
    postReview: async (movieId, cd, user, Review) => {


        await db.get().collection(collection.PRODUCT_COLLECTION).updateMany({ _id: objectId(movieId) }, {
            $push: {
                Reviews: {
                    Uname: user,
                    Date: cd,
                    Review: Review,
                }

            }
        }).then(() => {
            return
        })

    },
    //search movies
    searchMovie: async (searchKey) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ Name: searchKey }).then((movie) => {
                if (movie) {
                    resolve(movie._id);
                } else {
                    reject("No Results")
                }

            })

        })


    },
    postBookReview:async(movieId, cd, user, Review)=>{
        await db.get().collection(collection.BOOK_COLLECTION).updateMany({ _id: objectId(movieId) }, {
            $push: {
                Reviews: {
                    Uname: user,
                    Date: cd,
                    Review: Review,
                }

            }
        }).then(() => {
            return
        })
    }
}
