const jwt =require("jsonwebtoken")

 const CreateToken = (data, expire = "600s") => {
  return jwt.sign(data, process.env.SECRET_CODE, { expiresIn: expire });
};

module.exports =CreateToken
