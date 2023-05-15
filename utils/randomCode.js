const randomString = require("randomstring");



const randomCode=(length)=>{
    return randomString.generate({
      length,
      charset: "numeric",
    });
}

module.exports=randomCode