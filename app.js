var express    = require('express');
var app        = express();
var http       = require('http').Server(app);
var io         = require('socket.io')(http);
var fs         = require("fs")
var bodyParser = require('body-parser');
var pug        = require("pug");
var sessions   = require('client-sessions');
var Influx     = require('influx');

var influx = new Influx.InfluxDB({
  database:'logs_db',
  host:'192.168.210.128',
  schema: [
    {
      // /measurement: ['log', 'vaLog'],
      fields: {
        gpr0: Influx.FieldType.FLOAT,
        gpr1: Influx.FieldType.FLOAT,
        userT: Influx.FieldType.FLOAT,
        iAccel: Influx.FieldType.STRING,
        lastRole: Influx.FieldType.STRING,
        lastTargetIndex: Influx.FieldType.INTEGER,
        currentTarget: Influx.FieldType.INTEGER,
        behavior: Influx.FieldType.INTEGER
      },
      tags: [
        'user'
      ]
    }
  ]
});

influx.createDatabase('logs_db').catch(err=> {
    console.error("Error creating database");
    console.error(err.stack);
  });




var imageCount = 1;

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: false }));

app.use(sessions({
  cookieName: 'session',
  secret: 'B62lCMTsdZmqNLP5zfllQElQo9I6ImhZ1ODg4I4o4JkVmeQbgwgPJpAmMmfRPNL',
  duration: 30 * 60 * 1000,
  activeDuration: 3 * 60 * 1000,
  cookie: {
    httpOnly: true,
    secure: false,
    ephermeral: false
  }
}));

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

app.get('', function(req, res) {
  return res.redirect('/survey');
});

app.get('/', function(req, res){
//  return res.sendFile(__dirname + '/index.html');
	console.log('HONK h0nk');
	return res.redirect('/survey');
});

app.get('/trials', function(req, res) {
  return res.sendFile(__dirname + '/trials.html');
});

app.get('/survey', function(req, res) {
  return res.render('survey.pug');
});

app.get('/survey2', function(req, res) {
  return res.render('survey2.pug');
});

app.get('/survey2.html', function(req, res) {
  return res.render('survey2.pug');
});

app.get('/app-practice', function(req, res) {
  return res.sendFile(__dirname + '/app-practice.html');
});

app.get('/verify-practice', function(req, res) {
  return res.sendFile(__dirname + '/verify-practice.html');
});

app.get('/pre-preference', function(req, res) {
  return res.render('pre-preference.pug');
});

app.get('/verify-preference', function(req, res) {
  var imageId = 1;
  if (undefined !== req.session.verifyImageId) {
    imageId = req.session.verifyImageId;
  }
  if (null === req.session.firstTask) {
    req.session.firstTask = 'verify';
  }
  res.render('verify-preference', {imgSrc: './images/img' + imageId + '.png'});
//  return res.sendFile(__dirname + '/verify-preference.html');
});

app.get('/thanks', function(req, res) {
	return res.render('thanks.pug');
});

app.get('/reset', function(req, res) {
  req.session.reset();
  return res.sendFile(__dirname + '/reset.html');
});

app.get('/tag-practice', function(req, res) {
  req.session.firstTask = null;
  return res.sendFile(__dirname + '/tag-practice.html');
});

app.get('/tag-preference', function(req, res) {
  var imageId = 60;
  if (undefined !== req.session.tagImageId) {
    imageId = req.session.tagImageId;
  }
  if (null === req.session.firstTask) {
    req.session.firstTask = 'tag';
  }
  res.render('tag-preference', {imgSrc: './images/img' +imageId + '.png'});
//  return res.sendFile(__dirname + '/tag-preference.html');
});

app.get('/initialtime', function(req, res) {
  if (undefined === req.session.timeRemaining) {
    res.write('' + 120);
  } else {
    res.write('' + req.session.timeRemaining);    
  }
  return res.end();
});

app.post('/log', function(req, res) {
  data = JSON.parse(req.body.data);
  if (data.lastTargetIndex == null) data.lastTargetIndex = -1;
  influx.writeMeasurement('log', [
    {
      fields: {
        gpr0: data.gpr0,
        gpr1: data.gpr1,
        userT: data.userT,
        iAccel: data.iAccel,
        lastRole: data.lastRole,
        lastTargetIndex: data.lastTargetIndex
      },
      timestamp: data.time
    }
  ]);

  return res.end();
});

app.post('/vaLog', function(req, res) {
  data = JSON.parse(req.body.data);
  if (data.lastTargetIndex == undefined) data.lastTargetIndex = -1;
  influx.writeMeasurement('vaLog', [
    {
      fields: {
        gpr0: data.gpr0,
        gpr1: data.gpr1,
        userT: data.userT,
        iAccel: data.iAccel,
        lastRole: data.lastRole,
        lastTargetIndex: data.lastTargetIndex,
        currentTarget: data.currentTarget,
        behavior: data.behavior
      },
      timestamp: data.time
    }
  ]).catch(err => {
    console.error(err);
  });

  return res.end();
});

app.post('/survey', function(req, res) {
  req.session.q1_1 = req.body.q1;
  req.session.q2_1 = req.body.q2;
  req.session.q3_1 = req.body.q3;
  req.session.q4_1 = req.body.q4;
  req.session.q5_1 = req.body.q5;
  res.redirect('/tag-practice');
});

