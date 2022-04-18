var db = require('../config/connection')
var collection = require('../config/collections')
const { path, response } = require('../app')
const objectId = require('mongodb').ObjectId
const async = require('hbs/lib/async')
const { Collection } = require('mongodb')
const { promise, reject } = require('bcrypt/promises')
module.exports = {
   addBook: (book, callback) => {
       console.log(book)
       db.get().collection('book').insertOne(book).then((data) => {
           // console.log(data)
           callback(true)
       })
   },
   //get all details of books
   getAllbooks:()=>{
       return new Promise(async (resolve,reject)=>{
           let books=await db.get().collection(collection.BOOK_COLLECTION).find().toArray()
           resolve(books)
       })
   },
   getBooksDetails: (bookId)=>{
       return new Promise((resolve,reject)=>{
           db.get().collection(collection.BOOK_COLLECTION).findOne({_id: objectId(bookId)}).then((books)=>{
               resolve(books)
           })
       })
   },
   updateBooks:(bookId,bookDetails)=>{
       return new Promise((resolve,reject)=>{
           db.get().collection(collection.BOOK_COLLECTION)
           .updateOne({_id: objectId(bookId)},{
               $set: {
                   Name: bookDetails.Name,
                   author: bookDetails.author,
                   Description: bookDetails.Description,
                   file: bookDetails.file,
               }
           }).then((response)=>{
               resolve()
           })
       })
   },
   deleteBook: (bookId)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("bokid"+bookId)
            db.get().collection(collection.BOOK_COLLECTION).deleteOne({_id: objectId(bookId)}).then((response)=>{
                resolve(response)
            })
        })
   }
}