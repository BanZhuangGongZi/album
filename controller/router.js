/**
 * Created by huangk on 7/14/2016.
 */
var sha1 = require("sha1");
var XmlParse = require("pixl-xml");
var getRawBody = require('raw-body');
var typer = require('media-typer')
var wechatCfg = require("./../wechat/wechatcfg.json");
var file = require("../models/file");
exports.showIndex = function (req, res) {
    file.getAllAlbums(function (albums) {
        res.render('index', {
            "albums": albums
        })
    })
};
exports.showAlbums = function (req, res, next) {
    var albumName = req.params.albumsName;
    file.getAllImagesByAlbumName(albumName, function (images) {
        res.render('album', {
            "albumname": albumName,
            "images": images
        })
    }, next);
};

exports.checkToken = function (req, res, next) {
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
            res.send(echostr);
            res.end();
        } else {
            console.log("check wechat token failed in GET.");
        }
    }
    if (req.method == "POST") {
        getRawBody(req, {
            length: req.headers['content-length'],
            limit: '1mb',
            encoding: typer.parse(req.headers['content-type']).parameters.charset
        }, function (err, rawXML) {
            if (err) {
                return next(err)
            }
            console.log(rawXML);
            var message = XmlParse.parse(rawXML);
            if (message.Content == "2") {
                res.set("Content-Type", "text/xml");
                res.send(`<xml>
                <ToUserName><![CDATA[${ message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${ message.ToUserName}]]></FromUserName>
                <CreateTime>${ Date.now()}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[你很2吗？]]></Content>
        </xml>`);
            } else {
                res.set("Content-Type", "text/xml");
                res.send(`success`);
            }
        })
    }
};
