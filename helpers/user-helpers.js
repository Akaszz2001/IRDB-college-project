var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const async = require('hbs/lib/async')
const { promise } = require('bcrypt/promises')
const { ObjectId } = require('mongodb')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            //console.log("userData.Password: ", userData.Password);
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((status)=>{
                resolve(userData)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                })
            } else {
               
                resolve({ status: false })
            }
        })
    },
    // getData:()=>{
    //     return new Promise((resolve,reject)=>{
    //         let mData=db.get().collection(collection.PRODUCT_COLLECTION).findOne()
    //     })
    //     }
    // }

        //add reviews to db
    addReview:(reviewData,callback)=>{
                console.log(reviewData);
            db.get().collection('review').insertOne(reviewData).then((data)=>{
                callback(true)
            })
        
    },
    // take reviews

    getReview:(movieId)=>{
        return new Promise(async(resolve,reject)=>{
            let reviews=await db.get().collection(collection.MOVIE_COLLECTION).findOne({_id: ObjectId(movieId)}).then((reviews)=>{
                console.log('reviw:',reviews);
                resolve(reviews)
            })
        })
          
     
    },

    //get books details

    getBookDetails:(bookId)=>{
        return new Promise(async(resolve,reject)=>{
            let bD=await db.get().collection(collection.BOOK_COLLECTION).findOne({_id:ObjectId(bookId)}).then((bD)=>{
                console.log("books:",bD);
                resolve(bD)
            })
        })
    }
} 


// getAllproducts: () => {
//     return new Promise(async (resolve, reject) => {
//         let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
//         resolve(products)
//     })