app.post('/survey2', function(req, res) {
  req.session.q1_2 = req.body.q1;
  req.session.q2_2 = req.body.q2;
  req.session.q3_2 = req.body.q3;
  req.session.q4_2 = req.body.q4;
  req.session.q5_2 = req.body.q5;
  req.session.q6_2 = req.body.q6;
  
  str  = req.session.q1_1 + ', ' + req.session.q2_1 + ', ' + req.session.q3_1 + ', ' + req.session.q4_1 + ', ' + req.session.q5_1 + '\n';
  str += req.session.q1_2 + ', ' + req.session.q2_2 + ', ' + req.session.q3_2 + ', ' + req.session.q4_2 + ', ' + req.session.q5_2 + ', ' + req.session.q6_2; 
  fs.writeFile('survey-results.txt', str);
  
  return res.redirect('/thanks');
});

app.post('/save', function(req, res) {
	handleSave(req.body.record, 0);
	return res.end();
}); 

app.post('/vaSave', function(req, res) {
	handleSave(req.body.vaRecord, 1);
	return res.end();
});

app.post('/savetagged', function(req, res) {
  if (undefined === req.session.numTags) {
    req.session.numTags = req.body.numTags;
  } else {
    req.session.numTags += req.body.numTags;
  }
  
  if (undefined === req.session.numImagesTagged) {
    req.session.numImagesTagged = req.body.numImagesTagged;
  } else {
    req.session.numImagesTagged += req.body.numImagesTagged;
  }
  
  req.session.tagImageId = req.body.imageId;
  
  if (undefined === req.session.numSwitches) {
    req.session.numSwitches = req.body.switched ? 1 : 0;
  } else {
    req.session.numSwitches += req.body.switched ? 1 : 0;
  }
  res.end();
});

app.post('/saveverified', function(req, res) {
  if (undefined === req.session.numVerifiedTags) {
    req.session.numVerifiedTags = req.body.numVerifiedTags;
  } else {
    req.session.numVerifiedTags += req.body.numVerifiedTags;
  }
  
  if (undefined === req.session.numImagesVerified) {
    req.session.numImagesVerified = req.body.numImagesVerified;
  } else {
    req.session.numImagesVerified += req.body.numImagesVerified;
  }
  
  req.session.verifyImageId = req.body.imageId;
  
  if (undefined === req.session.numSwitches) {
    req.session.numSwitches = req.body.switched ? 1 : 0;
  } else {
    req.session.numSwitches += req.body.switched ? 1 : 0;
  }
  res.end();
});

app.post('/savetime', function(req, res) {
  req.session.timeRemaining = req.body.timeRemaining;
  if (undefined !== req.body.timeVerifying) {
    if (undefined === req.session.timeVerifying) {
      req.session.timeVerifying = parseInt(req.body.timeVerifying);
    } else {
      req.session.timeVerifying += req.body.timeVerifying;
    }
  }
  if (undefined !== req.body.timeTagging) {
    if (undefined === req.session.timeTagging) {
      req.session.timeTagging = parseInt(req.body.timeTagging);
    } else {
      req.session.timeTagging += req.body.timeTagging;
    }
  }
  res.end();
});

app.post('/write', function(req, res) {
  console.log(req.body);
  if (req.body.numVerfiedTags !== undefined) {
    if (undefined === req.session.numVerifiedTags) {
      req.session.numVerifiedTags = req.body.numVerifiedTags;
    } else {
      req.session.numVerifiedTags += req.body.numVerifiedTags;
    }
  }
  
  if (req.body.numTags !== undefined) {
    if (undefined === req.session.numTags) {
      req.session.numTags = req.body.numTags;
    } else {
      req.session.numTags += req.body.numTags;
    }
  }
  
  if (req.body.numImagesVerified !== undefined) {
    if (undefined === req.session.numImagesVerified) {
      req.session.numImagesVerified = req.body.numImagesVerified;
    } else {
      req.session.numImagesVerified += req.body.numImagesVerified;
    }
  }
  
  if (req.body.numImagesTagged !== undefined) {
    if (undefined === req.session.numImagesTagged) {
      req.session.numImagesTagged = req.body.numImagesTagged;
    } else {
      req.session.numImagesTagged += req.body.numImagesTagged;
    }
  }
  
  if (req.body.timeVerifying !== undefined) {
    if (undefined === req.session.timeVerifying) {
      req.session.timeVerifying = req.body.timeVerifying;
    } else {
      req.session.timeVerifying += req.body.timeVerifying;
    }
  }
  
  if (req.body.timeTagging !== undefined) {
    if (undefined === req.session.timeTagging) {
      req.session.timeTagging = req.body.timeTagging;
    } else {
      req.session.timeTagging += req.body.timeTagging;
    }
  }
  
  var str = '';
  if (undefined === req.session.numTags) {
    str += '0'
  } else {
    str += req.session.numTags;
  }
  str += ', ';
  
  if (undefined === req.session.numImagesTagged) {
    str += '0';
  } else {
    str += req.session.numImagesTagged;
  }
  str += ', ';
  
  if (undefined === req.session.timeTagging) {
    str += '0';
  } else {
    str += req.session.timeTagging;
  }
  str += ', ';
  
  if (undefined === req.session.numVerifiedTags) {
    str += '0';
  } else {
    str += req.session.numVerifiedTags;
  }
  str += ', ';
  
  if (undefined === req.session.numImagesVerified) {
    str += '0';
  } else {
    str += req.session.numImagesVerified;
  }
  str += ', ';
  
  if (undefined === req.session.timeVerifying) {
    str += '0';
  } else {
    str += req.session.timeVerifying;
  }
  str += ', ';

  str += req.session.firstTask;
  
  fs.writeFile('pref-test.txt', str);
  return res.end();
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

var handleSave2 = function(log) {
  if (log == 0) fs.writeFile('log.txt', string);
  else if (log == 1) fs.writeFile('vaLog.txt', string);
}