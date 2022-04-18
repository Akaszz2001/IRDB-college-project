var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const async = require('hbs/lib/async')
module.exports={
     doSignup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
         adminData.Password=await bcrypt.hash(adminData.Password,10)
         db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then(adminData)
            resolve(adminData)
         
        })
       
     }
}  