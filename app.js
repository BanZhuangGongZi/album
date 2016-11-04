var express=require('express');
var app=express();
var router=require('./controller');
//设置模板引擎--ejs
console.log(__dirname);
app.set('view engine','ejs');
//设置静态文件服务
app.use(express.static('./public'));
app.use(express.static('./uploads'));
//设置根路由
app.get('/',router.showIndex);
app.get('/:albumsName',router.showAlbums);
app.get('/wechat/check-token',router.checkToken);
//最后的中间件404页面
app.use(function (req,res) {
res.render("err");
});
app.listen(80);