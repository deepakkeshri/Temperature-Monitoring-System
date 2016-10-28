//Simulator class responsible for reading sensor and updating server

(function () {

    var app = angular.module('meanApp');
    var timer;
    var socket;

    //simulator controller
    function SimulatorCtrl($scope, $timeout) {

        var self = this;
        socket = io('/simulator');

        $scope.currentTemperature = 0;
        $scope.isConnected = false;
        $scope.isServerOnline = false;
        $scope.updateInterval = 1000;   //milliseconds
        $scope.lastRefreshed = Date.now();

        $scope.$watch('isAutoUpdate', function() {
            if ($scope.isAutoUpdate)   {
                self.updateAutomatically($scope, $timeout);
            } else {
                $timeout.cancel(timer);
            }
        });

        $scope.connectBtn = function() {
            self.connect($scope);
        };

        $scope.disConnectBtn = function() {
            self.disconnect($scope);
        };

        $scope.updateBtn = function() {
            self.update($scope);
        };

        //simulator connected
        socket.on('connect', function() {
            console.log('Simulator connected');
            $scope.isAutoUpdate = true;
            $scope.isConnected = true;
            $scope.isServerOnline = true;
            $scope.$apply();
        });

        //simulator disconnected
        socket.on('disconnect', function() {
            console.log('Simulator disconnected');
        });

        socket.on("connect_error", function() {
            console.log('Connection Refused');
            $scope.isServerOnline = false;
            $scope.disConnectBtn();
        });
    }

    //handler for connection
    SimulatorCtrl.prototype.connect =function($scope) {
        socket.connect();
        $scope.isConnected = true;
        $scope.isAutoUpdate = true;
    };

    //handler for disconnection
    SimulatorCtrl.prototype.disconnect =function($scope) {
        socket.disconnect();
        $scope.isConnected = false;
        $scope.isAutoUpdate = false;
    };

    //update the server on click
    SimulatorCtrl.prototype.update =function($scope) {
        var self = this;
        self.updateTempToServer($scope);
    };

    //Automatically update the server
    SimulatorCtrl.prototype.updateAutomatically = function($scope, $timeout){
        var self = this;
        timer = $timeout(function() {
            self.updateTempToServer($scope);
            self.updateAutomatically($scope, $timeout);
        }, $scope.updateInterval)
    };

    //send data to server
    SimulatorCtrl.prototype.updateTempToServer = function($scope) {
        var self = this;
        var data = {};
        self.getSensorReading($scope);
        data['currentTemperature'] =  $scope.currentTemperature;
        socket.emit('updateTemperature', data);
        socket.on("updateTemperatureSuccess", function() {
            $scope.lastUpdated = Date.now();
        });
        console.log('Data send to server ' + data['currentTemperature']);
    };

    //Get reading from sensor
    SimulatorCtrl.prototype.getSensorReading = function($scope) {
        $scope.currentTemperature = Math.floor((Math.random() * 100));
        //$scope.$apply();
    };

    //config
    function config($routeProvider) {
        $routeProvider

            .when('/simulator/', {
                templateUrl: '/simulator/simulator.view.html',
                controller: 'simulatorCtrl',
                controllerAs: 'vm'
            })
    }

    //run
    function run($rootScope) {
        $rootScope.reload();
    }

    //injection
    SimulatorCtrl.$inject = ['$scope','$timeout'];

    app.controller('simulatorCtrl', SimulatorCtrl);
    app.config(['$routeProvider', config]);
    app.run(['$route', run]);

})();