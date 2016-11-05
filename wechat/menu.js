/**
 * Created by huangk on 11/4/2016.
 */
'use strict'

module.exports = {
    'button': [{
        'name': '排行榜',
        'sub_button': [{
            'name': '最热的',
            'type': 'click',
            'key': 'movie_hot'
        }, {
            'name': '最冷的',
            'type': 'click',
            'key': 'movie_cold'
        }]
    }, {
        'name': '分类',
        'sub_button': [{
            'name': '犯罪',
            'type': 'click',
            'key': 'movie_crime'
        }, {
            'name': '动画',
            'type': 'click',
            'key': 'movie_cartoon'
        }]
    }, {
        'name': '相册',
        'type': 'view',
        'url': 'http://115.159.46.201/',
        'key':'album'
    }]
};