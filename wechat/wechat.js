/**
 * Created by huangk on 11/4/2016.
 */

var Promise = require("bluebird");
var request = Promise.promisify(require('request'));
var wechatCfg = require("./wechatcfg.json");
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    menu: {
        create: prefix + 'menu/create?',
        get: prefix + 'menu/get?',
        del: prefix + 'menu/delete?',
        current: prefix + 'get_current_selfmenu_info?'
    }
};
function Wechat(opt) {
    this.appID = wechatCfg.appID;
    this.appSecret = wechatCfg.appSecret;
    this.getAccessToken = opt.getAccessToken;
    this.saveAccessToken = opt.saveAccessToken;
    this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function () {
    var that = this;
    return this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                return that.updateAccessToken();
            }

            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data);
            }
            else {
                return that.updateAccessToken();
            }
        })
        .then(function (data) {
            that.saveAccessToken(data);
            return Promise.resolve(data);
        })
};

Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());

    if (now < expires_in) {
        return true;
    }
    else {
        return false;
    }
};

Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;
    return new Promise(function (resolve, reject) {
        request({ url: url, json: true }).then(function (response) {
            var data = response.body;
            var now = (new Date().getTime());
            var expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        })
    })
};

Wechat.prototype.createMenu = function (menu) {
    var that = this;

    return new Promise(function (resolve, reject) {
        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.menu.create + 'access_token=' + data.access_token;

                request({ method: 'POST', url: url, body: menu, json: true }).then(function (response) {
                    var _data = response.body;

                    if (_data) {
                        resolve(_data);
                    }
                    else {
                        throw new Error('Create menu fails');
                    }
                })
                    .catch(function (err) {
                        reject(err);
                    })
            })
    })
};

module.exports = Wechat;