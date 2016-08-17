var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs")
var bodyParser = require('body-parser');
var pug = require("pug");

var imageCount = 1;

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: false }));
app.use(express.static('./'));

app.set("views", "./views");
app.set("view engine", "pug");

app.get('/tagRedirect', function (req, res) {
  fs.readFile("./views/tag.pug", function (err, content) {
    //var rendered = content.toString().replace("filepath", "../gowanusImages/img" + imageCount + ".png");
	var rendered = content.toString();
	fs.writeFile('tag.html', rendered);
  });
  imageCount++;
});

app.get('/verifyRedirect', function (req, res) {
  fs.readFile("./views/verify.pug", function (err, content) {
   // var rendered = content.toString().replace("filepath", "../gowanusImages/img" + imageCount + ".png");
    var rendered = content.toString();
	fs.writeFile('verify.html', rendered);
  });
  imageCount++;
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/save', function(req, res) {
	handleSave(req.body.record, 0);
	return res.send();
}); 

app.post('/vaSave', function(req, res) {
	handleSave(req.body.vaRecord, 1);
	return res.send();
}); 

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  var clients = Object.keys(io.eio.clients);
  socket.on('users', function(fn){
	  fn(clients);
  });
  socket.on('gpMove', function(msg) {
	  io.sockets.emit('gpUpdateMap', msg);
  });
  socket.on('vaMove', function(msg) {
	  io.sockets.emit('vaUpdateMap', msg);
  });
});

var handleSave = function (state, log) {
	var string = String(state);
	/*var newString = string.split(',');
	var newNewString= '';
	for (var counter = 0; counter<= newString.length-1; counter++) {
		newNewString+=newString[counter];
		newNewString+= '\r\n';
	}*/
	if (log == 0) fs.writeFile('log.txt', string);
	else if (log == 1) fs.writeFile('vaLog.txt', string);
};