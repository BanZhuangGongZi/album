/**
 * Created by huangk on 7/14/2016.
 */
var sha1 = require("sha1");
var wechatCfg = require("./wechatcfg.json");
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

exports.checkToken=function (req,res,next) {
    var token = wechatCfg.token;
    var signature = req.query.signature;
    var nonce = req.query.nonce;
    var timestamp = req.query.timestamp;
    var echostr = req.query.echostr;
    var checkStr = [token, nonce, timestamp].sort().join("");
    checkStr = sha1(checkStr);
    if (req.method == "GET") {
        if (checkStr == signature) {
            console.log("echostr:" + echostr);
            req.send(echostr);
            req.end();
        } else {
            console.log("check wechat token failed in GET.");
        }
    }
    next();
}
