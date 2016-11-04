var fs = require("fs");
exports.getAllAlbums = function (callback) {
    fs.readdir("./uploads", function (err, files) {
        var albums = [];
        (function interator(i) {
            if (i == files.length) {
                callback(albums);
                return;
            }
            fs.stat("./uploads/" + files[i], function (err, stats) {
                if (stats.isDirectory()) {
                    albums.push(files[i]);
                }
                interator(i + 1);
            });
        })(0);
    });
}

exports.getAllImagesByAlbumName = function (albumName, callback,next) {
    fs.readdir("./uploads/"+albumName, function (err, files) {
        var images = [];
        if(err){
            next();
            return;
        }
        (function interator(i) {
            if (i == files.length) {
                callback(images);
                return;
            }
            fs.stat("./uploads/" + albumName+"/"+files[i], function (err, stats) {
                if (stats.isFile()) {
                    images.push(files[i]);
                }
                interator(i + 1);
            });
        })(0);
    });
}