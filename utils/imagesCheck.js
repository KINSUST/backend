const fs = require('fs');
const path = require('path');
  
const checkImage=(folderName)=>{
const imagesNames = fs.readdirSync(
  path.join(__dirname, `../public/images/${folderName}`)
);
  const images = [];
  imagesNames.forEach((imageName) => {
    images.push(imageName);
  });

  return images
}



module.exports =checkImage