var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const async = require('hbs/lib/async')
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(userData)
            resolve(userData)
        }) 
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            loginStatus=false;
            let response={}
           let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('login success');
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({status:false} ) 
                    }
                })
            }else{
                console.log("no user found ")
                resolve({status:false})
            }
        })
    },
    // getData:()=>{
    //     return new Promise((resolve,reject)=>{
    //         let mData=db.get().collection(collection.PRODUCT_COLLECTION).findOne()
    //     })
    //     }
    // }
    
} 