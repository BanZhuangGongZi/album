/**
 * Created by huangk on 7/14/2016.
 */
var file=require("../models/file");
exports.showIndex = function (req, res) {
    file.getAllAlbums(function (albums) {
        res.render('index', {
            "albums": albums
        })
    })
};
exports.showAlbums = function (req, res,next) {
    var albumName=req.params.albumsName;
    file.getAllImagesByAlbumName(albumName,function (images) {
        res.render('album', {
            "albumname": albumName,
            "images":images
        })
    },next);
}
