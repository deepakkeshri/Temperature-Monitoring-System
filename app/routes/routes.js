//Defines all routes to app

var tempService = require('../services/tempService.js');
var simulatorCtrl = require('../controllers/simulatorCtrl.js')(tempService);
var clientCtrl = require('../controllers/clientCtrl.js')(tempService);


module.exports = function(app, io) {

    var simulatorRoom = io.of('/simulator');
    var clientRoom = io.of('/client');

    //simulator connection
    simulatorRoom.on('connection', function (socket) {

        //simulator connected
        simulatorCtrl.simulatorConnected(socket);

        //disconnect
        socket.on('disconnect', function() {
            simulatorCtrl.simulatorDisconnected(socket);
        });

        //listen to temperature reading published by sensor and update the simulator controller
        socket.on('updateTemperature', function(pData) {
            simulatorCtrl.updateTemperature(socket, pData);
        });
    });

    //client connection
    clientRoom.on('connection', function (socket) {

        //client connected
        clientCtrl.clientConnected(socket);

        //disconnect
        socket.on('disconnect', function() {
            clientCtrl.clientDisconnected(socket);
        });

        //refresh
        socket.on('refresh', function() {
            clientCtrl.clientRefreshed(socket);
        });
    });

    simulatorCtrl.sendDataToAllClientsRegularly(clientRoom);

    //For avoidong Heroku $PORT error
    app.get('/', function(request, response) {
        var result = 'App is running'
        response.send(result);
    }).listen(app.get('port'), function() {
        console.log('App is running, server is listening on port ', app.get('port'));
    });

};
