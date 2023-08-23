const fs = require("fs");

// reading the files in the public/avatars folder to display all the avatars
function getAvatarsImages() {
    let fileNames = fs.readdirSync("avatars");
    const allowedFileTypes = [".bmp", ".jpg", ".jpeg", ".png", ".gif"];
    const images = fileNames.filter(function(fileName) {
        const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
        return allowedFileTypes.includes(extension);
    }).map(function(image) {
        return  image;
    });
    return images;
}

module.exports ={
    getAvatarsImages
};