//simulator class to get sensor reading from simulator and publish to clients

module.exports = function(tempService) {

    var connectedSimulatorsCount = 0;
    var connectedSimulators = [];
    var clientDataSendRate = 2000;

    function SimulatorController() {

    }

    //simulator connected
    SimulatorController.simulatorConnected = function(socket) {
        connectedSimulatorsCount++;
        connectedSimulators[socket.id]  = socket.id;
        console.log("Simulator " + socket.id + " connected");
        console.log("Connected Simulators #" + connectedSimulatorsCount);
    };

    //simulator disconnected
    SimulatorController.simulatorDisconnected = function(socket) {
        delete connectedSimulators[socket.id];
        connectedSimulatorsCount--;
        console.log("Simulator " +  socket.id + " disconnected");
        console.log("Connected Simulators #" + connectedSimulatorsCount);
    };

    //update temperature after receiving from simulator
    SimulatorController.updateTemperature = function(socket, pData) {
        updateTemperatureSuccess(socket, pData);
        tempService.processNewTemperature(pData);
    };

    /**
     * Acknowledge sensor/socket on data received
     * @param socket
     * @param pData
     */
    var updateTemperatureSuccess = function(socket, pData) {
        socket.emit('updateTemperatureSuccess','success');
        console.log("Data received from simulator " + pData['currentTemperature']);
    };

    /**
     * Sends data to given clients at regular interval
     * Helpful when there are large number of clients
     * @param clientRoom
     */
    SimulatorController.sendDataToAllClientsRegularly = function(clientRoom) {
        setInterval(function() {
            sendDataToAllClients(clientRoom);
        }, clientDataSendRate);
    };

    /**
     * //send data to all the given clients
     * @param clientRoom
     */
    var sendDataToAllClients = function(clientRoom) {
        if (connectedSimulatorsCount !=0 ) {
            var data = {};
            data['currentTemperature'] = tempService.getCurrentTemperature();
            clientRoom.emit('getTemperature', data);
            console.log("Data sent to all clients " + tempService.getCurrentTemperature());
        }
    };

    return SimulatorController;
};
