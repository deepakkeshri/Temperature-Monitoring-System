// set up
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);

//host and port
var host = "localhost";
var port  	 = 3000;

//configure client root directory
app.use(express.static(__dirname + '/client'));

// routes
require('./app/routes/routes.js')(app,io);

// listen (start app with node app.js)
server.listen(port, host, function(err) {
    if (err != undefined)
        console.log(err);
    console.log(server.address());
    console.log("Client: http://localhost:3000/");
    console.log("Simulator: http://localhost:3000/#!/simulator/");
});