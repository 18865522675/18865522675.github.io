//express_demo.js 文件
var express = require('express');
var app = express();
//var bodyParser = require('body-parser');
let url = require('url');
let util = require('util');
let fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;


 app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析

app.use(express.static('static'));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

app.get('/blog', function (req, res) {
  var pathname = url.parse(req.url).pathname; //获取url的pathname (/index.html)
//console.log(pathname)
  //console.log("file:"+pathname.substring(1)) //将‘/’去掉
  fs.readFile('index.html', function (err,data) { //fs模块加载文件
      if(err){
          res.writeHead(404,{
            'Content-Type':'text/html'
          });
      }else{
        res.writeHead(200,{
          'Content-Type':'text/html'
        });
        res.write(data.toString());
      };
      res.end();
  });
});

app.get('/getList',function(req,res){
	var conUrl = "mongodb://localhost:27017/";
	MongoClient.connect(conUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("notes");
    dbo.collection("blognotes"). find({}).sort({createTime:-1}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) 	throw err;
//      console.log(result);
		
        res.send(result)
        db.close();
    });
});	
});

app.post('/insert',urlencodedParser,function(req,res){
	var conUrl = "mongodb://localhost:27017/";
	MongoClient.connect(conUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("notes");
//  console.log(req.query)
    const noteInfo={
    	 'userName':'游客'+getrandom(),
    	 'note':req.query.note,
    	 'createTime':getTime()
    }
    dbo.collection("blognotes").insertOne(noteInfo, function(err, result) {
        if (err) throw err;
        console.log("文档插入成功");
//      console.log(result)
		res.send({resultCode:200,resultMsg:'成功插入一条数据'})
        db.close();
    });
});	
});

const getrandom=()=>{
	return Math.floor(Math.random()*100000000)
};
const getTime=(time)=>{
    
    var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    const Y = date.getFullYear() + '-';
    const D = getdouble(date.getDate()) + ' ';
    const h = getdouble(date.getHours()) + ':';
    const m = getdouble(date.getMinutes()) + ':';
    const s = getdouble(date.getSeconds());
    return Y+M+D+h+m+s;
    // console.log(this)
};

const getdouble=function(value){
if(value < 10) {
    return '0' + value
}
return value
}




 
var server = app.listen(8089, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})