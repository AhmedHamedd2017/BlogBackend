const datauri = require('datauri');
const path = require('path'); 
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

// module.exports = (() => {

//     datauri(path.extname(req.file.originalname).toString(), (err,content,meta) => {
//         if(err){
//             throw err;
//         }else{
//             cloudinary.uploader.upload(content, (error, url) => {
//                 if (err) 
//                     return reject(error);
//                 return resolve(url);
//             })
//         }
//     })
    
// });