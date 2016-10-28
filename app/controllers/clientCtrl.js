//client controller class, handles client connections


module.exports = function(tempService) {

    var connectedUsersCount = 0;
    var connectedUsers = [];

    function ClientController() {

    }

    //client connected
    ClientController.clientConnected = function (client) {
        connectedUsersCount++;
        connectedUsers[client.id] = client.id;
        console.log("Client " + client.id + " connected");
        console.log("Connected clients #" + connectedUsersCount);
        sendDataToClient(client);
    };

    //client refreshed
    ClientController.clientRefreshed = function (client) {
        sendDataToClient(client);
    };

    //client disconnected
    ClientController.clientDisconnected = function (client) {
        delete connectedUsers[client.id];
        connectedUsersCount--;
        console.log("Client " + client.id + " disconnected");
        console.log("Connected clients #" + connectedUsersCount);
    };

    /**
     * //send data to all the given clients
     * @param client
     */
    var sendDataToClient = function(client) {
        var data = {};
        data['currentTemperature'] = tempService.getCurrentTemperature();
        client.emit('getTemperature', data);
        console.log("Data sent to client " + tempService.getCurrentTemperature());
    };

    return ClientController;
};