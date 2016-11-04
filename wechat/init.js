/**
 * Created by huangk on 11/4/2016.
 */
'use strict'

var path = require('path');
var util = require('../libs/util');
var Wechat = require('./wechat');
var wechat_file = path.join(__dirname, './wechat.txt');

var config = {
    wechat: {
        getAccessToken: function () {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data);

            return util.writeFileAsync(wechat_file, data);
        }
    }
};
exports.wechatOptions = config;
exports.getWechat = function () {
    return new Wechat(config.wechat);
};
